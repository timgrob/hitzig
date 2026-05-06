import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyClients } from "@/app/api/bookings/stream/route";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    console.log("ID to delete", id)

    const booking = await prisma.booking.findUnique({
        where: { id },
    });

    if (!booking || booking.userId !== session.user.id) {
        return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.booking.delete({
        where: { id },
    });

    await notifyClients()

    return NextResponse.json(booking);
}