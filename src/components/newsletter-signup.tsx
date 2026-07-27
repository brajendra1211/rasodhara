"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/settings";

const initialState: NewsletterState = {};

export function NewsletterSignup() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="border-t border-amber-100 bg-olive-500 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Bring Traditional Flavors to Your Inbox</h2>
        <p className="text-sm text-amber-50/90">
          Get recipes, festive offers, and new product launches.
        </p>

        {state?.success ? (
          <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-olive-600">
            Thanks for subscribing!
          </p>
        ) : (
          <form action={action} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-full border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-[#3f2d20] hover:bg-amber-400 disabled:opacity-60"
            >
              {pending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        {state?.error && <p className="text-sm text-red-200">{state.error}</p>}
      </div>
    </section>
  );
}
