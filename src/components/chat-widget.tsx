"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { formatINR } from "@/lib/format";

type ProductCard = {
  name: string;
  slug: string;
  url: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string | null;
};

type Message = {
  id: string;
  role: "USER" | "ASSISTANT" | "ADMIN";
  content: string;
  products?: ProductCard[];
};

const QUICK_REPLIES = ["Track my order", "Search products", "Shipping & returns"];
const POLL_MS = 5000;
const GUEST_ID_KEY = "chatGuestId";
const CONVERSATION_ID_KEY = "chatConversationId";

function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function ChatWidget({ siteName, enabled }: { siteName: string; enabled: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "ASSISTANT",
      content: `Hi! I'm ${siteName}'s assistant. I can help you find products, check an order's status, or answer shipping/return questions. What do you need?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);
  const guestIdRef = useRef<string>("");
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    guestIdRef.current = getOrCreateGuestId();
    const storedConversationId = window.localStorage.getItem(CONVERSATION_ID_KEY);
    if (storedConversationId) {
      conversationIdRef.current = storedConversationId;
      refresh({ reset: true });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  if (!enabled || pathname.startsWith("/admin")) return null;

  async function refresh(options?: { attachProducts?: ProductCard[]; reset?: boolean }) {
    const conversationId = conversationIdRef.current;
    if (!conversationId) return;

    const params = new URLSearchParams({ conversationId, guestId: guestIdRef.current });
    if (!options?.reset && lastMessageIdRef.current) params.set("afterId", lastMessageIdRef.current);

    try {
      const res = await fetch(`/api/chat?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      const newMessages: { id: string; role: Message["role"]; content: string }[] = data.messages ?? [];

      if (newMessages.length > 0 || options?.reset) {
        setMessages((prev) => [
          ...(options?.reset ? [] : prev),
          ...newMessages.map((m, idx) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            products:
              options?.attachProducts && m.role === "ASSISTANT" && idx === newMessages.length - 1
                ? options.attachProducts
                : undefined,
          })),
        ]);
      }
      if (newMessages.length > 0) {
        lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
      }
    } catch {
      // Silent — polling failures shouldn't interrupt the chat.
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationId: conversationIdRef.current,
          guestId: guestIdRef.current,
        }),
      });
      const data = await res.json();

      if (data.conversationId && data.conversationId !== conversationIdRef.current) {
        conversationIdRef.current = data.conversationId;
        window.localStorage.setItem(CONVERSATION_ID_KEY, data.conversationId);
      }

      await refresh({
        attachProducts: Array.isArray(data.products) && data.products.length > 0 ? data.products : undefined,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: "ASSISTANT", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with us"
          className="fixed bottom-36 right-4 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl sm:bottom-24 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 bg-amber-700 px-4 py-3 text-white dark:border-zinc-800">
            <span className="text-sm font-semibold">{siteName} Support</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col gap-1 ${m.role === "USER" ? "items-end" : "items-start"}`}>
                {m.role === "ADMIN" && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Support team
                  </span>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.role === "USER"
                      ? "bg-amber-600 text-white"
                      : m.role === "ADMIN"
                        ? "bg-olive-100 text-olive-900 dark:bg-olive-900 dark:text-olive-50"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {m.content}
                </div>

                {m.products && (
                  <div className="flex w-full flex-col gap-2">
                    {m.products.map((p) => (
                      <a
                        key={p.slug}
                        href={p.url}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-amber-950"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                          <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
                            {p.name}
                          </span>
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                            {formatINR(p.price)}
                          </span>
                          {!p.inStock && <span className="text-[10px] text-red-600">Out of stock</span>}
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 shrink-0 text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {pending && (
              <div className="self-start rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                Typing…
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
              {QUICK_REPLIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => send(label)}
                  className="rounded-full border border-amber-300 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-zinc-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 sm:bottom-6"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}
