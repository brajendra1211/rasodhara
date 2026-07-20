"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return item !== null;
}

export async function toggleWishlist(productId: string, path: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to save items to your wishlist.");
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlist.create({ data: { userId, productId } });
  }

  revalidatePath(path);
  revalidatePath("/account/wishlist");
}

export async function removeFromWishlist(productId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  await prisma.wishlist.deleteMany({ where: { userId, productId } });
  revalidatePath("/account/wishlist");
}
