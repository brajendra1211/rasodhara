import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHeroSlide } from "@/lib/actions/settings";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  const updateWithId = updateHeroSlide.bind(null, slide.id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Hero Slides" />

      <h2 className="mb-6 text-xl font-semibold">Edit hero slide</h2>
      <HeroSlideForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          title: slide.title,
          subtitle: slide.subtitle,
          ctaLabel: slide.ctaLabel,
          ctaHref: slide.ctaHref,
          image: slide.image,
          badge: slide.badge ?? "",
          order: slide.order,
          active: slide.active,
        }}
      />
    </div>
  );
}
