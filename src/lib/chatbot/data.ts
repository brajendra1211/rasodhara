import { prisma } from "@/lib/prisma";

const STOPWORDS = new Set([
  "mujhe", "chahiye", "hai", "hain", "h", "hum", "mera", "meri", "mere", "ka", "ki", "ke", "ko", "se", "me", "mein",
  "aur", "ek", "kuch", "koi", "hoga", "kya", "kaun", "the", "and", "for", "of", "to", "do", "you", "have", "has",
  "want", "need", "looking", "please", "some", "any", "get", "buy", "show", "find",
  "product", "products", "item", "items", "dikhao", "dikha", "dikhaye", "batao", "batado", "bata", "karo", "kar",
  "dijiye", "dena", "milega", "milegi", "de", "dedo",
]);

const SPELLING_ALIASES: Record<string, string> = {
  aachar: "achaar",
  achar: "achaar",
  atchar: "achaar",
};

export function extractSearchTerms(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((w) => SPELLING_ALIASES[w] ?? w)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  return Array.from(new Set(words));
}

export type ProductResult = {
  name: string;
  slug: string;
  url: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string | null;
};

export async function searchProducts(query: string, limit = 5): Promise<ProductResult[]> {
  const terms = extractSearchTerms(query);
  if (terms.length === 0) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: terms.flatMap((term) => [
        { name: { contains: term } },
        { shortDescription: { contains: term } },
        { tasteProfile: { contains: term } },
        { category: { name: { contains: term } } },
      ]),
    },
    include: { category: true, images: { take: 1 } },
    take: limit * 4,
  });

  const ranked = products
    .map((p) => {
      const haystack = `${p.name} ${p.shortDescription ?? ""} ${p.tasteProfile ?? ""} ${p.category.name}`.toLowerCase();
      const score = terms.filter((t) => haystack.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);

  return ranked.map((p) => ({
    name: p.name,
    slug: p.slug,
    url: `/product/${p.slug}`,
    price: p.price,
    category: p.category.name,
    inStock: p.stock > 0,
    image: p.images[0]?.url ?? null,
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
