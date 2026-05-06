"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import type { ReactNode } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordShell />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Unable to reset password");
        return;
      }

      setMessage(payload?.message ?? "Password has been reset successfully");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return <ResetPasswordShell formContent={
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="sr-only">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-teal-900 focus:border-teal-900 sm:text-sm"
            placeholder="New password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-teal-900 focus:border-teal-900 sm:text-sm"
            placeholder="Confirm password"
          />
        </div>
      </div>

      {message && <div className="text-green-700 text-sm text-center">{message}</div>}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-950 hover:bg-teal-900 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </div>
    </form>
  } />;
}

function ResetPasswordShell({ formContent }: { formContent?: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-teal-950">Reset password</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Choose a new password for your account.</p>
        </div>

        {formContent}

        <div className="text-center">
          <Link href="/login" className="text-teal-900 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
