import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/account-nav";
import { createAddress, deleteAddress, setDefaultAddress } from "@/lib/actions/addresses";

export const metadata: Metadata = {
  title: "Your Addresses",
  robots: { index: false, follow: false },
};

export default async function AccountAddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/addresses");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your account</h1>
      <AccountNav active="Addresses" />

      {addresses.length > 0 && (
        <ul className="mb-8 flex flex-col gap-3">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800"
            >
              <div>
                <div className="flex items-center gap-2 font-medium">
                  {addr.label || "Address"}
                  {addr.isDefault && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-zinc-500">{addr.name} &middot; {addr.phone}</p>
                <p className="whitespace-pre-line text-zinc-500">{addr.address}</p>
                <p className="text-zinc-500">
                  {addr.city}, {addr.state} &ndash; {addr.pincode}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {!addr.isDefault && (
                  <form action={setDefaultAddress.bind(null, addr.id)}>
                    <button type="submit" className="text-xs font-medium text-amber-700 hover:underline dark:text-amber-400">
                      Set as default
                    </button>
                  </form>
                )}
                <form action={deleteAddress.bind(null, addr.id)}>
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-4 text-lg font-semibold">Add a new address</h2>
      <form action={createAddress} className="flex max-w-md flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="label" className="text-sm font-medium">
            Label (optional)
          </label>
          <input
            id="label"
            name="label"
            placeholder="e.g. Home, Office"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">
            Delivery address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            placeholder="House no., street, locality"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <input
              id="state"
              name="state"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pincode" className="text-sm font-medium">
            Pincode
          </label>
          <input
            id="pincode"
            name="pincode"
            required
            pattern="[0-9]{6}"
            title="6-digit pincode"
            className="max-w-[10rem] rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isDefault" />
          Set as default address
        </label>
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Save address
        </button>
      </form>
    </div>
  );
}
