"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";
import { sendOrderStatusEmail } from "@/lib/order-emails";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/order/${orderId}`);

  if (status === "SHIPPED" || status === "DELIVERED") {
    await sendOrderStatusEmail(orderId, status);
  }
}

export async function cancelOrder(orderId: string, guestToken: string | null) {
  const session = await auth();

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new Error("Order not found.");

  const isOwner = Boolean(session?.user && order.userId === session.user.id);
  const isGuestWithToken = Boolean(!order.userId && guestToken && order.guestAccessToken === guestToken);
  if (!isOwner && !isGuestWithToken) {
    throw new Error("Forbidden");
  }

  if (order.status !== "PENDING" && order.status !== "PAID") {
    throw new Error("This order can no longer be cancelled.");
  }

  const shouldRestock = order.status === "PAID" || order.paymentMethod === "COD";

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } }),
    ...(shouldRestock
      ? order.items.map((item) =>
          item.variantId
            ? prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              })
            : prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              })
        )
      : []),
  ]);

  revalidatePath(`/order/${orderId}`);
  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");
}
