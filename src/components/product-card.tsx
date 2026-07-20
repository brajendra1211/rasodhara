import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/format";
import { WishlistButton } from "@/components/wishlist-button";

const LOW_STOCK_THRESHOLD = 5;

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  stock: number;
  images: { url: string }[];
  isBestSeller: boolean;
  isJainFriendly: boolean;
  variants?: { price: number; mrp: number; stock: number }[];
};

export function ProductCard({
  product,
  wishlist,
  rating,
}: {
  product: ProductCardData;
  wishlist?: { loggedIn: boolean; wishlistedIds: Set<string>; path: string };
  rating?: { avg: number; count: number };
}) {
  const image = product.images[0]?.url;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const displayPrice = hasVariants
    ? Math.min(...product.variants!.map((v) => v.price))
    : product.price;
  const displayMrp = hasVariants
    ? product.variants!.find((v) => v.price === displayPrice)?.mrp ?? product.mrp
    : product.mrp;
  const discount = displayMrp > displayPrice ? Math.round((1 - displayPrice / displayMrp) * 100) : 0;
  const totalStock = hasVariants ? product.variants!.reduce((sum, v) => sum + v.stock, 0) : product.stock;
  const isLowStock = totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">No image</div>
        )}
        {product.isBestSeller && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            Best Seller
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-700 px-2 py-0.5 text-[11px] font-semibold text-white">
            {discount}% off
          </span>
        )}
        {wishlist && (
          <WishlistButton
            productId={product.id}
            path={wishlist.path}
            initialActive={wishlist.wishlistedIds.has(product.id)}
            loggedIn={wishlist.loggedIn}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{product.name}</h3>
        {rating && rating.count > 0 && (
          <p className="text-xs text-zinc-500">
            <span className="text-amber-500">★</span> {rating.avg.toFixed(1)} ({rating.count})
          </p>
        )}
        {product.isJainFriendly && <span className="text-xs text-amber-700 dark:text-amber-400">Jain friendly</span>}
        {isLowStock && <span className="text-xs font-medium text-red-600">Only {totalStock} left</span>}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {hasVariants && <span className="text-xs text-zinc-500">From</span>}
          <span className="text-sm font-semibold">{formatINR(displayPrice)}</span>
          {displayMrp > displayPrice && (
            <span className="text-xs text-zinc-400 line-through">{formatINR(displayMrp)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
