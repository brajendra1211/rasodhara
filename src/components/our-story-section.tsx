import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export async function OurStorySection() {
  const settings = await getSiteSettings();

  if (!settings.storyTitle || !settings.storyExcerpt) return null;

  return (
    <section className="border-b border-amber-100 bg-amber-50/60 dark:border-zinc-800 dark:bg-amber-950/10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
        {settings.storyVideo ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={settings.storyVideo}
              poster={settings.storyImage ?? undefined}
              controls
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          settings.storyImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image src={settings.storyImage} alt={settings.storyTitle} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          )
        )}
        <div className={settings.storyImage || settings.storyVideo ? "" : "md:col-span-2"}>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Our Story
          </span>
          <h2 className="mb-4 mt-1 text-2xl font-bold text-[#3f2d20] sm:text-3xl dark:text-zinc-50">
            {settings.storyTitle}
          </h2>
          <p className="whitespace-pre-line text-[#5c4a3a] dark:text-zinc-300">{settings.storyExcerpt}</p>
          <Link
            href="/our-story"
            className="mt-5 inline-block rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
