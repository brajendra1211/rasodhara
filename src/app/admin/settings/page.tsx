import { getSiteSettings } from "@/lib/settings";
import { updateSiteSettings, updateSocialLinks } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="General" />

      <form action={updateSiteSettings} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="siteName" className="text-sm font-medium">
            Site name
          </label>
          <input
            id="siteName"
            name="siteName"
            required
            defaultValue={settings.siteName}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Logo (shown next to the site name in the header)
          </h3>
          <div className="flex flex-col gap-1">
            <label htmlFor="logoFile" className="text-sm font-medium">
              Upload logo
            </label>
            <input
              id="logoFile"
              name="logoFile"
              type="file"
              accept="image/*"
              className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
            />
            <p className="text-xs text-zinc-500">Automatically converted to WebP.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="logoUrl" className="text-sm font-medium">
              Or paste an image URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              defaultValue={settings.logoUrl ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          {settings.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt="Current logo" className="h-12 w-12 rounded-full object-cover" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tagline" className="text-sm font-medium">
            Tagline (used in footer &amp; page description)
          </label>
          <textarea
            id="tagline"
            name="tagline"
            rows={2}
            defaultValue={settings.tagline ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="contactEmail" className="text-sm font-medium">
              Contact email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="contactPhone" className="text-sm font-medium">
              Contact phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              defaultValue={settings.contactPhone ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contactAddress" className="text-sm font-medium">
            Address
          </label>
          <textarea
            id="contactAddress"
            name="contactAddress"
            rows={2}
            defaultValue={settings.contactAddress ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="footerText" className="text-sm font-medium">
            Footer copyright line (optional override)
          </label>
          <input
            id="footerText"
            name="footerText"
            placeholder={`© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}
            defaultValue={settings.footerText ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save settings
        </button>
      </form>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Social links</h2>
      <form action={updateSocialLinks} className="flex max-w-xl flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="instagramUrl" className="text-sm font-medium">
              Instagram URL
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={settings.instagramUrl ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="facebookUrl" className="text-sm font-medium">
              Facebook URL
            </label>
            <input
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={settings.facebookUrl ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="twitterUrl" className="text-sm font-medium">
              Twitter / X URL
            </label>
            <input
              id="twitterUrl"
              name="twitterUrl"
              defaultValue={settings.twitterUrl ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="youtubeUrl" className="text-sm font-medium">
              YouTube URL
            </label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={settings.youtubeUrl ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500">Leave blank to hide an icon from the footer.</p>
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save social links
        </button>
      </form>
    </div>
  );
}
