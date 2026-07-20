"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone: phone || null,
    },
  });

  return { success: true };
}

export type ForgotPasswordState = { error?: string; success?: boolean };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

    const settings = await getSiteSettings();
    const baseUrl = getBaseUrl(settings.canonicalDomain);
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: `Reset your password - ${settings.siteName}`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h1 style="font-size:20px;">Reset your password</h1>
        <p style="color:#52525b;">Click the link below to set a new password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}" style="color:#b45309;">${resetUrl}</a></p>
        <p style="color:#a1a1aa;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
    });
  }

  // Always report success, whether or not the email is registered, to avoid leaking account existence.
  return { success: true };
}

export type ResetPasswordState = { error?: string; success?: boolean };

export async function resetPassword(
  token: string,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() < Date.now()) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return { success: true };
}
