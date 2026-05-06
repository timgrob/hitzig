"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { fetcher } from "@/lib/fetcher";
import { BookingSerialized } from "@/types/booking"
import { BookingItem } from "@/components/BookingItem"

type BookingsView = "future" | "past";

export function BookingList({
    initialBookings,
    view,
}: {
    initialBookings: BookingSerialized[];
    view: BookingsView;
}) {
    const { data: bookings = [], mutate } = useSWR("/api/bookings/me", fetcher, {
        fallbackData: initialBookings
    });

    // Listen for SSE push
    useEffect(() => {
        const es = new EventSource("/api/bookings/stream");
        es.onmessage = () => mutate();  // revalidate SWR cache
        es.onerror = () => es.close();
        return () => es.close();
    }, [mutate]);

    const now = new Date();
    const filteredBookings = bookings.filter((booking: BookingSerialized) => {
        const checkOut = new Date(booking.checkOut);
        return view === "past" ? checkOut < now : checkOut >= now;
    });

    const emptyMessage = view === "past" ? "No past bookings." : "No active bookings.";

    return (
        filteredBookings.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-400">
                {emptyMessage}
            </p>
        ) : (
            <ul className="list-none divide-y divide-zinc-300">
                {filteredBookings.map((booking: BookingSerialized) => (
                    <BookingItem booking={booking} />
                ))}
            </ul>
        )
    );
}