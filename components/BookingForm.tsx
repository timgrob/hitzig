"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSWRConfig } from "swr";
import { Room } from "@/types/room";
import { Message } from "@/types/message";
import { isFutureDate } from "@/lib/utils";
import { MessageBanner } from "@/components/MessageBanner";

const LOCALE = "sv-SE"

function formatShort(date: Date): string {
    return date.toLocaleDateString(LOCALE, { day: "numeric", month: "short" });
}

export function BookingFrom({ rooms }: { rooms: Room[] }) {
    const [booking, setBooking] = useState(false);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [roomOpen, setRoomOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);
    const { mutate } = useSWRConfig();

    const roomRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfYear = new Date(today.getFullYear(), 11, 31)
    const endDate = new Date(today.getFullYear() + 1, 0, 4);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (roomRef.current && !roomRef.current.contains(e.target as Node)) {
                setRoomOpen(false);
            }
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
                setDateOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setCheckIn(start);
        setCheckOut(end);
        if (start && end) setDateOpen(false); // close after full range selected
    };

    const handleRoomSelect = (r: Room) => {
        setRoom(r);
        setRoomOpen(false);
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setBooking(true);

        if (!room) {
            setBooking(false);
            setMessage({ type: "error", text: "Please select a room." });
            return;
        }

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

        console.log("CheckIn date: ", checkIn)
        console.log("CheckOut date: ", checkOut)
        console.log(`CheckIn ${checkIn} -> CheckOut ${checkOut}`)

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: room.id,
                    checkIn: checkIn.toLocaleDateString(LOCALE),
                    checkOut: checkOut.toLocaleDateString(LOCALE),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create booking");
            }

            mutate("/api/bookings");
            // mutate("/api/bookings/me");
            setMessage({ type: "success", text: "Booking successful!" });
            setCheckIn(null);
            setCheckOut(null);
            setRoom(null);

        } catch (err: unknown) {
            setMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Something went wrong.",
            });
        } finally {
            setBooking(false);
        }
    }

    const dateLabel = checkIn && checkOut
        ? `${formatShort(checkIn)} → ${formatShort(checkOut)}`
        : checkIn
            ? `${formatShort(checkIn)} → ...`
            : "Select dates";

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 bg-zinc-50 rounded-md shadow-lg border border-zinc-200 overflow-visible">

                {/* Room selector */}
                <div ref={roomRef} className="relative flex-1 min-w-0">
                    <button
                        type="button"
                        onClick={() => { setRoomOpen(v => !v); setDateOpen(false); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors rounded-t-md md:rounded-l-md md:rounded-tr-none hover:bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 ${roomOpen ? "bg-zinc-50" : ""}`}
                    >
                        {/* Door icon */}
                        <svg className="w-5 h-5 text-[#24465D] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Room</span>
                            <span className={`text-sm font-medium truncate ${room ? "text-[#2D5774]" : "text-zinc-400"}`}>
                                {room ? room.name : "Select a room"}
                            </span>
                        </div>
                        <svg className={`w-4 h-4 text-zinc-400 ml-auto shrink-0 transition-transform ${roomOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Room dropdown */}
                    {roomOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-55 bg-zinc-50 rounded-md border border-zinc-200 shadow-sm z-50 overflow-hidden list-none">
                            {rooms.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => handleRoomSelect(r)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#2D5774] hover:text-zinc-50 transition-colors list-none ${room?.id === r.id ? "bg-[#24465D] text-zinc-50" : "text-zinc-700"}`}
                                >
                                    {r.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date range trigger */}
                <div ref={dateRef} className="relative flex-1 min-w-0">
                    <button
                        type="button"
                        onClick={() => { setDateOpen(v => !v); setRoomOpen(false); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 ${dateOpen ? "bg-zinc-50" : ""}`}
                    >
                        {/* Calendar icon */}
                        <svg className="w-5 h-5 text-[#24465D] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Dates</span>
                            <span className={`text-sm font-medium truncate ${checkIn ? "text-[#2D5774]" : "text-zinc-400"}`}>
                                {dateLabel}
                            </span>
                        </div>
                    </button>

                    {/* Date picker dropdown */}
                    {dateOpen && (
                        <div className="absolute top-full left-0 mt-2 z-50 booking-datepicker">
                            <div className="bg-zinc-50 rounded-md border border-zinc-200 shadow-xl overflow-hidden">
                                <DatePicker
                                    selected={checkIn}
                                    onChange={handleDateChange}
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    selectsRange
                                    inline
                                    minDate={today}
                                    maxDate={endDate}
                                    monthsShown={2}
                                    calendarStartDay={1}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Book button */}
                <div className="px-3 py-3 flex items-center">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#2D5774] hover:bg-[#3B6D90] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-50 font-semibold text-sm px-6 py-3 rounded-md transition-colors whitespace-nowrap"
                    >
                        {booking ? (
                            <>
                                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing…
                            </>
                        ) : (
                            <>
                                Book Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message banner */}
            {message && (
                <div className="mt-3">
                    <MessageBanner message={message} onDismissAction={() => setMessage(null)} />
                </div>
            )}
        </div>
    );
}
