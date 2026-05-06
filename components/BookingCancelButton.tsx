"use client"

import { useState } from "react";
import { useSWRConfig } from "swr";

export function BookingCancelButton({ bookingId }: { bookingId: string }) {
    const [canceling, setCanceling] = useState<boolean>(false);
    const { mutate } = useSWRConfig();

    const handleCancel = async () => {
        setCanceling(true);

        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to delete booking");

            mutate("/api/bookings/me");
            mutate("/api/bookings");
            setCanceling(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            onClick={() => handleCancel()}
            disabled={canceling}
            className="shrink-0 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {canceling ? "Canceling…" : "Cancel"}
        </button>
    )
}