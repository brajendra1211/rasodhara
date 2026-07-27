import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const [categories, badges] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.trustBadge.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New product</h1>
      <ProductForm action={createProduct} categories={categories} badges={badges} submitLabel="Create product" />
    </div>
  );
}
