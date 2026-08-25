import { prisma } from "@/lib/prisma";
import type { ChatRole } from "@/generated/prisma/client";

export async function getOrCreateConversation({
  userId,
  guestId,
}: {
  userId: string | null;
  guestId: string | null;
}) {
  if (userId) {
    const existing = await prisma.chatConversation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
    return prisma.chatConversation.create({ data: { userId } });
  }

  if (guestId) {
    const existing = await prisma.chatConversation.findFirst({
      where: { guestId },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
    return prisma.chatConversation.create({ data: { guestId } });
  }

  throw new Error("A userId or guestId is required to start a conversation");
}

export function getConversationById(id: string) {
  return prisma.chatConversation.findUnique({ where: { id } });
}

export async function saveMessage(conversationId: string, role: ChatRole, content: string) {
  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({ data: { conversationId, role, content } }),
    prisma.chatConversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } }),
  ]);
  return message;
}

export function getAllMessages(conversationId: string) {
  return prisma.chatMessage.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
}

export async function getMessagesAfter(conversationId: string, afterId: string | null) {
  if (afterId) {
    const afterMsg = await prisma.chatMessage.findUnique({ where: { id: afterId } });
    if (afterMsg) {
      return prisma.chatMessage.findMany({
        where: { conversationId, createdAt: { gt: afterMsg.createdAt } },
        orderBy: { createdAt: "asc" },
      });
    }
  }
  return getAllMessages(conversationId);
}
