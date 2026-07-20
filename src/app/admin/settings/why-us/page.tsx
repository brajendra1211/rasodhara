import { getSiteSettings } from "@/lib/settings";
import { updateWhyUsSection } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default async function AdminWhyUsSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Why Us" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Shown as the second section on the <code>/our-story</code> page, right after Our Story. Leave the title
        empty to hide it.
      </p>

      <form action={updateWhyUsSection} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="whyUsTitle" className="text-sm font-medium">
            Title
          </label>
          <input
            id="whyUsTitle"
            name="whyUsTitle"
            placeholder="e.g. Why Rasodhara?"
            defaultValue={settings.whyUsTitle ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Body</label>
          <RichTextEditor name="whyUsBody" defaultValue={settings.whyUsBody ?? ""} />
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save
        </button>
      </form>
    </div>
  );
}
