import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string, limit = 5) {
  const q = query.trim();
  if (!q) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { shortDescription: { contains: q } },
        { tasteProfile: { contains: q } },
        { category: { name: { contains: q } } },
      ],
    },
    include: { category: true },
    take: limit,
  });

  return products.map((p) => ({
    name: p.name,
    slug: p.slug,
    url: `/product/${p.slug}`,
    price: p.price,
    category: p.category.name,
    inStock: p.stock > 0,
  }));
}

type OrderVerifyResult =
  | { error: "not_found" }
  | { error: "verification_required" }
  | {
      order: {
        id: string;
        status: string;
        paymentMethod: string;
        totalAmount: number;
        invoiceUrl: string;
        items: { name: string; variantLabel: string | null; quantity: number }[];
      };
    };

export async function verifyAndGetOrder({
  orderId,
  phone,
  userId,
}: {
  orderId: string;
  phone?: string | null;
  userId?: string | null;
}): Promise<OrderVerifyResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId.trim() },
    include: { items: { include: { product: true } } },
  });

  if (!order) return { error: "not_found" };

  const isOwner = Boolean(userId && order.userId === userId);

  const phoneDigits = (phone ?? "").replace(/\D/g, "");
  const orderPhoneDigits = order.shippingPhone.replace(/\D/g, "");
  const isPhoneMatch = phoneDigits.length >= 10 && orderPhoneDigits.endsWith(phoneDigits.slice(-10));

  if (!isOwner && !isPhoneMatch) {
    return { error: "verification_required" };
  }

  return {
    order: {
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      invoiceUrl: `/order/${order.id}/invoice${order.userId ? "" : `?token=${order.guestAccessToken}`}`,
      items: order.items.map((item) => ({
        name: item.product.name,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
      })),
    },
  };
}
