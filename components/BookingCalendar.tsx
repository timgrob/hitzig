"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { fetcher } from "@/lib/fetcher";
import { colorForRoom } from "@/lib/utils";
import { Booking } from "@/types/booking"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

export function BookingCalendar({ initialBookings }: { initialBookings: Booking[] }) {
    const { data: bookings = [], mutate } = useSWR("/api/bookings", fetcher, {
        fallbackData: initialBookings
    });

    // Listen for SSE push
    useEffect(() => {
        const es = new EventSource("/api/bookings/stream");
        es.onmessage = () => mutate();  // revalidate SWR cache
        es.onerror = () => es.close();
        return () => es.close();
    }, [mutate]);

    const events = bookings.map((booking: Booking) => {
        const checkIn = new Date(booking.checkIn)
        const checkOut = new Date(booking.checkOut);
        checkOut.setDate(checkOut.getDate() + 1);  // add one day to make end inclusive

        return {
            title: `${booking.room.name} (${booking.user.firstName})`,
            start: checkIn,
            end: checkOut,
            color: colorForRoom(booking.room.id),
        };
    });

    return (
        <div className="pb-12 md:pb-0
            [&_.fc-button]:!bg-teal-950
            [&_.fc-button]:!border-teal-950
            [&_.fc-button]:!text-white
            [&_.fc-button:hover]:!bg-teal-800
            [&_.fc-button:hover]:!border-teal-800
            [&_.fc-button-active]:!bg-teal-700
            [&_.fc-button-primary:not(:disabled):active]:!bg-teal-700
            [&_.fc-button-primary:not(:disabled):active]:!border-teal-700
            [&_.fc-toolbar-title]:text-teal-950
            [&_.fc-toolbar-title]:font-bold
            [&_.fc-col-header-cell-cushion]:text-teal-950
            [&_.fc-col-header-cell-cushion]:font-semibold
            [&_.fc-col-header-cell-cushion]:no-underline
            [&_.fc-daygrid-day-number]:text-teal-950
            [&_.fc-daygrid-day-number]:no-underline
            [&_.fc-toolbar-title]:!text-base
            [&_.fc-toolbar-title]:!md:text-xl
        ">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridWeek,dayGridMonth',
                }}
                nowIndicator={true}
                firstDay={1}
                editable={false}
                selectable={false}
                defaultAllDay={true}
                events={events}
                height="auto"
            />
        </div>
    )
}