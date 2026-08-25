import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminChatListPage() {
  const conversations = await prisma.chatConversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    include: {
      user: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Chat conversations</h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-zinc-500">No conversations yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/chat/${c.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium">{c.user?.name ?? "Guest visitor"}</p>
                  {c.user?.email && <p className="text-xs text-zinc-500">{c.user.email}</p>}
                  <p className="mt-1 truncate text-sm text-zinc-500">{c.messages[0]?.content ?? ""}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-zinc-400">
                  <p>{c.lastMessageAt.toLocaleString()}</p>
                  {c.botPaused && (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      Bot paused
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
