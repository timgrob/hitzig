import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { BookingFrom } from "@/components/BookingForm";
import { BookingCalendar } from "@/components/BookingCalendar";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login"); // fallback if user not found
  }

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      capacity: true,
    },
    orderBy: { name: "desc" },
  });

  const bookings = await prisma.booking.findMany({
    include: { room: true, user: true },
    orderBy: { checkIn: "asc" },
  })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-50 py-10 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Welcome title, left-aligned */}
          <h2 className="text-teal-950 text-2xl font-semibold mb-4 text-left pb-6">
            Book your stay {user?.firstName ?? session.user.email}!
          </h2>

          <div className="flex flex-col gap-18">
            <BookingFrom rooms={rooms} />
            <BookingCalendar initialBookings={bookings} />
          </div>

        </div>
      </div>
    </>
  );
}