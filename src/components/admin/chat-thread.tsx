"use client";

import { useEffect, useRef, useState } from "react";
import { sendAdminChatReply, setChatBotPaused } from "@/lib/actions/chat";

type Msg = { id: string; role: "USER" | "ASSISTANT" | "ADMIN"; content: string; createdAt: string };

export function AdminChatThread({
  conversationId,
  initialMessages,
  initialBotPaused,
}: {
  conversationId: string;
  initialMessages: Msg[];
  initialBotPaused: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [botPaused, setBotPaused] = useState(initialBotPaused);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function refresh() {
    const res = await fetch(`/api/admin/chat/${conversationId}/messages`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages);
    setBotPaused(data.botPaused);
  }

  useEffect(() => {
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setPending(true);
    const formData = new FormData();
    formData.set("content", trimmed);
    await sendAdminChatReply(conversationId, formData);
    setText("");
    await refresh();
    setPending(false);
  }

  async function toggleBot() {
    const next = !botPaused;
    setBotPaused(next);
    await setChatBotPaused(conversationId, next);
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={toggleBot}
        className={`w-fit rounded-full px-4 py-1.5 text-xs font-medium ${
          botPaused
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
            : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        }`}
      >
        {botPaused ? "Bot paused — click to resume auto-replies" : "Pause bot (take over manually)"}
      </button>

      <div
        ref={listRef}
        className="flex max-h-[55vh] min-h-[200px] flex-col gap-3 overflow-y-auto rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
      >
        {messages.length === 0 && <p className="text-sm text-zinc-500">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-1 ${m.role === "USER" ? "items-start" : "items-end"}`}>
            <span className="text-[10px] uppercase tracking-wide text-zinc-400">
              {m.role === "USER" ? "Customer" : m.role === "ADMIN" ? "You (Support)" : "Bot"}
            </span>
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                m.role === "USER"
                  ? "bg-zinc-100 dark:bg-zinc-900"
                  : m.role === "ADMIN"
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Reply to this customer…"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={pending || !text.trim()}
          className="rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
