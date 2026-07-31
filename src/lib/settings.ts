import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  id: "singleton",
  siteName: "FarmStore",
  logoUrl: null as string | null,
  tagline: "Cold-pressed oils, ghee, spices and grains, sourced directly from farmers and delivered fresh to your door.",
  footerText: null as string | null,
  contactEmail: null as string | null,
  contactPhone: null as string | null,
  contactAddress: null as string | null,
  canonicalDomain: null as string | null,
  metaTitle: null as string | null,
  metaDescription: null as string | null,
  ogImage: null as string | null,
  googleSiteVerification: null as string | null,
  robotsIndexingEnabled: true,
  storyTitle: null as string | null,
  storyExcerpt: null as string | null,
  storyBody: null as string | null,
  storyImage: null as string | null,
  storyVideo: null as string | null,
  storyCtaLabel: null as string | null,
  storyCtaHref: null as string | null,
  whyUsTitle: null as string | null,
  whyUsBody: null as string | null,
  instagramUrl: null as string | null,
  facebookUrl: null as string | null,
  twitterUrl: null as string | null,
  youtubeUrl: null as string | null,
  codEnabled: true,
  shippingFlatFee: 0,
  freeShippingThreshold: null as number | null,
  gstRatePercent: 0,
  themeColor: "#b8860b",
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return settings ?? DEFAULT_SETTINGS;
}
