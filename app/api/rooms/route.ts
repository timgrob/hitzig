import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getVisibleRoomsForUser } from "@/lib/rooms";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isCloseFriend: true },
    });

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await getVisibleRoomsForUser(user);

    return NextResponse.json(rooms);
}
