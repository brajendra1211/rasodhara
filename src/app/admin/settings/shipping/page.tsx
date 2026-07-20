import { getSiteSettings } from "@/lib/settings";
import { updateShippingSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminShippingSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Shipping & Tax" />

      <form action={updateShippingSettings} className="flex max-w-xl flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="codEnabled" defaultChecked={settings.codEnabled} />
          Allow Cash on Delivery (COD) at checkout
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="shippingFlatFee" className="text-sm font-medium">
            Flat shipping fee (₹)
          </label>
          <input
            id="shippingFlatFee"
            name="shippingFlatFee"
            type="number"
            min={0}
            step="0.01"
            defaultValue={settings.shippingFlatFee / 100}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">Charged on every order unless the free-shipping threshold below is met. Set to 0 for free shipping always.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="freeShippingThreshold" className="text-sm font-medium">
            Free shipping above (₹, optional)
          </label>
          <input
            id="freeShippingThreshold"
            name="freeShippingThreshold"
            type="number"
            min={0}
            step="0.01"
            defaultValue={settings.freeShippingThreshold ? settings.freeShippingThreshold / 100 : ""}
            placeholder="Leave blank to always charge the flat fee"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gstRatePercent" className="text-sm font-medium">
            GST rate (%)
          </label>
          <input
            id="gstRatePercent"
            name="gstRatePercent"
            type="number"
            min={0}
            max={100}
            defaultValue={settings.gstRatePercent}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            Applied to the order subtotal (after discount) at checkout. Leave at 0 if you&apos;re not GST-registered or your prices are already tax-inclusive.
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
