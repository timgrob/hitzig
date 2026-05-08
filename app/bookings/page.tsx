import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Booking } from "@/types/booking"
import { Header } from "@/components/Header";
import { BookingsPageClient } from "@/components/BookingsPageClient";
import prisma from "@/lib/prisma";

export default async function BookingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login"); // fallback if user not found
    }

    const myBookings: Booking[] = await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: { room: true, user: true },
        orderBy: { checkIn: "asc" },
    });

    const serialized = myBookings.map(b => ({
        ...b,
        checkIn: b.checkIn.toISOString(),
        checkOut: b.checkOut.toISOString(),
    }));

    return (
        <>
            <Header />
            <div className="min-h-screen bg-zinc-50 py-10 px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-[#2D5774] text-2xl font-bold mb-6 text-left pb-6">
                        My Bookings
                    </h1>

                    <BookingsPageClient initialBookings={serialized} />
                </div>
            </div>
        </>
    );
}
