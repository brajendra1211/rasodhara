"use client";

const ICON_OPTIONS = [
  { value: "leaf", label: "Leaf (natural / ingredients)" },
  { value: "sun", label: "Sun (sun-matured)" },
  { value: "home", label: "Home (homemade)" },
  { value: "flask", label: "Flask (lab tested)" },
  { value: "shield", label: "Shield (secure / safety)" },
  { value: "ban", label: "No-symbol (no chemicals/preservatives)" },
  { value: "badge", label: "Badge (quality tested)" },
  { value: "hand", label: "Hand (handcrafted)" },
  { value: "truck", label: "Truck (shipping)" },
  { value: "refresh", label: "Refresh (returns)" },
  { value: "chat", label: "Chat (support)" },
];

export type TrustBadgeFormDefaults = {
  label: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
};

const emptyDefaults: TrustBadgeFormDefaults = {
  label: "",
  description: "",
  icon: "leaf",
  order: 0,
  active: true,
};

export function TrustBadgeForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save badge",
}: {
  action: (formData: FormData) => void;
  defaults?: TrustBadgeFormDefaults;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="label" className="text-sm font-medium">
          Label
        </label>
        <input
          id="label"
          name="label"
          required
          defaultValue={defaults.label}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional — shown in the larger &quot;Why Shop With Us&quot; section on the home page)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={defaults.description}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="icon" className="text-sm font-medium">
          Icon
        </label>
        <select
          id="icon"
          name="icon"
          defaultValue={defaults.icon}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="order" className="text-sm font-medium">
            Order
          </label>
          <input
            id="order"
            name="order"
            type="number"
            defaultValue={defaults.order}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={defaults.active} />
          Active
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
