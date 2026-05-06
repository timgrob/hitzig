// Time utility functions

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / msPerDay
    );
}

export function isFutureDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
};


export const ROOM_COLORS: Record<string, string> = {
    "cmn7t93lm000jvm8o4w1o1ter": "#38bdf8",  // sky
    "cmn7t93ln000kvm8oicfixeaf": "#a78bfa",  // lavendar
    "cmn7t93lo000lvm8opiodyd4i": "#f43f5e",  // rose
};

export function colorForRoom(roomId: string): string {
    return ROOM_COLORS[roomId] ?? "#a1a1aa"; // zinc fallback
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
    const first = firstName?.[0] ?? "";
    const last = lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "?";
}