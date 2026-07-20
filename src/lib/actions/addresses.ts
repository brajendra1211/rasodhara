"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }
  return session.user.id;
}

export async function createAddress(formData: FormData) {
  const userId = await requireUser();

  const label = String(formData.get("label") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const isDefault = formData.get("isDefault") === "on";

  if (!name || !phone || !address) return;

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const existingCount = await prisma.address.count({ where: { userId } });

  await prisma.address.create({
    data: { userId, label, name, phone, address, isDefault: isDefault || existingCount === 0 },
  });

  revalidatePath("/account/addresses");
}

export async function deleteAddress(addressId: string) {
  const userId = await requireUser();
  await prisma.address.deleteMany({ where: { id: addressId, userId } });
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const userId = await requireUser();
  await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.address.updateMany({ where: { id: addressId, userId }, data: { isDefault: true } });
  revalidatePath("/account/addresses");
}
