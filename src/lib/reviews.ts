import { prisma } from "@/lib/prisma";

export async function getProductRatings(productIds: string[]) {
  if (productIds.length === 0) return new Map<string, { avg: number; count: number }>();

  const grouped = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return new Map(grouped.map((g) => [g.productId, { avg: g._avg.rating ?? 0, count: g._count.rating }]));
}
