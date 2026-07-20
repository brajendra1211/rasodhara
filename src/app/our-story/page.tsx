import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.storyTitle ?? "Our Story",
  };
}

export default async function OurStoryPage() {
  const settings = await getSiteSettings();

  if (!settings.storyTitle && !settings.whyUsTitle) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      {settings.storyTitle && settings.storyBody && (
        <section className="mb-16">
          {settings.storyImage && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image src={settings.storyImage} alt={settings.storyTitle} fill sizes="100vw" className="object-cover" priority />
            </div>
          )}
          <h1 className="mb-6 text-3xl font-semibold">{settings.storyTitle}</h1>
          <div
            className="prose prose-sm max-w-none text-zinc-700 dark:prose-invert dark:text-zinc-300 sm:prose-base"
            dangerouslySetInnerHTML={{ __html: settings.storyBody }}
          />
        </section>
      )}

      {settings.whyUsTitle && settings.whyUsBody && (
        <section className="mb-12 border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <h2 className="mb-6 text-2xl font-semibold">{settings.whyUsTitle}</h2>
          <div
            className="prose prose-sm max-w-none text-zinc-700 dark:prose-invert dark:text-zinc-300 sm:prose-base"
            dangerouslySetInnerHTML={{ __html: settings.whyUsBody }}
          />
        </section>
      )}

      {settings.storyCtaLabel && settings.storyCtaHref && (
        <Link
          href={settings.storyCtaHref}
          className="inline-block rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          {settings.storyCtaLabel}
        </Link>
      )}
    </div>
  );
}
