import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";

const FALLBACK_RECIPES = [
  {
    id: "aloo-wadi-sabzi",
    title: "Aloo Wadi Sabzi",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
    linkHref: null as string | null,
  },
  {
    id: "stuffed-mirchi-pickle-paratha",
    title: "Stuffed Mirchi Pickle Paratha",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    linkHref: null as string | null,
  },
  {
    id: "khatta-meetha-mango-rice",
    title: "Khatta Meetha Mango Rice",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
    linkHref: null as string | null,
  },
];

export async function RecipesSection() {
  const rows = await prisma.recipe.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  const recipes = rows.length > 0 ? rows : FALLBACK_RECIPES;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading title="Try Our Recipes" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {recipes.map((recipe) => {
          const card = (
            <>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                {recipe.image && (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#3f2d20] dark:text-zinc-100">{recipe.title}</h3>
                {recipe.linkHref && (
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">View Recipe →</span>
                )}
              </div>
            </>
          );

          return recipe.linkHref ? (
            <Link key={recipe.id} href={recipe.linkHref} className="group flex flex-col gap-3">
              {card}
            </Link>
          ) : (
            <div key={recipe.id} className="group flex flex-col gap-3">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
