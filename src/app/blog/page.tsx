import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading title="From the Blog" />

      {posts.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <h2 className="text-base font-semibold text-[#3f2d20] group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                {post.title}
              </h2>
              {post.excerpt && <p className="line-clamp-2 text-sm text-[#5c4a3a] dark:text-zinc-400">{post.excerpt}</p>}
              <span className="text-xs text-zinc-500">{post.createdAt.toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
