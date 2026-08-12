import { getSiteSettings } from "@/lib/settings";
import { updateRazorpaySettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminPaymentsSettingsPage() {
  const settings = await getSiteSettings();
  const hasSavedSecret = Boolean(settings.razorpayKeySecret);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Payments" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Live Razorpay credentials for accepting online payments at checkout. Get your Key ID and Key Secret from the{" "}
        <span className="font-medium">Razorpay Dashboard → Settings → API Keys</span>. The key secret is encrypted before
        it&apos;s stored.
      </p>

      <form action={updateRazorpaySettings} className="flex max-w-xl flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="razorpayEnabled" defaultChecked={settings.razorpayEnabled} />
          Enable Razorpay online payments at checkout
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="razorpayKeyId" className="text-sm font-medium">
            Key ID
          </label>
          <input
            id="razorpayKeyId"
            name="razorpayKeyId"
            type="text"
            autoComplete="off"
            placeholder="rzp_live_xxxxxxxxxxxx"
            defaultValue={settings.razorpayKeyId ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="razorpayKeySecret" className="text-sm font-medium">
            Key Secret
          </label>
          <input
            id="razorpayKeySecret"
            name="razorpayKeySecret"
            type="password"
            autoComplete="off"
            placeholder={hasSavedSecret ? "•••••••••••••• (saved — leave blank to keep)" : "Enter key secret"}
            className="rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            {hasSavedSecret
              ? "A key secret is already saved. Leave this blank to keep it, or enter a new one to replace it."
              : "Never shown again after saving — only enter this once."}
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save Razorpay settings
        </button>
      </form>
    </div>
  );
}
