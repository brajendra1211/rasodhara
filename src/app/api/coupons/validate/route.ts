import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, subtotal } = (await request.json()) as { code: string; subtotal: number };

  const result = await validateCoupon(code, subtotal);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ discountAmount: result.discountAmount, code: result.coupon.code });
}
