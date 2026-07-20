import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductCard } from "@/components/product-card";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";
import { getProductRatings } from "@/lib/reviews";

type ShopSearchParams = { category?: string; q?: string; taste?: string; oil?: string; jain?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const [settings, activeCategory] = await Promise.all([
    getSiteSettings(),
    category ? prisma.category.findUnique({ where: { slug: category } }) : Promise.resolve(null),
  ]);

  const baseUrl = getBaseUrl(settings.canonicalDomain);
  const title = activeCategory
    ? activeCategory.metaTitle || `${activeCategory.name} | Shop`
    : "Shop all products";
  const description = activeCategory
    ? activeCategory.metaDescription || activeCategory.description || undefined
    : `Browse all products at ${settings.siteName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: activeCategory ? `${baseUrl}/shop?category=${activeCategory.slug}` : `${baseUrl}/shop`,
    },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const { category, q, taste, oil, jain } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  const [categories, products, wishlistRows] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { shortDescription: { contains: q } },
                { description: { contains: q } },
                { ingredients: { contains: q } },
                { tasteProfile: { contains: q } },
                { category: { name: { contains: q } } },
              ],
            }
          : {}),
        ...(taste ? { tasteProfile: taste } : {}),
        ...(oil ? { oilType: oil } : {}),
        ...(jain ? { isJainFriendly: true } : {}),
      },
      include: { images: { take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    userId ? prisma.wishlist.findMany({ where: { userId }, select: { productId: true } }) : Promise.resolve([]),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const wishlist = {
    loggedIn: Boolean(userId),
    wishlistedIds: new Set(wishlistRows.map((w) => w.productId)),
    path: "/shop",
  };
  const ratings = await getProductRatings(products.map((p) => p.id));

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-10 sm:px-6">
      <aside className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Categories</h2>
        <Link
          href="/shop"
          className={`rounded-md px-2 py-1.5 text-sm ${
            !category ? "bg-amber-100 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          All products
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`rounded-md px-2 py-1.5 text-sm ${
              category === c.slug
                ? "bg-amber-100 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </aside>

      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-semibold">{activeCategory ? activeCategory.name : "All products"}</h1>

        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} rating={ratings.get(product.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
