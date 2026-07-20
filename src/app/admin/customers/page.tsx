import Link from "next/link";
import NextForm from "next/form";
import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/lib/actions/users";
import { auth } from "@/lib/auth";

const PAGE_SIZE = 20;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const session = await auth();

  const where = q
    ? {
        OR: [{ name: { contains: q } }, { email: { contains: q } }],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(targetPage));
    return `/admin/customers?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers ({totalCount})</h1>
      </div>

      <NextForm action="/admin/customers" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-sm font-medium">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Name or email"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Search
        </button>
        {q && (
          <Link href="/admin/customers" className="text-sm text-zinc-500 hover:underline">
            Clear
          </Link>
        )}
      </NextForm>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Orders</th>
              <th className="py-2 pr-4">Joined</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((user) => {
              const isSelf = user.id === session?.user?.id;
              const nextRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
              return (
                <tr key={user.id}>
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4 text-zinc-500">{user.email}</td>
                  <td className="py-3 pr-4">{user._count.orders}</td>
                  <td className="py-3 pr-4 text-zinc-500">{user.createdAt.toLocaleDateString("en-IN")}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {isSelf ? (
                      <span className="text-xs text-zinc-400">You</span>
                    ) : (
                      <form action={updateUserRole.bind(null, user.id, nextRole)}>
                        <button type="submit" className="text-amber-700 hover:underline dark:text-amber-400">
                          {user.role === "ADMIN" ? "Demote to customer" : "Promote to admin"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="py-6 text-sm text-zinc-500">{q ? "No customers match your search." : "No customers yet."}</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href={pageHref(page - 1)}
            aria-disabled={page <= 1}
            className={`rounded-full border border-zinc-300 px-4 py-1.5 dark:border-zinc-700 ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            Previous
          </Link>
          <span className="text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(page + 1)}
            aria-disabled={page >= totalPages}
            className={`rounded-full border border-zinc-300 px-4 py-1.5 dark:border-zinc-700 ${
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
