"use client";

import { BookingSerialized } from "@/types/booking"
import { BookingCancelButton } from "@/components/BookingCancelButton";
import { formatDate, nightsBetween } from "@/lib/utils"

export function BookingItem({ booking }: { booking: BookingSerialized }) {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const today = new Date();
    const isPast = checkOut < today;
    const isCurrent = checkIn <= today && checkOut >= today;
    const isFuture = checkIn > today
    const nights = nightsBetween(checkIn, checkOut);

    return (
        <li
            key={booking.id}
            className={`flex items-center justify-between gap-4 py-4 transition-opacity duration-300 ${isPast ? "opacity-50" : ""}`}
        >
            {/* Left: booking details */}
            <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className={`truncate text-sm font-medium ${isPast ? "text-zinc-400" : "text-zinc-800"}`}>
                        {booking.room.name}
                    </span>
                    {/* Status badge */}
                    {isPast ? (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-400">
                            Past
                        </span>
                    ) : (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                            Upcoming
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
                    {/* Check-in */}
                    <span className="flex items-center gap-1">
                        <svg
                            className={`h-3.5 w-3.5 shrink-0 ${isPast ? "text-zinc-300" : "text-zinc-400"}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <rect x="2" y="3" width="12" height="11" rx="1.5" />
                            <path d="M5 1v4M11 1v4M2 7h12" />
                        </svg>
                        {formatDate(checkIn)}
                    </span>

                    <span className="text-zinc-300">→</span>

                    {/* Check-out */}
                    <span className="flex items-center gap-1">
                        <svg
                            className={`h-3.5 w-3.5 shrink-0 ${isPast ? "text-zinc-300" : "text-zinc-400"}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <rect x="2" y="3" width="12" height="11" rx="1.5" />
                            <path d="M5 1v4M11 1v4M2 7h12" />
                        </svg>
                        {formatDate(checkOut)}
                    </span>

                    {/* Night count badge */}
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                        {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                </div>
            </div>

            {/* Right: cancel button */}
            {!isPast &&
                <BookingCancelButton bookingId={booking.id} />
            }
        </li>
    );
}