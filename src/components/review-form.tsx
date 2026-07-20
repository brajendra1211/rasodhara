"use client";

import { useState } from "react";
import { submitReview, deleteReview } from "@/lib/actions/reviews";

export function ReviewForm({
  productId,
  slug,
  initialRating,
  initialComment,
}: {
  productId: string;
  slug: string;
  initialRating?: number;
  initialComment?: string | null;
}) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const isEditing = Boolean(initialRating);

  const action = submitReview.bind(null, productId, slug);
  const removeAction = deleteReview.bind(null, productId, slug);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm font-medium">{isEditing ? "Update your review" : "Write a review"}</p>

      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="text-2xl leading-none"
          >
            <span className={(hoverRating || rating) >= star ? "text-amber-500" : "text-zinc-300 dark:text-zinc-700"}>
              &#9733;
            </span>
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        defaultValue={initialComment ?? ""}
        placeholder="Share your experience with this product (optional)"
        rows={3}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={rating === 0}
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEditing ? "Update review" : "Submit review"}
        </button>
        {isEditing && (
          <form action={removeAction}>
            <button type="submit" className="text-sm text-red-600 hover:underline">
              Delete review
            </button>
          </form>
        )}
      </div>
    </form>
  );
}
