import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail } from "@/lib/order-emails";

type VerifyBody = {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    (await request.json()) as VerifyBody;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }
  if (order.status === "PAID") {
    return NextResponse.json({ success: true, orderId: order.id });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", razorpayPaymentId: razorpay_payment_id },
    }),
    ...order.items.map((item) =>
      item.variantId
        ? prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        : prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
    ),
    ...(order.couponCode
      ? [prisma.coupon.update({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } })]
      : []),
  ]);

  await sendOrderStatusEmail(order.id, "PAID");

  return NextResponse.json({ success: true, orderId: order.id });
}
