"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = getInitials(session?.user?.firstName, session?.user?.lastName)

    return (
        <header className="w-full bg-[#2D5774] text-zinc-50 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* LEFT: LOGO (LINK TO HOME) */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <Image src="/fearless-girl-white-square.png" alt="Fearless Girl White" className="size-12" />
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex ml-10 items-center gap-8">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-zinc-50 hover:text-[#2D5774] hover:bg-zinc-50 rounded-md transition-colors duration-150">
                            Home
                        </Link>
                        <Link href="/bookings" className="px-3 py-2 text-sm font-medium text-zinc-50 hover:text-[#2D5774] hover:bg-zinc-50 rounded-md transition-colors duration-150">
                            Bookings
                        </Link>
                    </nav>

                    <div className="hidden md:flex ml-auto items-center">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((v) => !v)}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-50 text-[#2D5774] text-sm font-bold hover:opacity-90 transition"
                                aria-label="Open profile menu"
                            >
                                {initials}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-50 rounded-xl shadow-lg border border-zinc-100 py-1 z-50">
                                    {/* User info */}
                                    <div className="px-4 py-2.5 border-b border-zinc-100">
                                        <p className="text-xs font-semibold text-zinc-800 truncate">{session?.user?.firstName}</p>
                                        <p className="text-xs text-zinc-400 truncate">{session?.user?.email}</p>
                                    </div>

                                    {/* Profile link */}
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        Profile
                                    </Link>

                                    {/* Logout */}
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="ml-auto md:hidden text-2xl"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="overflow-hidden transition-all duration-300">
                    <div className="border-t border-zinc-50/10 px-4 py-3 space-y-1">
                        <Link href="/" className="block px-3 py-2.5 text-sm font-medium text-zinc-50 hover:text-[#2D5774] hover:bg-zinc-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                            Home
                        </Link>
                        <Link href="/bookings" className="block px-3 py-2.5 text-sm font-medium text-zinc-50 hover:text-[#2D5774] hover:bg-zinc-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                            Bookings
                        </Link>

                        <div className="pt-2 border-t border-white/10">
                            <Link
                                href="/profile"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-50 hover:text-[#2D5774] hover:bg-zinc-50 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                Profile
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 hover:hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
