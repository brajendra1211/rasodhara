import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfoTabs, type ProductInfoTab } from "@/components/product-info-tabs";
import { ProductTrustStrip } from "@/components/product-trust-strip";
import { ProductCard } from "@/components/product-card";
import { ReviewForm } from "@/components/review-form";
import { WishlistButton } from "@/components/wishlist-button";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";
import { hasVerifiedPurchase } from "@/lib/actions/reviews";
import { isInWishlist } from "@/lib/actions/wishlist";
import { getProductRatings } from "@/lib/reviews";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
      variants: { orderBy: { order: "asc" } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 10 },
      badges: { include: { trustBadge: true }, orderBy: { trustBadge: { order: "asc" } } },
    },
  });
}

async function getRecentlySoldCount(productId: string) {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const result = await prisma.orderItem.aggregate({
    where: {
      productId,
      order: { status: "PAID", createdAt: { gte: threeHoursAgo } },
    },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { images: { take: 1 }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

async function getActiveOffers() {
  return prisma.announcementMessage.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSiteSettings()]);
  if (!product) return {};

  const baseUrl = getBaseUrl(settings.canonicalDomain);
  const title = product.metaTitle || product.name;
  const description =
    product.metaDescription || product.shortDescription || stripHtml(product.description).slice(0, 160);
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/product/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, settings, session] = await Promise.all([getProduct(slug), getSiteSettings(), auth()]);

  if (!product) notFound();

  const userId = session?.user?.id;

  const [recentlySold, relatedProducts, offers, verifiedPurchase, wishlisted, relatedWishlistRows] =
    await Promise.all([
      getRecentlySoldCount(product.id),
      getRelatedProducts(product.categoryId, product.id),
      getActiveOffers(),
      userId ? hasVerifiedPurchase(userId, product.id) : Promise.resolve(false),
      userId ? isInWishlist(userId, product.id) : Promise.resolve(false),
      userId ? prisma.wishlist.findMany({ where: { userId }, select: { productId: true } }) : Promise.resolve([]),
    ]);

  const relatedWishlist = {
    loggedIn: Boolean(userId),
    wishlistedIds: new Set(relatedWishlistRows.map((w) => w.productId)),
    path: `/product/${slug}`,
  };
  const relatedRatings = await getProductRatings(relatedProducts.map((p) => p.id));

  const myReview = userId ? product.reviews.find((r) => r.userId === userId) ?? null : null;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;
  const image = product.images[0]?.url;

  const baseUrl = getBaseUrl(settings.canonicalDomain);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || stripHtml(product.description),
    image: product.images.map((i) => i.url),
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(avgRating !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${baseUrl}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${baseUrl}/shop?category=${product.category.slug}`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/product/${product.slug}` },
    ],
  };

  const ingredientList = product.ingredients
    ? product.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/shop" className="hover:text-amber-700 dark:hover:text-amber-400">
            Shop
          </Link>
          {" / "}
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-amber-700 dark:hover:text-amber-400">
            {product.category.name}
          </Link>
          {" / "}
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ProductGallery images={product.images} videoUrl={product.videoUrl} alt={product.name} />

          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1 flex flex-wrap gap-2">
                {product.isBestSeller && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">Best Seller</span>
                )}
                {product.isJainFriendly && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Jain friendly
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              {avgRating !== null && (
                <p className="mt-1 text-sm text-zinc-500">
                  &#9733; {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </p>
              )}
              {recentlySold > 0 && (
                <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                  &#128293; {recentlySold} sold in the last 3 hours
                </p>
              )}
              {product.shortDescription && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{product.shortDescription}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                mrp={product.mrp}
                image={image ?? ""}
                stock={product.stock}
                variants={product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  price: v.price,
                  mrp: v.mrp,
                  stock: v.stock,
                }))}
              />
              <WishlistButton
                productId={product.id}
                path={`/product/${slug}`}
                initialActive={wishlisted}
                loggedIn={Boolean(userId)}
                variant="inline"
              />
            </div>

            <ProductTrustStrip productBadges={product.badges.map((b) => b.trustBadge)} />

            <ProductInfoTabs
              tabs={
                [
                  {
                    label: "Description",
                    content: (
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ),
                  } as ProductInfoTab | null,
                  ingredientList.length > 0
                    ? {
                        label: "Ingredients",
                        content: (
                          <ul className="flex flex-col gap-2">
                            {ingredientList.map((ingredient) => (
                              <li key={ingredient} className="flex items-center gap-2">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        ),
                      }
                    : null,
                  product.tasteProfile || product.oilType
                    ? {
                        label: "Taste & Type",
                        content: (
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {product.oilType && (
                              <>
                                <dt className="text-zinc-500">Oil type</dt>
                                <dd>{product.oilType}</dd>
                              </>
                            )}
                            {product.tasteProfile && (
                              <>
                                <dt className="text-zinc-500">Taste profile</dt>
                                <dd>{product.tasteProfile}</dd>
                              </>
                            )}
                            {product.weightGrams && (
                              <>
                                <dt className="text-zinc-500">Weight</dt>
                                <dd>{product.weightGrams}g</dd>
                              </>
                            )}
                          </dl>
                        ),
                      }
                    : null,
                  product.shelfLife
                    ? {
                        label: "Shelf Life",
                        content: <p>{product.shelfLife}</p>,
                      }
                    : null,
                  offers.length > 0
                    ? {
                        label: "Offers",
                        content: (
                          <ul className="flex flex-col gap-2">
                            {offers.map((offer) => (
                              <li key={offer.id} className="flex items-center gap-2">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    d="M20.5 12.5l-8 8a1.5 1.5 0 01-2.12 0l-6.88-6.88a1.5 1.5 0 010-2.12l8-8A1.5 1.5 0 0112.5 3H19a1.5 1.5 0 011.5 1.5v6.5a1.5 1.5 0 01-.44 1.06z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <circle cx="15.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
                                </svg>
                                {offer.text}
                              </li>
                            ))}
                          </ul>
                        ),
                      }
                    : null,
                ].filter((tab): tab is ProductInfoTab => tab !== null)
              }
            />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-lg font-semibold">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  product={related}
                  wishlist={relatedWishlist}
                  rating={relatedRatings.get(related.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 max-w-2xl">
          <h2 className="mb-4 text-lg font-semibold">Reviews</h2>

          {verifiedPurchase ? (
            <div className="mb-8">
              <ReviewForm
                productId={product.id}
                slug={product.slug}
                initialRating={myReview?.rating}
                initialComment={myReview?.comment}
              />
            </div>
          ) : userId ? (
            <p className="mb-8 text-sm text-zinc-500">
              Only customers who have purchased this product can write a review.
            </p>
          ) : (
            <p className="mb-8 text-sm text-zinc-500">
              <Link href="/login" className="text-amber-700 hover:underline dark:text-amber-400">
                Sign in
              </Link>{" "}
              to write a review.
            </p>
          )}

          {product.reviews.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {product.reviews.map((review) => (
                <li key={review.id} className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{review.user.name}</span>
                    <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                  </div>
                  {review.comment && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No reviews yet. Be the first to review this product.</p>
          )}
        </section>
      </div>
    </>
  );
}
