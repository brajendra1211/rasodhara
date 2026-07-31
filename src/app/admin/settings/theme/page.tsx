import { getSiteSettings } from "@/lib/settings";
import { updateThemeSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";
import { ThemeColorPicker } from "@/components/admin/theme-color-picker";

export default async function AdminThemeSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Theme Color" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Sets the site&apos;s primary brand color &mdash; used for buttons, links, and accents across the site.
        Changes apply immediately after saving, no rebuild needed.
      </p>

      <form action={updateThemeSettings} className="flex max-w-xl flex-col gap-4">
        <ThemeColorPicker defaultValue={settings.themeColor} />

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save theme color
        </button>
      </form>
    </div>
  );
}
