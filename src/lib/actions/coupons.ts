"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CouponType } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

function couponFromForm(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENT") as CouponType;
  const rawValue = Math.max(0, Number(formData.get("value")) || 0);
  const value = type === "FIXED" ? Math.round(rawValue * 100) : Math.min(100, rawValue);
  const minOrderAmountRaw = String(formData.get("minOrderAmount") ?? "").trim();
  const maxUsesRaw = String(formData.get("maxUses") ?? "").trim();
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();
  const active = formData.get("active") === "on";

  return {
    code,
    type,
    value,
    minOrderAmount: minOrderAmountRaw ? Math.round(Number(minOrderAmountRaw) * 100) : null,
    maxUses: maxUsesRaw ? Math.max(1, Number(maxUsesRaw)) : null,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    active,
  };
}

export async function createCoupon(formData: FormData) {
  await requireAdmin();
  const data = couponFromForm(formData);
  if (!data.code || !data.value) return;

  await prisma.coupon.create({ data });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(couponId: string, formData: FormData) {
  await requireAdmin();
  const data = couponFromForm(formData);

  await prisma.coupon.update({ where: { id: couponId }, data });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(couponId: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id: couponId } });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(couponId: string, active: boolean) {
  await requireAdmin();
  await prisma.coupon.update({ where: { id: couponId }, data: { active } });
  revalidatePath("/admin/coupons");
}
