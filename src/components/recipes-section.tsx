import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

const RECIPES = [
  {
    title: "Aloo Wadi Sabzi",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
  },
  {
    title: "Stuffed Mirchi Pickle Paratha",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
  },
  {
    title: "Khatta Meetha Mango Rice",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
  },
];

export function RecipesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading title="Try Our Recipes" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {RECIPES.map((recipe) => (
          <div key={recipe.title} className="group flex flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#3f2d20] dark:text-zinc-100">{recipe.title}</h3>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">View Recipe →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
