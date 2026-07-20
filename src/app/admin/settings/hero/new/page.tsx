import { createHeroSlide } from "@/lib/actions/settings";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default function NewHeroSlidePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Hero Slides" />

      <h2 className="mb-6 text-xl font-semibold">New hero slide</h2>
      <HeroSlideForm action={createHeroSlide} submitLabel="Create slide" />
    </div>
  );
}
