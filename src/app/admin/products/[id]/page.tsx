import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true, variants: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit product</h1>
      <ProductForm
        action={updateWithId}
        categories={categories}
        submitLabel="Save changes"
        defaults={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription ?? "",
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          stock: product.stock,
          categoryId: product.categoryId,
          isBestSeller: product.isBestSeller,
          isJainFriendly: product.isJainFriendly,
          tasteProfile: product.tasteProfile ?? "",
          oilType: product.oilType ?? "",
          weightGrams: product.weightGrams,
          ingredients: product.ingredients ?? "",
          shelfLife: product.shelfLife ?? "",
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          images: product.images.map((i) => i.url),
          videoUrl: product.videoUrl ?? "",
          variants: product.variants.map((v) => ({ label: v.label, price: v.price, mrp: v.mrp, stock: v.stock })),
        }}
      />
    </div>
  );
}
