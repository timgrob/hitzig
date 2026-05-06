import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

function getBaseUrl() {
  return process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    // Always return the same message to prevent email enumeration.
    const genericMessage = {
      message: "If an account exists for this email, a reset link has been sent.",
    };

    if (!user) {
      return NextResponse.json(genericMessage, { status: 200 });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: expiresAt,
      },
    });

    const resetLink = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json(genericMessage, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
