import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyClients } from "@/app/api/bookings/stream/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookings = await prisma.booking.findMany({
            include: { room: true, user: true },
            orderBy: { checkIn: "asc" },
        })

        return NextResponse.json(bookings);
    } catch (err) {
        console.error("Booking fetching error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { roomId, checkIn, checkOut } = body;

        if (!roomId || !checkIn || !checkOut) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existing = await prisma.booking.findFirst({
            where: {
                roomId,
                OR: [
                    {
                        checkIn: { lte: new Date(checkOut) },
                        checkOut: { gte: new Date(checkIn) },
                    },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Room already booked for these dates" },
                { status: 400 }
            );
        }

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                roomId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
            },
        });

        await notifyClients();

        return NextResponse.json(booking);
    } catch (err) {
        console.error("Booking error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
