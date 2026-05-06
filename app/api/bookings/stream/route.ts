import { ReadableStreamDefaultController } from "stream/web";

const clients = new Set<ReadableStreamDefaultController>();

// Call this from your POST route after creating a booking
export async function notifyClients() {
    clients.forEach((client) => {
        client.enqueue("data: refresh\n\n");
    });
}

export async function GET() {
    const stream = new ReadableStream({
        start(controller) {
            clients.add(controller);
        },
        cancel(controller) {
            clients.delete(controller);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}