import { getSiteSettings } from "@/lib/settings";
import { updateChatbotSettings } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminChatbotSettingsPage() {
  const settings = await getSiteSettings();
  const hasSavedKey = Boolean(settings.chatbotApiKey);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Chatbot" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        A chat widget appears on the website that can search products, check order status, and answer shipping
        questions. Without an API key it uses simple built-in replies; add a Claude API key below to enable
        AI-powered replies instead. The key is encrypted before it&apos;s stored.
      </p>

      <form action={updateChatbotSettings} className="flex max-w-xl flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="chatbotEnabled" defaultChecked={settings.chatbotEnabled} />
          Enable the chat widget
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="chatbotApiKey" className="text-sm font-medium">
            Claude API key (optional — for AI-powered replies)
          </label>
          <input
            id="chatbotApiKey"
            name="chatbotApiKey"
            type="password"
            autoComplete="off"
            placeholder={hasSavedKey ? "•••••••••••••• (saved — leave blank to keep)" : "sk-ant-..."}
            className="rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            {hasSavedKey
              ? "A key is already saved. Leave this blank to keep it, or enter a new one to replace it."
              : "Leave blank to use simple built-in replies only (product search, order status, shipping/return FAQs) without AI."}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="chatbotInstructions" className="text-sm font-medium">
            Extra instructions for the AI assistant (optional)
          </label>
          <textarea
            id="chatbotInstructions"
            name="chatbotInstructions"
            rows={4}
            defaultValue={settings.chatbotInstructions ?? ""}
            placeholder="e.g. We don't accept returns on opened jars. Delivery usually takes 3-5 days."
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">Only used when a Claude API key is set above.</p>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save chatbot settings
        </button>
      </form>
    </div>
  );
}
