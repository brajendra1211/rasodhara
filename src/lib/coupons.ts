import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";

export async function validateCoupon(rawCode: string, subtotal: number) {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { error: "Enter a coupon code." } as const;

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) {
    return { error: "Invalid coupon code." } as const;
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { error: "This coupon has expired." } as const;
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { error: "This coupon has reached its usage limit." } as const;
  }
  if (coupon.minOrderAmount !== null && subtotal < coupon.minOrderAmount) {
    return { error: `Minimum order amount is ${formatINR(coupon.minOrderAmount)}.` } as const;
  }

  const rawDiscount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  const discountAmount = Math.min(rawDiscount, subtotal);

  return { coupon, discountAmount } as const;
}
