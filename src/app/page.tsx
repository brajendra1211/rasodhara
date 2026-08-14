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
import { RecipesSection } from "@/components/recipes-section";
import { SectionHeading } from "@/components/section-heading";
import { HorizontalScroller } from "@/components/horizontal-scroller";
import { getProductRatings } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "Authentic Homemade Pickles & Wadis, Crafted the Traditional Way",
    subtitle:
      "Sun-matured recipes, premium ingredients, and authentic Indian flavors — made with care for every family.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    image: "https://images.unsplash.com/photo-1622480916113-9000ac49b79d?w=1600",
    badge: "Best Seller",
  },
];

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const [categories, bestSellers, heroSlideRows, wishlistRows] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isBestSeller: true },
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

  const ratings = await getProductRatings(bestSellers.map((p) => p.id));

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

      <WhyShopWithUs />

      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <SectionHeading title="Shop by Category" />
          <HorizontalScroller>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group flex w-36 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white transition-shadow hover:shadow-lg sm:w-48 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-amber-50 dark:bg-zinc-900">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(min-width: 640px) 192px, 144px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-amber-600 dark:text-amber-400">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 p-3 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#3f2d20] sm:text-sm dark:text-zinc-100">
                    {category.name}
                  </span>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Explore Now →</span>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading title="Best Sellers" />

        {bestSellers.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No products yet &mdash; add some from the{" "}
            <Link href="/admin/products" className="font-medium text-amber-700 dark:text-amber-400">
              admin panel
            </Link>
            .
          </p>
        ) : (
          <HorizontalScroller>
            {bestSellers.map((product) => (
              <div key={product.id} className="w-40 shrink-0 snap-start sm:w-56">
                <ProductCard product={product} wishlist={wishlist} rating={ratings.get(product.id)} />
              </div>
            ))}
          </HorizontalScroller>
        )}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full border-2 border-amber-600 px-6 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-600 hover:text-white dark:text-amber-400"
          >
            View all products
          </Link>
        </div>
      </section>

      <OurStorySection />

      <TestimonialsSection />

      <RecipesSection />

      <NewsletterSignup />
    </div>
  );
}
