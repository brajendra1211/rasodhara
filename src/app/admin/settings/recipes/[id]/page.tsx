import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateRecipe } from "@/lib/actions/settings";
import { RecipeForm } from "@/components/admin/recipe-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) notFound();

  const updateWithId = updateRecipe.bind(null, recipe.id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Recipes" />

      <h2 className="mb-6 text-xl font-semibold">Edit recipe</h2>
      <RecipeForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          title: recipe.title,
          image: recipe.image ?? "",
          linkHref: recipe.linkHref ?? "",
          order: recipe.order,
          active: recipe.active,
        }}
      />
    </div>
  );
}
