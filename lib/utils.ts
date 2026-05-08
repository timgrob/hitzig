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

export function getInitials(firstName?: string | null, lastName?: string | null): string {
    const first = firstName?.[0] ?? "";
    const last = lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "?";
}
