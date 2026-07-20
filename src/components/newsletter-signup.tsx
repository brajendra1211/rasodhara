"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/settings";

const initialState: NewsletterState = {};

export function NewsletterSignup() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-semibold">Stay in the loop</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          New products, restocks and occasional offers — straight to your inbox. No spam.
        </p>

        {state?.success ? (
          <p className="rounded-md bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Thanks for subscribing!
          </p>
        ) : (
          <form action={action} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {pending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </section>
  );
}
