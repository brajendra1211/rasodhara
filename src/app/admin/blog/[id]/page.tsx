import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/lib/actions/settings";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const updateWithId = updateBlogPost.bind(null, post.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit blog post</h1>
      <BlogPostForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          body: post.body,
          coverImage: post.coverImage ?? "",
          published: post.published,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </div>
  );
}
