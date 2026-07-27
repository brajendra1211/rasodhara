import { createBlogPost } from "@/lib/actions/settings";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New blog post</h1>
      <BlogPostForm action={createBlogPost} submitLabel="Create post" />
    </div>
  );
}
