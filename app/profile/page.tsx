import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { PasswordForm } from "@/components/PasswordForm";
import { EmailForm } from "@/components/EmailForm";
import { getInitials } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
    // Get the current session
    const session = await getServerSession(authOptions);

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect("/login"); // fallback if user not found
    }

    const initials = getInitials(user.firstName, user.lastName)

    return (
        <>
            <Header />
            <div className="min-h-screen bg-zinc-50 py-10 px-4">
                <div className="max-w-lg mx-auto flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#24465D] text-zinc-50 flex items-center justify-center text-sm font-bold shrink-0">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-zinc-800">{user.firstName}</h1>
                            <p className="text-sm text-zinc-400">{user.email}</p>
                        </div>
                    </div>

                    <section className="flex flex-col gap-4">
                        <div className="border-b border-zinc-200 pb-2">
                            <h2 className="text-base font-semibold text-zinc-800">Email address</h2>
                            <p className="text-sm text-zinc-400 mt-0.5">Update the email associated with your account.</p>
                        </div>
                        <EmailForm currentEmail={user.email} />
                    </section>

                    {/* Password section */}
                    <section className="flex flex-col gap-4">
                        <div className="border-b border-zinc-200 pb-2">
                            <h2 className="text-base font-semibold text-zinc-800">Password</h2>
                            <p className="text-sm text-zinc-400 mt-0.5">Choose a strong password of at least 8 characters.</p>
                        </div>
                        <PasswordForm />
                    </section>
                </div>
            </div>
        </>
    );
}
