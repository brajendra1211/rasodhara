import { createRecipe } from "@/lib/actions/settings";
import { RecipeForm } from "@/components/admin/recipe-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default function NewRecipePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Recipes" />

      <h2 className="mb-6 text-xl font-semibold">New recipe</h2>
      <RecipeForm action={createRecipe} submitLabel="Create recipe" />
    </div>
  );
}
