import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing user fields" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return new Response("Password must be at least 8 characters", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) {
            return new Response("Incorrect current password", { status: 403 });
        }

        const hashed = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashed },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}