import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Name",
    "Slug",
    "Category",
    "Price",
    "MRP",
    "Stock",
    "Variants",
    "Best Seller",
    "Jain Friendly",
    "Taste Profile",
    "Oil Type",
  ];

  const rows = products.map((product) => [
    product.name,
    product.slug,
    product.category.name,
    (product.price / 100).toFixed(2),
    (product.mrp / 100).toFixed(2),
    product.stock,
    product.variants.map((v) => `${v.label}:${v.stock}`).join("; "),
    product.isBestSeller ? "Yes" : "No",
    product.isJainFriendly ? "Yes" : "No",
    product.tasteProfile ?? "",
    product.oilType ?? "",
  ]);

  const csv = toCsv([header, ...rows]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
