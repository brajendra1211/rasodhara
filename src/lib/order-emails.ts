import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";
import { formatINR } from "@/lib/format";
import type { Order, OrderItem, Product, OrderStatus } from "@/generated/prisma/client";

const STATUS_COPY: Partial<Record<OrderStatus, { subject: string; heading: string; message: string }>> = {
  PAID: {
    subject: "Order confirmed",
    heading: "Thanks for your order!",
    message: "We've received your payment and are getting your order ready.",
  },
  SHIPPED: {
    subject: "Your order has shipped",
    heading: "Your order is on its way",
    message: "Your order has been shipped and should arrive soon.",
  },
  DELIVERED: {
    subject: "Order delivered",
    heading: "Your order has been delivered",
    message: "We hope you enjoy your order! Let us know if you have any issues.",
  },
};

const COD_COPY = {
  subject: "Order confirmed",
  heading: "Thanks for your order!",
  message: "Your order is confirmed. Pay in cash when it arrives at your doorstep.",
};

type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };

async function dispatchOrderEmail(order: OrderWithItems, copy: { subject: string; heading: string; message: string }) {
  const recipient = order.userId
    ? (await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true } }))?.email
    : order.guestEmail;
  if (!recipient) return;

  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl(settings.canonicalDomain);
  const orderUrl = order.guestAccessToken
    ? `${baseUrl}/order/${order.id}?token=${order.guestAccessToken}`
    : `${baseUrl}/order/${order.id}`;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;">${item.product.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} &times; ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">${formatINR(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h1 style="font-size:20px;">${copy.heading}</h1>
      <p style="color:#52525b;">${copy.message}</p>
      <p style="color:#52525b;font-size:14px;">Order #${order.id.slice(-8).toUpperCase()}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${itemsHtml}
      </table>
      <table style="width:100%;border-top:1px solid #e4e4e7;padding-top:8px;font-weight:600;">
        <tr><td>Total</td><td style="text-align:right;">${formatINR(order.totalAmount)}</td></tr>
      </table>
      <p style="margin-top:24px;">
        <a href="${orderUrl}" style="color:#b45309;">View your order</a>
      </p>
      <p style="color:#a1a1aa;font-size:12px;margin-top:32px;">${settings.siteName}</p>
    </div>
  `;

  await sendEmail({ to: recipient, subject: `${copy.subject} - ${settings.siteName}`, html });
}

export async function sendOrderStatusEmail(orderId: string, status: OrderStatus) {
  const copy = STATUS_COPY[status];
  if (!copy) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) return;

  await dispatchOrderEmail(order, copy);
}

export async function sendCodOrderConfirmationEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) return;

  await dispatchOrderEmail(order, COD_COPY);
}
