import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    const rawToken = typeof token === "string" ? token.trim() : "";
    const nextPassword = typeof password === "string" ? password : "";

    if (!rawToken || !nextPassword) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (nextPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(nextPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    });

    return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
