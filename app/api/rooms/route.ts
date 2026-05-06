import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const rooms = await prisma.room.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            capacity: true,
        },
        orderBy: { name: "desc" },
    });

    return NextResponse.json(rooms);
}
