"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type HeroSlide = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  badge?: string;
};

const AUTOPLAY_MS = 4500;

const TRUST_ROW = ["NABL Lab Tested", "No Artificial Preservatives", "100% Homemade"];

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index];

  const imageStack = (
    <>
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="(min-width: 640px) 58vw, 100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
    </>
  );

  return (
    <section
      className="relative overflow-hidden border-b border-amber-100 bg-cream dark:border-zinc-800"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] sm:block">
        {imageStack}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent dark:from-black" />
      </div>

      {slides.length > 1 && (
        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-800 hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-800 hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20">
        <div className="flex max-w-lg flex-col items-start gap-5">
          {active.badge && (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              {active.badge}
            </span>
          )}
          <h1 className="text-3xl leading-tight font-bold text-[#3f2d20] sm:text-5xl dark:text-zinc-50">
            {active.title}
          </h1>
          <p className="max-w-md text-sm text-[#5c4a3a] sm:text-base dark:text-zinc-400">{active.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={active.ctaHref}
              className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              {active.ctaLabel}
            </Link>
            <Link
              href="/our-story"
              className="rounded-full border-2 border-olive-500 px-6 py-2.5 text-sm font-semibold text-olive-500 transition-colors hover:bg-olive-500 hover:text-white"
            >
              Explore Our Story
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="flex gap-2 pt-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-amber-600" : "w-2 bg-amber-200 hover:bg-amber-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-xl sm:hidden">{imageStack}</div>
      </div>

      <div className="border-t border-amber-100 py-3 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-medium text-[#5c4a3a] sm:text-sm dark:text-zinc-400">
          {TRUST_ROW.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-olive-500" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
