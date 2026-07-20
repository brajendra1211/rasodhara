"use client";

import { useState } from "react";

export type CategoryFormDefaults = {
  name: string;
  slug: string;
  description: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
};

const emptyDefaults: CategoryFormDefaults = {
  name: "",
  slug: "",
  description: "",
  image: "",
  metaTitle: "",
  metaDescription: "",
};

export function CategoryForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save category",
}: {
  action: (formData: FormData) => void;
  defaults?: CategoryFormDefaults;
  submitLabel?: string;
}) {
  const [preview, setPreview] = useState<string | null>(defaults.image || null);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaults.name}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug (optional, derived from name)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={defaults.slug}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={defaults.description}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
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
          <p className="text-xs text-zinc-500">Uploaded images are automatically converted to WebP.</p>
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
          <img src={preview} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">SEO (optional)</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            Meta title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            placeholder={defaults.name || "Defaults to the category name"}
            defaultValue={defaults.metaTitle}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="metaDescription" className="text-sm font-medium">
            Meta description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows={2}
            defaultValue={defaults.metaDescription}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
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
