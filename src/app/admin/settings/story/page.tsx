import { getSiteSettings } from "@/lib/settings";
import { updateStorySection } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default async function AdminStorySettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Our Story" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        A short excerpt appears in a teaser on the home page; the full body is shown on the dedicated{" "}
        <code>/our-story</code> page. Leave the title empty to hide the teaser entirely.
      </p>

      <form action={updateStorySection} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="storyTitle" className="text-sm font-medium">
            Title
          </label>
          <input
            id="storyTitle"
            name="storyTitle"
            placeholder="e.g. Our Story"
            defaultValue={settings.storyTitle ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="storyExcerpt" className="text-sm font-medium">
            Home page excerpt (short teaser, 1-3 sentences)
          </label>
          <textarea
            id="storyExcerpt"
            name="storyExcerpt"
            rows={3}
            defaultValue={settings.storyExcerpt ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Full body (shown on the /our-story page)</label>
          <RichTextEditor name="storyBody" defaultValue={settings.storyBody ?? ""} />
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <label htmlFor="storyImageFile" className="text-sm font-medium">
              Upload image
            </label>
            <input
              id="storyImageFile"
              name="storyImageFile"
              type="file"
              accept="image/*"
              className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
            />
            <p className="text-xs text-zinc-500">Automatically converted to WebP.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="storyImage" className="text-sm font-medium">
              Or paste an image URL
            </label>
            <input
              id="storyImage"
              name="storyImage"
              defaultValue={settings.storyImage ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          {settings.storyImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.storyImage} alt="Current story image" className="h-32 w-auto rounded-md object-cover" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="storyCtaLabel" className="text-sm font-medium">
              Button label (optional)
            </label>
            <input
              id="storyCtaLabel"
              name="storyCtaLabel"
              placeholder="Read our story"
              defaultValue={settings.storyCtaLabel ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="storyCtaHref" className="text-sm font-medium">
              Button link (optional)
            </label>
            <input
              id="storyCtaHref"
              name="storyCtaHref"
              placeholder="/shop"
              defaultValue={settings.storyCtaHref ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save story section
        </button>
      </form>
    </div>
  );
}
