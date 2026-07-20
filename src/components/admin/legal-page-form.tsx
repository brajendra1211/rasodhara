"use client";

import { RichTextEditor } from "@/components/admin/rich-text-editor";

export type LegalPageFormDefaults = {
  title: string;
  slug: string;
  body: string;
};

const emptyDefaults: LegalPageFormDefaults = { title: "", slug: "", body: "" };

export function LegalPageForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save page",
}: {
  action: (formData: FormData) => void;
  defaults?: LegalPageFormDefaults;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
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
            placeholder="e.g. Terms of Service"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="slug" className="text-sm font-medium">
            URL slug (optional, derived from title)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={defaults.slug}
            placeholder="e.g. terms"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Page content</label>
        <RichTextEditor name="body" defaultValue={defaults.body} />
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
