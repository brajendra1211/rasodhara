import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTestimonial } from "@/lib/actions/settings";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const updateWithId = updateTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Testimonials" />

      <h2 className="mb-6 text-xl font-semibold">Edit testimonial</h2>
      <TestimonialForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          authorName: testimonial.authorName,
          quote: testimonial.quote,
          rating: testimonial.rating,
          productName: testimonial.productName ?? "",
          order: testimonial.order,
          active: testimonial.active,
        }}
      />
    </div>
  );
}
