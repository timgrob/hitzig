"use client";

import { useState } from "react";
import { BookingList } from "@/components/BookingList";
import { BookingSerialized } from "@/types/booking";

type BookingsView = "future" | "past";

export function BookingsPageClient({ initialBookings }: { initialBookings: BookingSerialized[] }) {
    const [view, setView] = useState<BookingsView>("future");

    return (
        <div>
            <div className="mb-6 inline-flex rounded-lg border border-zinc-200 bg-white p-1">
                <button
                    type="button"
                    onClick={() => setView("future")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "future"
                            ? "bg-[#24465D] text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                >
                    Active
                </button>
                <button
                    type="button"
                    onClick={() => setView("past")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "past"
                            ? "bg-[#24465D] text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                >
                    Past
                </button>
            </div>

            <BookingList initialBookings={initialBookings} view={view} />
        </div>
    );
}
