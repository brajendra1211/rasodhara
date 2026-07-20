import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export async function OurStorySection() {
  const settings = await getSiteSettings();

  if (!settings.storyTitle || !settings.storyExcerpt) return null;

  return (
    <section className="border-b border-zinc-200 bg-amber-50 dark:border-zinc-800 dark:bg-amber-950/10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        {settings.storyImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image src={settings.storyImage} alt={settings.storyTitle} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
        <div className={settings.storyImage ? "" : "md:col-span-2"}>
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">{settings.storyTitle}</h2>
          <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">{settings.storyExcerpt}</p>
          <Link
            href="/our-story"
            className="mt-4 inline-block rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
          >
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
