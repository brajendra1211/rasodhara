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

  return (
    <section
      className="relative overflow-hidden border-b border-amber-100 dark:border-zinc-800"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[21/9] sm:max-h-[560px]">
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
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="scale-110 object-cover blur-2xl brightness-75"
            />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-contain"
            />
          </div>
        ))}

        {active.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white sm:hidden">
            {active.badge}
          </span>
        )}

        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/55 via-black/10 to-transparent sm:block" />

        <div className="absolute inset-0 hidden flex-col justify-center gap-4 px-16 sm:flex">
          <div className="flex max-w-lg flex-col items-start gap-4">
            {active.badge && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                {active.badge}
              </span>
            )}
            <h1 className="text-5xl leading-tight font-bold text-white drop-shadow-sm">{active.title}</h1>
            <p className="max-w-md text-base text-zinc-100 drop-shadow-sm">{active.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={active.ctaHref}
                className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                {active.ctaLabel}
              </Link>
              <Link
                href="/our-story"
                className="rounded-full border-2 border-white px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#3f2d20]"
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
                      i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 hover:bg-white sm:left-5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 hover:bg-white sm:right-5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-start gap-4 bg-[#3f2d20] px-6 py-6 text-white sm:hidden">
        <h1 className="text-2xl leading-tight font-bold">{active.title}</h1>
        <p className="text-sm text-zinc-200">{active.subtitle}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={active.ctaHref}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            {active.ctaLabel}
          </Link>
          <Link
            href="/our-story"
            className="rounded-full border-2 border-white px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#3f2d20]"
          >
            Explore Our Story
          </Link>
        </div>

        {slides.length > 1 && (
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-amber-500" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-amber-100 bg-cream py-3 dark:border-zinc-800 dark:bg-black">
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
