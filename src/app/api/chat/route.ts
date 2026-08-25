import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { getChatbotCredentials } from "@/lib/chatbot-credentials";
import { runAiChat, runFallbackChat, type ChatMessage } from "@/lib/chatbot/respond";

type ChatBody = {
  messages: ChatMessage[];
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const body = (await request.json()) as ChatBody;
  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage?.content.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
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
    const reply =
      credentials.enabled && credentials.apiKey
        ? await runAiChat({
            apiKey: credentials.apiKey,
            history: messages,
            store,
            instructions: credentials.instructions,
            userId,
          })
        : await runFallbackChat({ message: lastUserMessage.content, store, userId });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({
      reply: "Sorry, something went wrong. Please try again or contact us directly.",
    });
  }
}
