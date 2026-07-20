import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl(settings.canonicalDomain);

  if (!settings.robotsIndexingEnabled) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/cart", "/checkout", "/account", "/login", "/register", "/order"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
