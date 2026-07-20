"use client";

import { useState } from "react";

export type CouponFormDefaults = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  minOrderAmount: string;
  maxUses: string;
  expiresAt: string;
  active: boolean;
};

const emptyDefaults: CouponFormDefaults = {
  code: "",
  type: "PERCENT",
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

export function CouponForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save coupon",
}: {
  action: (formData: FormData) => void;
  defaults?: CouponFormDefaults;
  submitLabel?: string;
}) {
  const [type, setType] = useState<"PERCENT" | "FIXED">(defaults.type);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="text-sm font-medium">
            Coupon code
          </label>
          <input
            id="code"
            name="code"
            required
            defaultValue={defaults.code}
            placeholder="e.g. WELCOME10"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium">
            Discount type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as "PERCENT" | "FIXED")}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="PERCENT">Percentage off</option>
            <option value="FIXED">Fixed amount off</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="value" className="text-sm font-medium">
          {type === "PERCENT" ? "Percentage off (e.g. 10 for 10%)" : "Amount off (in ₹)"}
        </label>
        <input
          id="value"
          name="value"
          type="number"
          min={0}
          step={type === "PERCENT" ? 1 : undefined}
          required
          defaultValue={defaults.value}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {type === "FIXED" && (
          <p className="text-xs text-zinc-500">Note: this is stored as paise internally; enter the rupee amount and it will be converted automatically at checkout.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="minOrderAmount" className="text-sm font-medium">
            Minimum order amount (₹, optional)
          </label>
          <input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            min={0}
            defaultValue={defaults.minOrderAmount}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="maxUses" className="text-sm font-medium">
            Maximum uses (optional)
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min={1}
            defaultValue={defaults.maxUses}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="expiresAt" className="text-sm font-medium">
          Expiry date (optional)
        </label>
        <input
          id="expiresAt"
          name="expiresAt"
          type="date"
          defaultValue={defaults.expiresAt}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="active" defaultChecked={defaults.active} />
        Active
      </label>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
