import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "@/lib/actions/settings";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="py-3 pr-4 font-medium">{post.title}</td>
                <td className="py-3 pr-4 text-zinc-500">{post.published ? "Published" : "Draft"}</td>
                <td className="py-3 pr-4 text-zinc-500">{post.createdAt.toLocaleDateString()}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/blog/${post.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                      Edit
                    </Link>
                    <form action={deleteBlogPost.bind(null, post.id)}>
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
        {posts.length === 0 && <p className="py-6 text-sm text-zinc-500">No blog posts yet.</p>}
      </div>
    </div>
  );
}
