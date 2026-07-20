"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveImageAsWebp } from "@/lib/upload-image";

const DESCRIPTION_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "s", "h3", "h4", "ul", "ol", "li", "blockquote", "code", "pre"],
  allowedAttributes: {},
};

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

function parseImageUrls(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseVariants(formData: FormData) {
  const labels = formData.getAll("variantLabel").map(String);
  const prices = formData.getAll("variantPrice").map(String);
  const mrps = formData.getAll("variantMrp").map(String);
  const stocks = formData.getAll("variantStock").map(String);

  return labels
    .map((label, i) => ({
      label: label.trim(),
      price: Math.round(Number(prices[i] ?? 0) * 100),
      mrp: Math.round(Number(mrps[i] ?? 0) * 100),
      stock: Number(stocks[i] ?? 0),
      order: i,
    }))
    .filter((v) => v.label);
}

async function productFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  const uploadedFiles = formData.getAll("imageFiles").filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedUrls = await Promise.all(uploadedFiles.map((file) => saveImageAsWebp(file, "products")));
  const images = [...parseImageUrls(String(formData.get("images") ?? "")), ...uploadedUrls];

  return {
    name,
    slug: slugify(String(formData.get("slug") ?? "") || name),
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
    description: sanitizeHtml(String(formData.get("description") ?? ""), DESCRIPTION_SANITIZE_OPTIONS),
    price: Math.round(Number(formData.get("price")) * 100),
    mrp: Math.round(Number(formData.get("mrp")) * 100),
    stock: Number(formData.get("stock") ?? 0),
    categoryId: String(formData.get("categoryId") ?? ""),
    isBestSeller: formData.get("isBestSeller") === "on",
    isJainFriendly: formData.get("isJainFriendly") === "on",
    tasteProfile: String(formData.get("tasteProfile") ?? "").trim() || null,
    oilType: String(formData.get("oilType") ?? "").trim() || null,
    weightGrams: formData.get("weightGrams") ? Number(formData.get("weightGrams")) : null,
    ingredients: String(formData.get("ingredients") ?? "").trim() || null,
    shelfLife: String(formData.get("shelfLife") ?? "").trim() || null,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
    images,
    variants: parseVariants(formData),
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = await productFromForm(formData);

  await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      mrp: data.mrp,
      stock: data.stock,
      categoryId: data.categoryId,
      isBestSeller: data.isBestSeller,
      isJainFriendly: data.isJainFriendly,
      tasteProfile: data.tasteProfile,
      oilType: data.oilType,
      weightGrams: data.weightGrams,
      ingredients: data.ingredients,
      shelfLife: data.shelfLife,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      images: { create: data.images.map((url) => ({ url })) },
      variants: { create: data.variants },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();
  const data = await productFromForm(formData);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      mrp: data.mrp,
      stock: data.stock,
      categoryId: data.categoryId,
      isBestSeller: data.isBestSeller,
      isJainFriendly: data.isJainFriendly,
      tasteProfile: data.tasteProfile,
      oilType: data.oilType,
      weightGrams: data.weightGrams,
      ingredients: data.ingredients,
      shelfLife: data.shelfLife,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      images: {
        deleteMany: {},
        create: data.images.map((url) => ({ url })),
      },
      variants: {
        deleteMany: {},
        create: data.variants,
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/product/${data.slug}`);
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}
