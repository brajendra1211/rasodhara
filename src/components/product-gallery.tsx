"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  alt,
}: {
  images: { id: string; url: string }[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">No image</div>
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 sm:w-full ${
                index === activeIndex
                  ? "border-amber-600"
                  : "border-transparent hover:border-amber-300"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className={`relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 ${images.length > 1 ? "order-1 sm:order-2" : ""}`}>
        <Image
          key={active.id}
          src={active.url}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
