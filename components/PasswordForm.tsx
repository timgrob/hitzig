"use client";

import { useState } from "react";
import { Message } from "@/types/message";
import { MessageBanner } from "@/components/MessageBanner";

export function PasswordForm() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const mismatch = next && confirm && next !== confirm;
    const tooShort = next && next.length < 8;
    const canSubmit = current && next && confirm && !mismatch && !tooShort && !loading;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setLoading(true);
        try {
            const res = await fetch("/api/users/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            if (!res.ok) throw new Error(await res.text());
            setMessage({ type: "success", text: "Password updated successfully." });
            setCurrent(""); setNext(""); setConfirm("");
        } catch {
            setMessage({ type: "error", text: "Incorrect current password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {message && <MessageBanner message={message} onDismissAction={() => setMessage(null)} />}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="current-password" className="text-sm font-medium text-zinc-700">
                        Current password
                    </label>
                    <div className="relative">
                        <input id="current-password-input" type={showPassword ? "text" : "password"} value={current} placeholder="••••••••" onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3B6D90] focus:border-transparent transition" />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-zinc-400">{undefined}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="next-password" className="text-sm font-medium text-zinc-700">
                        New password
                    </label>
                    <div className="relative">
                        <input id="new-password-input" type={showPassword ? "text" : "password"} value={next} placeholder="••••••••" onChange={(e) => setNext(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3B6D90] focus:border-transparent transition" />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-zinc-400">{tooShort ? "Must be at least 8 characters." : undefined}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirm-password" className="text-sm font-medium text-zinc-700">
                        Confirm password
                    </label>
                    <div className="relative">
                        <input id="confirm-password-input" type={showPassword ? "text" : "password"} value={confirm} placeholder="••••••••" onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3B6D90] focus:border-transparent transition" />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-zinc-400">{tooShort ? "Must be at least 8 characters." : undefined}</p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2D5774] px-4 py-2 text-sm font-medium text-white hover:bg-[#3B6D90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading && (
                            <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {loading ? "Saving…" : "Update password"}
                    </button>
                </div>
            </form>
        </div>
    );
}