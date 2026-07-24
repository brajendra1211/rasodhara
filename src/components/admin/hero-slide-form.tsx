"use client";

import { useState } from "react";

export type HeroSlideFormDefaults = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  badge: string;
  order: number;
  active: boolean;
};

const emptyDefaults: HeroSlideFormDefaults = {
  title: "",
  subtitle: "",
  ctaLabel: "Shop now",
  ctaHref: "/shop",
  image: "",
  badge: "",
  order: 0,
  active: true,
};

export function HeroSlideForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save slide",
}: {
  action: (formData: FormData) => void;
  defaults?: HeroSlideFormDefaults;
  submitLabel?: string;
}) {
  const [preview, setPreview] = useState<string | null>(defaults.image || null);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaults.title}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subtitle" className="text-sm font-medium">
          Subtitle
        </label>
        <textarea
          id="subtitle"
          name="subtitle"
          required
          rows={2}
          defaultValue={defaults.subtitle}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="ctaLabel" className="text-sm font-medium">
            Button label
          </label>
          <input
            id="ctaLabel"
            name="ctaLabel"
            required
            defaultValue={defaults.ctaLabel}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ctaHref" className="text-sm font-medium">
            Button link
          </label>
          <input
            id="ctaHref"
            name="ctaHref"
            required
            defaultValue={defaults.ctaHref}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex flex-col gap-1">
          <label htmlFor="imageFile" className="text-sm font-medium">
            Upload image
          </label>
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
          />
          <p className="text-xs text-zinc-500">
            Uploaded images are automatically converted to WebP. For best results on desktop, use a wide landscape
            image (around 2100x900px, ~21:9 ratio) — narrower or taller photos will get cropped.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="image" className="text-sm font-medium">
            Or paste an image URL
          </label>
          <input
            id="image"
            name="image"
            defaultValue={defaults.image}
            onChange={(e) => setPreview(e.target.value || null)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="h-32 w-full rounded-md object-cover" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="badge" className="text-sm font-medium">
            Badge (optional)
          </label>
          <input
            id="badge"
            name="badge"
            defaultValue={defaults.badge}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
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
