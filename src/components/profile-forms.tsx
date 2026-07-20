"use client";

import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  updateProfile,
  changePassword,
  type UpdateProfileState,
  type ChangePasswordState,
} from "@/lib/actions/users";

const profileInitialState: UpdateProfileState = {};
const passwordInitialState: ChangePasswordState = {};

export function ProfileForms({ name, email, phone }: { name: string; email: string; phone: string }) {
  const { update } = useSession();
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, profileInitialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, passwordInitialState);

  useEffect(() => {
    if (profileState?.success && profileState.name) {
      update({ name: profileState.name });
    }
  }, [profileState, update]);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Profile details</h2>
        <form action={profileAction} className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={name}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              value={email}
              disabled
              className="rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="text-xs text-zinc-500">Contact support if you need to change your login email.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={phone}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          {profileState?.error && <p className="text-sm text-red-600">{profileState.error}</p>}
          {profileState?.success && <p className="text-sm text-green-700 dark:text-green-400">Profile updated.</p>}

          <button
            type="submit"
            disabled={profilePending}
            className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {profilePending ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Change password</h2>
        <form action={passwordAction} className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          {passwordState?.error && <p className="text-sm text-red-600">{passwordState.error}</p>}
          {passwordState?.success && (
            <p className="text-sm text-green-700 dark:text-green-400">Password updated.</p>
          )}

          <button
            type="submit"
            disabled={passwordPending}
            className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {passwordPending ? "Saving..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
