import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const updateWithId = updateCategory.bind(null, category.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit category</h1>
      <CategoryForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
          metaTitle: category.metaTitle ?? "",
          metaDescription: category.metaDescription ?? "",
        }}
      />
    </div>
  );
}
