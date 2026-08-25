import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { getChatbotCredentials } from "@/lib/chatbot-credentials";
import { runAiChat, runFallbackChat, type ChatMessage } from "@/lib/chatbot/respond";
import {
  getOrCreateConversation,
  saveMessage,
  getMessagesAfter,
  getConversationById,
  getAllMessages,
} from "@/lib/chatbot/store";

type ChatBody = {
  message: string;
  conversationId?: string | null;
  guestId?: string | null;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const body = (await request.json()) as ChatBody;
  const message = typeof body.message === "string" ? body.message.slice(0, 2000).trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const guestId = !userId && typeof body.guestId === "string" ? body.guestId.slice(0, 100) : null;
  if (!userId && !guestId) {
    return NextResponse.json({ error: "guestId is required when not logged in" }, { status: 400 });
  }

  let conversation =
    body.conversationId && typeof body.conversationId === "string"
      ? await getConversationById(body.conversationId)
      : null;

  const ownsExisting =
    conversation && ((userId && conversation.userId === userId) || (!userId && conversation.guestId === guestId));

  if (!ownsExisting) {
    conversation = await getOrCreateConversation({ userId, guestId });
  }
  if (!conversation) {
    return NextResponse.json({ error: "Could not start conversation" }, { status: 500 });
  }

  await saveMessage(conversation.id, "USER", message);

  if (conversation.botPaused) {
    return NextResponse.json({ conversationId: conversation.id, reply: null, products: [], botPaused: true });
  }

  const [settings, credentials] = await Promise.all([getSiteSettings(), getChatbotCredentials()]);

  const store = {
    siteName: settings.siteName,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    codEnabled: settings.codEnabled,
    shippingFlatFee: settings.shippingFlatFee,
    freeShippingThreshold: settings.freeShippingThreshold,
    gstRatePercent: settings.gstRatePercent,
  };

  try {
    let result;
    if (credentials.enabled && credentials.apiKey) {
      const dbMessages = await getAllMessagesForHistory(conversation.id);
      result = await runAiChat({
        apiKey: credentials.apiKey,
        history: dbMessages,
        store,
        instructions: credentials.instructions,
        userId,
      });
    } else {
      result = await runFallbackChat({ message, store, userId });
    }

    await saveMessage(conversation.id, "ASSISTANT", result.text);

    return NextResponse.json({
      conversationId: conversation.id,
      reply: result.text,
      products: result.products ?? [],
      botPaused: false,
    });
  } catch (err) {
    console.error("Chat error:", err);
    const fallbackText = "Sorry, something went wrong. Please try again or contact us directly.";
    await saveMessage(conversation.id, "ASSISTANT", fallbackText);
    return NextResponse.json({
      conversationId: conversation.id,
      reply: fallbackText,
      products: [],
      botPaused: false,
    });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const afterId = searchParams.get("afterId");
  const guestId = searchParams.get("guestId");

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const owns =
    (userId && conversation.userId === userId) || (!conversation.userId && guestId && conversation.guestId === guestId);

  if (!owns) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await getMessagesAfter(conversationId, afterId);

  return NextResponse.json({
    botPaused: conversation.botPaused,
    messages: messages.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt })),
  });
}

async function getAllMessagesForHistory(conversationId: string): Promise<ChatMessage[]> {
  const messages = await getAllMessages(conversationId);
  return messages.slice(-20).map((m) => ({
    role: m.role === "USER" ? "user" : "assistant",
    content: m.content,
  }));
}
