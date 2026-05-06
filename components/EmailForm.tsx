"use client";

import { useState } from "react";
import { Message } from "@/types/message";
import { MessageBanner } from "@/components/MessageBanner";

export function EmailForm({ currentEmail }: { currentEmail: string }) {
    const [email, setEmail] = useState(currentEmail);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleSubmit = async () => {
        if (!email || email === currentEmail) return;
        setLoading(true);
        try {
            const res = await fetch("/api/users/email", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error(await res.text());
            setMessage({ type: "success", text: "Email updated successfully." });
        } catch {
            setMessage({ type: "error", text: "Failed to update email. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {message && <MessageBanner message={message} onDismissAction={() => setMessage(null)} />}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                    email
                </label>
                <input id="email-input" type="email" value={email} placeholder="your@example.com" onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || email === currentEmail || !email}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-950 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading && (
                        <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {loading ? "Saving…" : "Save email"}
                </button>
            </div>
        </div>
    );
}