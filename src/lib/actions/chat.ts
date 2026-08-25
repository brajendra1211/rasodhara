"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMessage } from "@/lib/chatbot/store";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function sendAdminChatReply(conversationId: string, formData: FormData) {
  await requireAdmin();

  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await saveMessage(conversationId, "ADMIN", content);

  revalidatePath(`/admin/chat/${conversationId}`);
  revalidatePath("/admin/chat");
}

export async function setChatBotPaused(conversationId: string, paused: boolean) {
  await requireAdmin();

  await prisma.chatConversation.update({ where: { id: conversationId }, data: { botPaused: paused } });

  revalidatePath(`/admin/chat/${conversationId}`);
}
