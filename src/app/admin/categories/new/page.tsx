import { createCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New category</h1>
      <CategoryForm action={createCategory} submitLabel="Create category" />
    </div>
  );
}
