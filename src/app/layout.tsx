import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display, Poppins, Merriweather, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { getSiteSettings } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site-url";
import { generateColorRamp, isValidHexColor, DEFAULT_THEME_COLOR } from "@/lib/theme-color";
import { getHeadingFontCssVar } from "@/lib/heading-font";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl(settings.canonicalDomain);
  const title = settings.metaTitle || settings.siteName;
  const description =
    settings.metaDescription ||
    settings.tagline ||
    "Cold-pressed oils and farm-fresh products, sold direct from the farm.";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    robots: settings.robotsIndexingEnabled
      ? { index: true, follow: true }
      : { index: false, follow: false },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title,
      description,
      images: settings.ogImage ? [{ url: settings.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.ogImage ? [settings.ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const baseUrl = getBaseUrl(settings.canonicalDomain);

  const themeColorRamp = generateColorRamp(
    isValidHexColor(settings.themeColor) ? settings.themeColor : DEFAULT_THEME_COLOR
  );
  const headingFontVar = getHeadingFontCssVar(settings.headingFont);
  const themeColorCss = `:root{${Object.entries(themeColorRamp)
    .map(([step, hex]) => `--color-amber-${step}:${hex};`)
    .join("")}--heading-font:${headingFontVar};}`;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: baseUrl,
    ...(settings.logoUrl ? { logo: new URL(settings.logoUrl, baseUrl).toString() } : {}),
    ...(settings.contactEmail || settings.contactPhone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
            ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
            contactType: "customer service",
          },
        }
      : {}),
  };

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfairDisplay.variable} ${merriweather.variable} ${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="pb-mobile-nav flex min-h-full flex-col bg-cream text-zinc-900 dark:bg-black dark:text-zinc-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: themeColorCss }} />
        <AuthProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
