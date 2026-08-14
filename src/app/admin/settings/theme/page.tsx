import { getSiteSettings } from "@/lib/settings";
import { updateThemeSettings, updateHeadingFontSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";
import { ThemeColorPicker } from "@/components/admin/theme-color-picker";
import { HEADING_FONT_OPTIONS } from "@/lib/heading-font";

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

      <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

      <h2 className="mb-2 text-lg font-semibold">Heading font</h2>
      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Used for section titles across the site (Shop by Category, Best Sellers, Our Story, testimonials, recipes,
        etc.) so they all stay visually consistent.
      </p>

      <form action={updateHeadingFontSettings} className="flex max-w-xl flex-col gap-4">
        <select
          name="headingFont"
          defaultValue={settings.headingFont}
          className="w-fit rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {HEADING_FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save heading font
        </button>
      </form>
    </div>
  );
}
