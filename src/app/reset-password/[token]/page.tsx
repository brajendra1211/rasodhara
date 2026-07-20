"use client";

import { useActionState, use } from "react";
import Link from "next/link";
import { resetPassword, type ResetPasswordState } from "@/lib/actions/auth";

const initialState: ResetPasswordState = {};

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const action = resetPassword.bind(null, token);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Set a new password</h1>

      {state?.success ? (
        <>
          <p className="mb-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Your password has been reset. You can log in now.
          </p>
          <Link
            href="/login"
            className="w-fit rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
          >
            Go to login
          </Link>
        </>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Reset password"}
          </button>
        </form>
      )}
    </div>
  );
}
