"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Room } from "@/types/room"
import { Message } from "@/types/message"
import { isFutureDate } from "@/lib/utils"
import { MessageBanner } from "@/components/MessageBanner";

export function BookingFrom({ rooms }: { rooms: Room[] }) {
    const [booking, setBooking] = useState<boolean>(false);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [message, setMessage] = useState<Message | null>(null)
    // const router = useRouter();
    const { mutate } = useSWRConfig();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setBooking(true);

        if (!checkIn || !checkOut) {
            setBooking(false);
            setMessage({ type: "error", text: "Please select both dates." });
            return;
        }

        if (checkOut < checkIn) {
            setBooking(false);
            setMessage({ type: "error", text: "Check-out date must be after check-in date." });
            return;
        }

        if (!isFutureDate(checkIn) || !isFutureDate(checkOut)) {
            setBooking(false);
            setMessage({ type: "error", text: "Both dates must be in the future." });
            return;
        }

        if (!room) {
            setBooking(false);
            setMessage({ type: "error", text: "Please select a room." });
            return;
        }

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: room.id,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create booking");
            }

            // router.refresh(); // triggers server re-render
            mutate("/api/bookings")
            setMessage({ type: "success", text: "Booking successful!" });
            setCheckIn(null);
            setCheckOut(null);
            setRoom(null);

        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setMessage({ type: "error", text: err.message });
            } else {
                setMessage({ type: "error", text: "Something went wrong." });
            }
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-zinc-50 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-teal-950">Book Your Stay</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-teal-950">Select Room</label>
                    <select
                        id="room-selector"
                        value={room?.id || ""}
                        onChange={(e) =>
                            setRoom(rooms.find((r) => r.id === e.target.value) || null)
                        }
                        className="w-full mt-1 p-2 border rounded-lg text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-transparent transition"
                    >
                        <option value="" disabled>
                            Select a room
                        </option>

                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-teal-950">Check-in Date</label>
                    <input
                        id="check-in-selector"
                        type="date"
                        value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
                        onChange={(e) => setCheckIn(new Date(e.target.value))}
                        className="w-full mt-1 p-2 border rounded-lg text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-transparent transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-teal-950">Check-out Date</label>
                    <input
                        id="check-out-selector"
                        type="date"
                        value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
                        onChange={(e) => setCheckOut(new Date(e.target.value))}
                        className="w-full mt-1 p-2 border rounded-lg text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-transparent transition"
                        required
                    />
                </div>

                {message && <MessageBanner message={message} onDismissAction={() => setMessage(null)} />}

                <button
                    type="submit"
                    disabled={booking}
                    className="w-full bg-teal-950 text-white py-2 rounded-lg hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {booking ? "Processing…" : "Book Now"}
                </button>
            </form>
        </div >
    );
}
