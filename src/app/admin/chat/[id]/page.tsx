import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminChatThread } from "@/components/admin/chat-thread";

export default async function AdminChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    include: {
      user: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) notFound();

  return (
    <div>
      <Link href="/admin/chat" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
        &larr; All conversations
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold">{conversation.user?.name ?? "Guest visitor"}</h1>

      <AdminChatThread
        conversationId={conversation.id}
        initialBotPaused={conversation.botPaused}
        initialMessages={conversation.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
