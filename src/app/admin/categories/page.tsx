import Link from "next/link";
import NextForm from "next/form";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/lib/actions/categories";

const PAGE_SIZE = 20;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { name: { contains: q } } : {};

  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(targetPage));
    return `/admin/categories?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories ({totalCount})</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New category
        </Link>
      </div>

      <NextForm action="/admin/categories" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-sm font-medium">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Category name"
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
          <Link href="/admin/categories" className="text-sm text-zinc-500 hover:underline">
            Clear
          </Link>
        )}
      </NextForm>

      <table className="w-full max-w-xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Products</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="py-3 pr-4 font-medium">{category.name}</td>
              <td className="py-3 pr-4 text-zinc-500">{category._count.products}</td>
              <td className="py-3 pr-4">
                <div className="flex gap-3">
                  <Link href={`/admin/categories/${category.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                    Edit
                  </Link>
                  <form action={deleteCategory.bind(null, category.id)}>
                    <button type="submit" className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categories.length === 0 && (
        <p className="py-6 text-sm text-zinc-500">{q ? "No categories match your search." : "No categories yet."}</p>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex max-w-xl items-center justify-between text-sm">
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
