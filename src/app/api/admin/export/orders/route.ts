import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Order ID",
    "Date",
    "Customer",
    "Email",
    "Phone",
    "Status",
    "Payment Method",
    "Subtotal",
    "Discount",
    "Coupon",
    "Shipping",
    "Tax",
    "Total",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.createdAt.toISOString(),
    order.user?.name ?? order.shippingName,
    order.user?.email ?? order.guestEmail ?? "",
    order.shippingPhone,
    order.status,
    order.paymentMethod,
    (order.subtotal / 100).toFixed(2),
    (order.discountAmount / 100).toFixed(2),
    order.couponCode ?? "",
    (order.shippingFee / 100).toFixed(2),
    (order.taxAmount / 100).toFixed(2),
    (order.totalAmount / 100).toFixed(2),
  ]);

  const csv = toCsv([header, ...rows]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
