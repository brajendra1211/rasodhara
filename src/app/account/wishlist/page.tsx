import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/account-nav";
import { ProductCard } from "@/components/product-card";
import { getProductRatings } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Your Wishlist",
  robots: { index: false, follow: false },
};

export default async function AccountWishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/wishlist");

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const products = await prisma.product.findMany({
    where: { id: { in: wishlistItems.map((w) => w.productId) } },
    include: { images: { take: 1 }, variants: true },
  });

  const orderedProducts = wishlistItems
    .map((w) => products.find((p) => p.id === w.productId))
    .filter((p): p is (typeof products)[number] => p !== undefined);

  const wishlist = {
    loggedIn: true,
    wishlistedIds: new Set(wishlistItems.map((w) => w.productId)),
    path: "/account/wishlist",
  };
  const ratings = await getProductRatings(orderedProducts.map((p) => p.id));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your account</h1>
      <AccountNav active="Wishlist" />

      {orderedProducts.length === 0 ? (
        <p className="text-sm text-zinc-500">
          You haven&apos;t saved anything yet.{" "}
          <Link href="/shop" className="font-medium text-amber-700 dark:text-amber-400">
            Browse products
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {orderedProducts.map((product) => (
            <ProductCard key={product.id} product={product} wishlist={wishlist} rating={ratings.get(product.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
