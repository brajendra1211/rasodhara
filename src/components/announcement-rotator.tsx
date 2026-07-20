"use client";

import { useEffect, useState } from "react";

export function AnnouncementRotator({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="flex items-center justify-center gap-2 overflow-hidden">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path
          d="M20.5 12.5l-8 8a1.5 1.5 0 01-2.12 0l-6.88-6.88a1.5 1.5 0 010-2.12l8-8A1.5 1.5 0 0112.5 3H19a1.5 1.5 0 011.5 1.5v6.5a1.5 1.5 0 01-.44 1.06z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <span key={index} className="animate-announcement-fade whitespace-nowrap">
        {messages[index]}
      </span>
    </div>
  );
}
