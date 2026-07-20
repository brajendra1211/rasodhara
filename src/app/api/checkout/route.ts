import { NextResponse } from "next/server";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/lib/coupons";
import { getSiteSettings } from "@/lib/settings";
import { computeOrderTotals } from "@/lib/order-totals";
import { sendCodOrderConfirmationEmail } from "@/lib/order-emails";

type CheckoutBody = {
  items: { productId: string; variantId?: string; quantity: number }[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  couponCode?: string;
  paymentMethod?: "RAZORPAY" | "COD";
  guestEmail?: string;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const body = (await request.json()) as CheckoutBody;
  const { items, shippingName, shippingPhone, shippingAddress, couponCode, guestEmail } = body;
  const paymentMethod = body.paymentMethod === "COD" ? "COD" : "RAZORPAY";

  if (!items?.length || !shippingName || !shippingPhone || !shippingAddress) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!userId && (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail))) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const settings = await getSiteSettings();

  if (paymentMethod === "COD" && !settings.codEnabled) {
    return NextResponse.json({ error: "Cash on Delivery is not available." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { variants: true },
  });

  if (products.length !== new Set(items.map((i) => i.productId)).size) {
    return NextResponse.json({ error: "One or more products are no longer available" }, { status: 400 });
  }

  type ResolvedLine = { productId: string; variantId: string | null; variantLabel: string | null; price: number; quantity: number };
  const resolved: ResolvedLine[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "One or more products are no longer available" }, { status: 400 });
    }

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      resolved.push({
        productId: product.id,
        variantId: variant.id,
        variantLabel: variant.label,
        price: variant.price,
        quantity: item.quantity,
      });
    } else {
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      resolved.push({
        productId: product.id,
        variantId: null,
        variantLabel: null,
        price: product.price,
        quantity: item.quantity,
      });
    }
  }

  const subtotal = resolved.reduce((sum, line) => sum + line.price * line.quantity, 0);

  let discountAmount = 0;
  let appliedCouponCode: string | null = null;
  if (couponCode) {
    const couponResult = await validateCoupon(couponCode, subtotal);
    if ("error" in couponResult) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }
    discountAmount = couponResult.discountAmount;
    appliedCouponCode = couponResult.coupon.code;
  }

  const { shippingFee, taxAmount, totalAmount } = computeOrderTotals({
    subtotal,
    discountAmount,
    shippingFlatFee: settings.shippingFlatFee,
    freeShippingThreshold: settings.freeShippingThreshold,
    gstRatePercent: settings.gstRatePercent,
  });

  const guestAccessToken = userId ? null : crypto.randomBytes(24).toString("hex");

  const order = await prisma.order.create({
    data: {
      userId,
      guestEmail: userId ? null : guestEmail,
      guestAccessToken,
      status: "PENDING",
      paymentMethod,
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      couponCode: appliedCouponCode,
      discountAmount,
      shippingName,
      shippingPhone,
      shippingAddress,
      items: {
        create: resolved.map((line) => ({
          productId: line.productId,
          variantId: line.variantId,
          variantLabel: line.variantLabel,
          quantity: line.quantity,
          price: line.price,
        })),
      },
    },
  });

  if (paymentMethod === "COD") {
    await prisma.$transaction([
      ...resolved.map((line) =>
        line.variantId
          ? prisma.productVariant.update({ where: { id: line.variantId }, data: { stock: { decrement: line.quantity } } })
          : prisma.product.update({ where: { id: line.productId }, data: { stock: { decrement: line.quantity } } })
      ),
      ...(appliedCouponCode
        ? [prisma.coupon.update({ where: { code: appliedCouponCode }, data: { usedCount: { increment: 1 } } })]
        : []),
    ]);

    await sendCodOrderConfirmationEmail(order.id);

    return NextResponse.json({
      orderId: order.id,
      paymentMethod: "COD",
      guestAccessToken,
    });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Online payments are not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount,
    currency: "INR",
    receipt: order.id,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });

  return NextResponse.json({
    orderId: order.id,
    paymentMethod: "RAZORPAY",
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    guestAccessToken,
  });
}
