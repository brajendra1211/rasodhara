import { createTestimonial } from "@/lib/actions/settings";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Testimonials" />

      <h2 className="mb-6 text-xl font-semibold">New testimonial</h2>
      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}
