"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryItem = { id: string; url: string; type: "image" | "video" };

export function ProductGallery({
  images,
  videoUrl,
  alt,
}: {
  images: { id: string; url: string }[];
  videoUrl?: string | null;
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items: GalleryItem[] = [
    ...images.map((img) => ({ id: img.id, url: img.url, type: "image" as const })),
    ...(videoUrl ? [{ id: "video", url: videoUrl, type: "video" as const }] : []),
  ];

  if (items.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">No image</div>
      </div>
    );
  }

  const active = items[activeIndex] ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
      {items.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={item.type === "video" ? "Show video" : `Show image ${index + 1}`}
              className={`relative flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-zinc-900 sm:w-full ${
                index === activeIndex ? "border-amber-600" : "border-transparent hover:border-amber-300"
              }`}
            >
              {item.type === "video" ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <Image src={item.url} alt="" fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      <div
        className={`relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 ${items.length > 1 ? "order-1 sm:order-2" : ""}`}
      >
        {active.type === "video" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video key={active.id} src={active.url} controls className="h-full w-full bg-black object-contain" />
        ) : (
          <Image
            key={active.id}
            src={active.url}
            alt={alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-contain"
          />
        )}
      </div>
    </div>
  );
}
