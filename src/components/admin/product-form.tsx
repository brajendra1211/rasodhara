"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type Category = { id: string; name: string };
type Badge = { id: string; label: string };

export type VariantDefaults = { label: string; price: number; mrp: number; stock: number };

export type ProductFormDefaults = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  categoryId: string;
  isBestSeller: boolean;
  isJainFriendly: boolean;
  tasteProfile: string;
  oilType: string;
  weightGrams: number | null;
  ingredients: string;
  shelfLife: string;
  metaTitle: string;
  metaDescription: string;
  images: string[];
  videoUrl: string;
  badgeIds: string[];
  variants: VariantDefaults[];
};

const emptyDefaults: ProductFormDefaults = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: 0,
  mrp: 0,
  stock: 0,
  categoryId: "",
  isBestSeller: false,
  isJainFriendly: false,
  tasteProfile: "",
  oilType: "",
  weightGrams: null,
  ingredients: "",
  shelfLife: "",
  metaTitle: "",
  metaDescription: "",
  images: [],
  videoUrl: "",
  badgeIds: [],
  variants: [],
};

export function ProductForm({
  action,
  categories,
  badges,
  defaults = emptyDefaults,
  submitLabel = "Save product",
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  badges: Badge[];
  defaults?: ProductFormDefaults;
  submitLabel?: string;
}) {
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantDefaults[]>(defaults.variants);
  const [videoPreview, setVideoPreview] = useState<string | null>(defaults.videoUrl || null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(defaults.badgeIds);

  function toggleBadge(id: string) {
    setSelectedBadgeIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }

  function updateVariant(index: number, field: keyof VariantDefaults, value: string) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: field === "label" ? value : Number(value) } : v
      )
    );
  }

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
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
        <label htmlFor="shortDescription" className="text-sm font-medium">
          Short description
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={2}
          placeholder="A one or two line summary shown in listings and search results"
          defaultValue={defaults.shortDescription}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Long description</label>
        <RichTextEditor name="description" defaultValue={defaults.description} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-sm font-medium">
            Price (INR)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={defaults.price / 100}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mrp" className="text-sm font-medium">
            MRP (INR)
          </label>
          <input
            id="mrp"
            name="mrp"
            type="number"
            step="0.01"
            required
            defaultValue={defaults.mrp / 100}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            required
            defaultValue={defaults.stock}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="weightGrams" className="text-sm font-medium">
            Weight (g)
          </label>
          <input
            id="weightGrams"
            name="weightGrams"
            type="number"
            defaultValue={defaults.weightGrams ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaults.categoryId}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="oilType" className="text-sm font-medium">
            Oil type (optional)
          </label>
          <input
            id="oilType"
            name="oilType"
            defaultValue={defaults.oilType}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tasteProfile" className="text-sm font-medium">
            Taste profile (optional)
          </label>
          <input
            id="tasteProfile"
            name="tasteProfile"
            defaultValue={defaults.tasteProfile}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="ingredients" className="text-sm font-medium">
            Ingredients (comma separated, optional)
          </label>
          <input
            id="ingredients"
            name="ingredients"
            placeholder="e.g. Raw mango, Mustard oil, Fennel seeds"
            defaultValue={defaults.ingredients}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="shelfLife" className="text-sm font-medium">
            Shelf life (optional)
          </label>
          <input
            id="shelfLife"
            name="shelfLife"
            placeholder="e.g. 12 months from date of packaging"
            defaultValue={defaults.shelfLife}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isBestSeller" defaultChecked={defaults.isBestSeller} />
          Best seller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isJainFriendly" defaultChecked={defaults.isJainFriendly} />
          Jain friendly
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Size / pack variants (optional)
          </h3>
          <button
            type="button"
            onClick={() => setVariants((prev) => [...prev, { label: "", price: 0, mrp: 0, stock: 0 }])}
            className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            + Add variant
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Leave empty to sell at the single price above. Add rows to offer multiple sizes (e.g. 325g Jar, 1kg Jar) each
          with its own price and stock.
        </p>

        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:items-end">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-medium">Label</label>
              <input
                name="variantLabel"
                required
                value={variant.label}
                onChange={(e) => updateVariant(index, "label", e.target.value)}
                placeholder="325g Jar"
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Price (INR)</label>
              <input
                name="variantPrice"
                type="number"
                step="0.01"
                required
                value={variant.price || ""}
                onChange={(e) => updateVariant(index, "price", e.target.value)}
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">MRP (INR)</label>
              <input
                name="variantMrp"
                type="number"
                step="0.01"
                required
                value={variant.mrp || ""}
                onChange={(e) => updateVariant(index, "mrp", e.target.value)}
                className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex items-end gap-1">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium">Stock</label>
                <input
                  name="variantStock"
                  type="number"
                  required
                  value={variant.stock || ""}
                  onChange={(e) => updateVariant(index, "stock", e.target.value)}
                  className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, i) => i !== index))}
                className="mb-1.5 text-red-600 hover:underline"
                aria-label="Remove variant"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex flex-col gap-1">
          <label htmlFor="imageFiles" className="text-sm font-medium">
            Upload images
          </label>
          <input
            id="imageFiles"
            name="imageFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setNewPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
          />
          <p className="text-xs text-zinc-500">You can select multiple images. Each is automatically converted to WebP.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="images" className="text-sm font-medium">
            Or paste image URLs (one per line)
          </label>
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={defaults.images.join("\n")}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        {(defaults.images.length > 0 || newPreviews.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {defaults.images.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-16 w-16 rounded-md object-cover" />
            ))}
            {newPreviews.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-16 w-16 rounded-md object-cover ring-2 ring-amber-500" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex flex-col gap-1">
          <label htmlFor="videoFile" className="text-sm font-medium">
            Product video (optional)
          </label>
          <input
            id="videoFile"
            name="videoFile"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVideoPreview(URL.createObjectURL(file));
                setRemoveVideo(false);
              }
            }}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
          />
          <p className="text-xs text-zinc-500">MP4, WebM, or MOV — up to 10MB.</p>
        </div>

        <input type="hidden" name="existingVideoUrl" value={removeVideo ? "" : defaults.videoUrl} />

        {videoPreview && !removeVideo && (
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={videoPreview} controls className="h-40 w-full max-w-xs rounded-md bg-black object-contain" />
            <label className="flex w-fit items-center gap-2 text-sm text-red-600">
              <input
                type="checkbox"
                name="removeVideo"
                checked={removeVideo}
                onChange={(e) => {
                  setRemoveVideo(e.target.checked);
                  if (e.target.checked) setVideoPreview(null);
                }}
              />
              Remove video
            </label>
          </div>
        )}
      </div>

      {badges.length > 0 && (
        <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-medium">Highlights shown on this product (optional)</h3>
            <p className="text-xs text-zinc-500">
              Choose which trust badges from{" "}
              <a href="/admin/settings/badges" className="text-amber-700 hover:underline dark:text-amber-400">
                Settings &rarr; Badges
              </a>{" "}
              appear on this product&apos;s page.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {badges.map((badge) => (
              <label key={badge.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="badgeIds"
                  value={badge.id}
                  checked={selectedBadgeIds.includes(badge.id)}
                  onChange={() => toggleBadge(badge.id)}
                />
                {badge.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">SEO (optional)</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            Meta title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            placeholder={defaults.name || "Defaults to the product name"}
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
            placeholder="Defaults to the first 160 characters of the description"
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
