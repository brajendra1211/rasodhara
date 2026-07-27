"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveImageAsWebp } from "@/lib/upload-image";

const RICH_TEXT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "s", "h3", "h4", "ul", "ol", "li", "blockquote", "code", "pre"],
  allowedAttributes: {},
};

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

function revalidateSiteWide() {
  revalidatePath("/", "layout");
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const logoFile = formData.get("logoFile");
  const logoUrl =
    logoFile instanceof File && logoFile.size > 0
      ? await saveImageAsWebp(logoFile, "logo")
      : String(formData.get("logoUrl") ?? "").trim() || existing?.logoUrl || null;

  const data = {
    siteName: String(formData.get("siteName") ?? "").trim() || "FarmStore",
    logoUrl,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    footerText: String(formData.get("footerText") ?? "").trim() || null,
    contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
    contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
    contactAddress: String(formData.get("contactAddress") ?? "").trim() || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

export async function updateSeoSettings(formData: FormData) {
  await requireAdmin();

  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const ogImageFile = formData.get("ogImageFile");
  const ogImage =
    ogImageFile instanceof File && ogImageFile.size > 0
      ? await saveImageAsWebp(ogImageFile, "seo")
      : String(formData.get("ogImage") ?? "").trim() || existing?.ogImage || null;

  const data = {
    canonicalDomain: String(formData.get("canonicalDomain") ?? "").trim() || null,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
    ogImage,
    googleSiteVerification: String(formData.get("googleSiteVerification") ?? "").trim() || null,
    robotsIndexingEnabled: formData.get("robotsIndexingEnabled") === "on",
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

export async function updateStorySection(formData: FormData) {
  await requireAdmin();

  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const storyImageFile = formData.get("storyImageFile");
  const storyImage =
    storyImageFile instanceof File && storyImageFile.size > 0
      ? await saveImageAsWebp(storyImageFile, "story")
      : String(formData.get("storyImage") ?? "").trim() || existing?.storyImage || null;

  const data = {
    storyTitle: String(formData.get("storyTitle") ?? "").trim() || null,
    storyExcerpt: String(formData.get("storyExcerpt") ?? "").trim() || null,
    storyBody: sanitizeHtml(String(formData.get("storyBody") ?? ""), RICH_TEXT_SANITIZE_OPTIONS) || null,
    storyImage,
    storyCtaLabel: String(formData.get("storyCtaLabel") ?? "").trim() || null,
    storyCtaHref: String(formData.get("storyCtaHref") ?? "").trim() || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

export async function updateWhyUsSection(formData: FormData) {
  await requireAdmin();

  const data = {
    whyUsTitle: String(formData.get("whyUsTitle") ?? "").trim() || null,
    whyUsBody: sanitizeHtml(String(formData.get("whyUsBody") ?? ""), RICH_TEXT_SANITIZE_OPTIONS) || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

export async function updateShippingSettings(formData: FormData) {
  await requireAdmin();

  const freeShippingThresholdRaw = String(formData.get("freeShippingThreshold") ?? "").trim();

  const data = {
    codEnabled: formData.get("codEnabled") === "on",
    shippingFlatFee: Math.max(0, Math.round(Number(formData.get("shippingFlatFee") ?? 0) * 100)),
    freeShippingThreshold: freeShippingThresholdRaw ? Math.round(Number(freeShippingThresholdRaw) * 100) : null,
    gstRatePercent: Math.min(100, Math.max(0, Number(formData.get("gstRatePercent") ?? 0))),
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

export async function updateSocialLinks(formData: FormData) {
  await requireAdmin();

  const data = {
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
    facebookUrl: String(formData.get("facebookUrl") ?? "").trim() || null,
    twitterUrl: String(formData.get("twitterUrl") ?? "").trim() || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim() || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidateSiteWide();
}

// Legal pages

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function legalPageFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(String(formData.get("slug") ?? "") || title),
    body: sanitizeHtml(String(formData.get("body") ?? ""), RICH_TEXT_SANITIZE_OPTIONS),
  };
}

export async function createLegalPage(formData: FormData) {
  await requireAdmin();
  const data = legalPageFromForm(formData);
  if (!data.title || !data.slug) return;

  await prisma.legalPage.create({ data });
  revalidateSiteWide();
  redirect("/admin/settings/legal");
}

export async function updateLegalPage(pageId: string, formData: FormData) {
  await requireAdmin();
  const data = legalPageFromForm(formData);

  await prisma.legalPage.update({ where: { id: pageId }, data });
  revalidateSiteWide();
  redirect("/admin/settings/legal");
}

export async function deleteLegalPage(pageId: string) {
  await requireAdmin();
  await prisma.legalPage.delete({ where: { id: pageId } });
  revalidateSiteWide();
}

// Announcement messages

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  await prisma.announcementMessage.create({
    data: { text, order: Number(formData.get("order") ?? 0) },
  });

  revalidateSiteWide();
}

export async function toggleAnnouncement(id: string, active: boolean) {
  await requireAdmin();
  await prisma.announcementMessage.update({ where: { id }, data: { active } });
  revalidateSiteWide();
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  await prisma.announcementMessage.delete({ where: { id } });
  revalidateSiteWide();
}

// Hero slides

async function heroSlideFromForm(formData: FormData) {
  const imageFile = formData.get("imageFile");
  const image =
    imageFile instanceof File && imageFile.size > 0
      ? await saveImageAsWebp(imageFile, "hero")
      : String(formData.get("image") ?? "").trim();

  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: String(formData.get("ctaHref") ?? "").trim(),
    image,
    badge: String(formData.get("badge") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    active: formData.get("active") === "on",
  };
}

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  await prisma.heroSlide.create({ data: await heroSlideFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/hero");
}

export async function updateHeroSlide(slideId: string, formData: FormData) {
  await requireAdmin();
  await prisma.heroSlide.update({ where: { id: slideId }, data: await heroSlideFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/hero");
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  revalidateSiteWide();
}

// Trust badges

const ICON_KEYS = ["leaf", "sun", "home", "flask", "shield", "ban", "badge", "hand", "truck", "refresh", "chat"] as const;

function trustBadgeFromForm(formData: FormData) {
  const icon = String(formData.get("icon") ?? "leaf");
  return {
    label: String(formData.get("label") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    icon: (ICON_KEYS as readonly string[]).includes(icon) ? icon : "leaf",
    order: Number(formData.get("order") ?? 0),
    active: formData.get("active") === "on",
  };
}

export async function createTrustBadge(formData: FormData) {
  await requireAdmin();
  await prisma.trustBadge.create({ data: trustBadgeFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/badges");
}

export async function updateTrustBadge(badgeId: string, formData: FormData) {
  await requireAdmin();
  await prisma.trustBadge.update({ where: { id: badgeId }, data: trustBadgeFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/badges");
}

export async function deleteTrustBadge(id: string) {
  await requireAdmin();
  await prisma.trustBadge.delete({ where: { id } });
  revalidateSiteWide();
}

// Testimonials

function testimonialFromForm(formData: FormData) {
  return {
    authorName: String(formData.get("authorName") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5))),
    productName: String(formData.get("productName") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    active: formData.get("active") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.create({ data: testimonialFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/testimonials");
}

export async function updateTestimonial(testimonialId: string, formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.update({ where: { id: testimonialId }, data: testimonialFromForm(formData) });
  revalidateSiteWide();
  redirect("/admin/settings/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidateSiteWide();
}

// Newsletter

export type NewsletterState = { error?: string; success?: boolean };

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return { success: true };
}

export async function deleteNewsletterSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
