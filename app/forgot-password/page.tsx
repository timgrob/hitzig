"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Unable to process request");
        return;
      }

      setMessage(payload?.message ?? "If an account exists for this email, a reset link has been sent.");
      setEmail("");
    } catch {
      setError("Unable to process request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-teal-950">Forgot password</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-teal-900 focus:border-teal-900 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          {message && <div className="text-green-700 text-sm text-center">{message}</div>}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-950 hover:bg-teal-900 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-teal-900 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
