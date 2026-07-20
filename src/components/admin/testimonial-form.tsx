"use client";

export type TestimonialFormDefaults = {
  authorName: string;
  quote: string;
  rating: number;
  productName: string;
  order: number;
  active: boolean;
};

const emptyDefaults: TestimonialFormDefaults = {
  authorName: "",
  quote: "",
  rating: 5,
  productName: "",
  order: 0,
  active: true,
};

export function TestimonialForm({
  action,
  defaults = emptyDefaults,
  submitLabel = "Save testimonial",
}: {
  action: (formData: FormData) => void;
  defaults?: TestimonialFormDefaults;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="authorName" className="text-sm font-medium">
          Customer name
        </label>
        <input
          id="authorName"
          name="authorName"
          required
          defaultValue={defaults.authorName}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="quote" className="text-sm font-medium">
          What they said
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={3}
          placeholder="Paste the actual review or feedback you received (WhatsApp, Google, etc.)"
          defaultValue={defaults.quote}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="rating" className="text-sm font-medium">
            Rating (1-5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            required
            defaultValue={defaults.rating}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="productName" className="text-sm font-medium">
            Product mentioned (optional)
          </label>
          <input
            id="productName"
            name="productName"
            defaultValue={defaults.productName}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
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
