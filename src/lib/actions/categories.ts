"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveImageAsWebp } from "@/lib/upload-image";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function categoryFromForm(formData: FormData, existingImage: string | null) {
  const name = String(formData.get("name") ?? "").trim();
  const imageFile = formData.get("imageFile");
  const image =
    imageFile instanceof File && imageFile.size > 0
      ? await saveImageAsWebp(imageFile, "categories")
      : String(formData.get("image") ?? "").trim() || existingImage;

  return {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    description: String(formData.get("description") ?? "").trim() || null,
    image,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
  };
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const data = await categoryFromForm(formData, null);
  if (!data.name) return;

  await prisma.category.create({ data });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  const data = await categoryFromForm(formData, existing?.image ?? null);

  await prisma.category.update({ where: { id: categoryId }, data });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}
