"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function hasVerifiedPurchase(userId: string, productId: string) {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    },
  });
  return orderItem !== null;
}

export async function submitReview(productId: string, slug: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to write a review.");
  }

  const verified = await hasVerifiedPurchase(userId, productId);
  if (!verified) {
    throw new Error("Only customers who purchased this product can write a review.");
  }

  const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 0));
  if (!rating) {
    throw new Error("Please select a rating.");
  }
  const comment = (formData.get("comment") as string | null)?.trim() || null;

  await prisma.review.upsert({
    where: { productId_userId: { productId, userId } },
    update: { rating, comment },
    create: { productId, userId, rating, comment },
  });

  revalidatePath(`/product/${slug}`);
}

export async function deleteReview(productId: string, slug: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  await prisma.review.delete({ where: { productId_userId: { productId, userId } } }).catch(() => {});

  revalidatePath(`/product/${slug}`);
}
