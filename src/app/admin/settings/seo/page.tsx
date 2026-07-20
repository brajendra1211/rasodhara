import { getSiteSettings } from "@/lib/settings";
import { updateSeoSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminSeoSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="SEO" />

      <form action={updateSeoSettings} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="canonicalDomain" className="text-sm font-medium">
            Canonical domain (e.g. https://www.farmstore.com)
          </label>
          <input
            id="canonicalDomain"
            name="canonicalDomain"
            placeholder="https://www.yourdomain.com"
            defaultValue={settings.canonicalDomain ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            Used to build the sitemap, robots.txt, and canonical URLs. Set this to your real domain once it&apos;s live.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            Default meta title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            placeholder={settings.siteName}
            defaultValue={settings.metaTitle ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="metaDescription" className="text-sm font-medium">
            Default meta description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows={2}
            placeholder={settings.tagline ?? ""}
            defaultValue={settings.metaDescription ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ogImageFile" className="text-sm font-medium">
            Social share image (Open Graph)
          </label>
          <input
            id="ogImageFile"
            name="ogImageFile"
            type="file"
            accept="image/*"
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
          />
          <p className="text-xs text-zinc-500">Shown when the site is shared on WhatsApp, Facebook, Twitter/X, etc. Automatically converted to WebP.</p>
          <label htmlFor="ogImage" className="mt-1 text-sm font-medium">
            Or paste an image URL
          </label>
          <input
            id="ogImage"
            name="ogImage"
            defaultValue={settings.ogImage ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {settings.ogImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.ogImage} alt="Current social share image" className="mt-1 h-24 w-auto rounded-md object-cover" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="googleSiteVerification" className="text-sm font-medium">
            Google Search Console verification code (optional)
          </label>
          <input
            id="googleSiteVerification"
            name="googleSiteVerification"
            placeholder="e.g. abc123xyz..."
            defaultValue={settings.googleSiteVerification ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            Paste just the content value from Google Search Console&apos;s HTML tag verification method.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="robotsIndexingEnabled" defaultChecked={settings.robotsIndexingEnabled} />
          Allow search engines to index this site
        </label>
        <p className="text-xs text-zinc-500">
          Turn this off while the site is still in development or staging, so it doesn&apos;t get indexed too early.
        </p>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save SEO settings
        </button>
      </form>
    </div>
  );
}
