"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export type BlogPostFormDefaults = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
};

const emptyDefaults: BlogPostFormDefaults = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  published: true,
  metaTitle: "",
  metaDescription: "",
};

export function BlogPostForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save post",
}: {
  action: (formData: FormData) => void;
  defaults?: BlogPostFormDefaults;
  submitLabel?: string;
}) {
  const [preview, setPreview] = useState<string | null>(defaults.coverImage || null);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label htmlFor="slug" className="text-sm font-medium">
            Slug (optional, derived from title)
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
        <label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt (shown in the blog listing)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaults.excerpt}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Body</label>
        <RichTextEditor name="body" defaultValue={defaults.body} />
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex flex-col gap-1">
          <label htmlFor="coverImageFile" className="text-sm font-medium">
            Upload cover image
          </label>
          <input
            id="coverImageFile"
            name="coverImageFile"
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
          <label htmlFor="coverImage" className="text-sm font-medium">
            Or paste an image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={defaults.coverImage}
            onChange={(e) => setPreview(e.target.value || null)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="h-32 w-full rounded-md object-cover" />
        )}
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={defaults.published} />
        Published
      </label>

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">SEO (optional)</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="metaTitle" className="text-sm font-medium">
            Meta title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            placeholder={defaults.title || "Defaults to the post title"}
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
            placeholder="Defaults to the excerpt"
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
