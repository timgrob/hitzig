export interface Booking {
    id: string;
    checkIn: Date;
    checkOut: Date;
    room: {
        id: string,
        name: string
    };
    user: {
        id: string
        email: string;
        firstName?: string | null;
        lastName?: string | null;
    };
};


export interface BookingSerialized {
    id: string;
    checkIn: string;
    checkOut: string;
    room: {
        id: string,
        name: string
    };
    user: {
        id: string
        email: string;
        firstName?: string | null;
        lastName?: string | null;
    };
};