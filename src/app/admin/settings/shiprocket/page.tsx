import { getSiteSettings } from "@/lib/settings";
import { updateShiprocketSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminShiprocketSettingsPage() {
  const settings = await getSiteSettings();
  const hasSavedPassword = Boolean(settings.shiprocketPassword);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Shiprocket" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Connects to Shiprocket using your account email/password (same as{" "}
        <span className="font-medium">shiprocket.in</span> login) to automatically create a shipment whenever an
        order is paid or placed as Cash on Delivery. Uses the pickup address named{" "}
        <span className="font-medium">&ldquo;Primary&rdquo;</span> in your Shiprocket dashboard &mdash; make sure that
        pickup location exists there. The password is encrypted before it&apos;s stored.
      </p>

      <form action={updateShiprocketSettings} className="flex max-w-xl flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="shiprocketEnabled" defaultChecked={settings.shiprocketEnabled} />
          Enable automatic Shiprocket shipment creation
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="shiprocketEmail" className="text-sm font-medium">
            Shiprocket account email
          </label>
          <input
            id="shiprocketEmail"
            name="shiprocketEmail"
            type="email"
            autoComplete="off"
            defaultValue={settings.shiprocketEmail ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="shiprocketPassword" className="text-sm font-medium">
            Shiprocket account password
          </label>
          <input
            id="shiprocketPassword"
            name="shiprocketPassword"
            type="password"
            autoComplete="off"
            placeholder={hasSavedPassword ? "•••••••••••••• (saved — leave blank to keep)" : "Enter password"}
            className="rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            {hasSavedPassword
              ? "A password is already saved. Leave this blank to keep it, or enter a new one to replace it."
              : "Stored encrypted; never shown again after saving."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="shiprocketPackageWeightGrams" className="text-sm font-medium">
              Default weight (g)
            </label>
            <input
              id="shiprocketPackageWeightGrams"
              name="shiprocketPackageWeightGrams"
              type="number"
              min={1}
              defaultValue={settings.shiprocketPackageWeightGrams}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="shiprocketPackageLengthCm" className="text-sm font-medium">
              Length (cm)
            </label>
            <input
              id="shiprocketPackageLengthCm"
              name="shiprocketPackageLengthCm"
              type="number"
              min={1}
              defaultValue={settings.shiprocketPackageLengthCm}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="shiprocketPackageBreadthCm" className="text-sm font-medium">
              Breadth (cm)
            </label>
            <input
              id="shiprocketPackageBreadthCm"
              name="shiprocketPackageBreadthCm"
              type="number"
              min={1}
              defaultValue={settings.shiprocketPackageBreadthCm}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="shiprocketPackageHeightCm" className="text-sm font-medium">
              Height (cm)
            </label>
            <input
              id="shiprocketPackageHeightCm"
              name="shiprocketPackageHeightCm"
              type="number"
              min={1}
              defaultValue={settings.shiprocketPackageHeightCm}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-zinc-500">
          Package dimensions above are always used. Shipment weight is the sum of each item&apos;s product
          &ldquo;Weight&rdquo; (from the product page) &times; quantity; the default weight above is only used as a
          fallback for products that don&apos;t have a weight set.
        </p>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save Shiprocket settings
        </button>
      </form>
    </div>
  );
}
