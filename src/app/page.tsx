import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductCard } from "@/components/product-card";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { OurStorySection } from "@/components/our-story-section";
import { WhyShopWithUs } from "@/components/why-shop-with-us";
import { TestimonialsSection } from "@/components/testimonials-section";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getProductRatings } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "Cold-pressed oils, straight from the farm",
    subtitle: "Wood-ghani pressed, no refining, no additives — just traditional goodness.",
    ctaLabel: "Shop oils",
    ctaHref: "/shop?category=cold-pressed-oils",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600",
    badge: "Best Seller",
  },
];

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const [categories, bestSellers, newArrivals, heroSlideRows, wishlistRows] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: { images: { take: 1 }, variants: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isBestSeller: false },
      include: { images: { take: 1 }, variants: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    userId ? prisma.wishlist.findMany({ where: { userId }, select: { productId: true } }) : Promise.resolve([]),
  ]);

  const wishlist = {
    loggedIn: Boolean(userId),
    wishlistedIds: new Set(wishlistRows.map((w) => w.productId)),
    path: "/",
  };

  const ratings = await getProductRatings([...bestSellers, ...newArrivals].map((p) => p.id));

  const heroSlides: HeroSlide[] =
    heroSlideRows.length > 0
      ? heroSlideRows.map((s) => ({
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel,
          ctaHref: s.ctaHref,
          image: s.image,
          badge: s.badge ?? undefined,
        }))
      : FALLBACK_SLIDES;

  return (
    <div className="flex flex-1 flex-col">
      <HeroCarousel slides={heroSlides} />

      {categories.length > 0 && (
        <section className="border-b border-zinc-200 py-8 dark:border-zinc-800">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 no-scrollbar sm:px-6 sm:gap-10">
            <Link href="/shop" className="group flex shrink-0 flex-col items-center gap-2">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-500 group-hover:border-amber-600 group-hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-900 sm:h-20 sm:w-20">
                All
              </span>
              <span className="text-xs font-medium text-zinc-700 group-hover:text-amber-700 dark:text-zinc-300 sm:text-sm">
                All Products
              </span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <span className="relative flex h-16 w-16 overflow-hidden rounded-full border border-zinc-200 group-hover:border-amber-600 dark:border-zinc-700 sm:h-20 sm:w-20">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-amber-100 text-lg font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="max-w-[5.5rem] text-center text-xs font-medium text-zinc-700 group-hover:text-amber-700 dark:text-zinc-300 sm:text-sm">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Best sellers</h2>
          <Link href="/shop" className="text-sm font-medium text-amber-700 dark:text-amber-400">
            View all
          </Link>
        </div>

        {bestSellers.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No products yet &mdash; add some from the{" "}
            <Link href="/admin/products" className="font-medium text-amber-700 dark:text-amber-400">
              admin panel
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} rating={ratings.get(product.id)} />
            ))}
          </div>
        )}
      </section>

      {newArrivals.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">New arrivals</h2>
            <Link href="/shop" className="text-sm font-medium text-amber-700 dark:text-amber-400">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} rating={ratings.get(product.id)} />
            ))}
          </div>
        </section>
      )}

      <WhyShopWithUs />

      <OurStorySection />

      <TestimonialsSection />

      <NewsletterSignup />
    </div>
  );
}
