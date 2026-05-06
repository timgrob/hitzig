"use client";

import { useEffect } from "react";
import { Message } from "@/types/message";

export function MessageBanner({ message, onDismissAction }: { message: Message; onDismissAction: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDismissAction, 3000);
        return () => clearTimeout(timer);
    }, [message, onDismissAction]);

    return (
        <div
            key={message.text}
            className={`animate-fade-out flex items-center justify-between p-3 rounded-lg border text-sm ${message.type === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-red-50 border-red-300 text-red-700"
                }`}
        >
            <span className="font-medium">{message.text}</span>
            <button onClick={onDismissAction} className="text-current font-bold hover:opacity-70 ml-4">
                ×
            </button>
        </div>
    );
}