import Anthropic from "@anthropic-ai/sdk";
import { formatINR } from "@/lib/format";
import { searchProducts, verifyAndGetOrder } from "@/lib/chatbot/data";

const MODEL = "claude-opus-5";
const MAX_TOOL_TURNS = 4;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type StoreContext = {
  siteName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  codEnabled: boolean;
  shippingFlatFee: number;
  freeShippingThreshold: number | null;
  gstRatePercent: number;
};

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_products",
    description:
      "Search the store's product catalog by name, category, or keyword (e.g. an oil type, taste, or dish). Returns up to 5 matching products with price and a link.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keywords" },
      },
      required: ["query"],
    },
  },
  {
    name: "check_order_status",
    description:
      "Look up an order's status, items, and total by order ID. If the customer is not logged in, you must also collect the phone number they used at checkout before calling this — the tool will refuse without it.",
    input_schema: {
      type: "object",
      properties: {
        orderId: {
          type: "string",
          description: "The order ID, found in the confirmation email or the My Orders page",
        },
        phone: {
          type: "string",
          description: "Customer's checkout phone number, required for guest (not-logged-in) customers",
        },
      },
      required: ["orderId"],
    },
  },
];

function buildSystemPrompt(store: StoreContext, instructions: string | null): string {
  const shipping =
    store.shippingFlatFee > 0
      ? `${formatINR(store.shippingFlatFee)} flat shipping fee${
          store.freeShippingThreshold ? `, free above ${formatINR(store.freeShippingThreshold)}` : ""
        }`
      : "free shipping";

  return `You are the customer support assistant for ${store.siteName}, an Indian e-commerce store.

Store info:
- Contact: ${store.contactEmail ?? "n/a"}${store.contactPhone ? `, ${store.contactPhone}` : ""}
- Shipping: ${shipping}
- Cash on Delivery: ${store.codEnabled ? "available" : "not available"}
- GST: ${store.gstRatePercent}%
${instructions ? `\nAdditional store notes from the admin:\n${instructions}\n` : ""}
You can:
- Search products with the search_products tool.
- Check an order's status with the check_order_status tool. If the customer isn't logged in, you MUST ask for the 10-digit phone number used at checkout, plus the Order ID, before calling the tool. Never reveal order details without a successful lookup — never invent order or product data.
- For anything else, point the customer to /shop, /account/orders, /cart, or the contact details above.

Keep replies short (2-4 sentences), friendly, and match the customer's language style (Hindi/Hinglish or English).`;
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  ctx: { userId: string | null }
): Promise<string> {
  if (name === "search_products") {
    const products = await searchProducts(String(input.query ?? ""));
    return JSON.stringify(products.map((p) => ({ ...p, price: formatINR(p.price) })));
  }

  if (name === "check_order_status") {
    const result = await verifyAndGetOrder({
      orderId: String(input.orderId ?? ""),
      phone: typeof input.phone === "string" ? input.phone : null,
      userId: ctx.userId,
    });

    if ("error" in result) return JSON.stringify(result);

    return JSON.stringify({
      ...result.order,
      totalAmount: formatINR(result.order.totalAmount),
    });
  }

  return JSON.stringify({ error: "unknown_tool" });
}

export async function runAiChat({
  apiKey,
  history,
  store,
  instructions,
  userId,
}: {
  apiKey: string;
  history: ChatMessage[];
  store: StoreContext;
  instructions: string | null;
  userId: string | null;
}): Promise<string> {
  const client = new Anthropic({ apiKey });
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  const system = buildSystemPrompt(store, instructions);

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system,
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason !== "tool_use") {
      const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
      return textBlock?.text?.trim() || "Sorry, I couldn't process that — please try again.";
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await executeTool(block.name, block.input as Record<string, unknown>, { userId });
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  return "Sorry, I'm having trouble with that right now — please contact us directly for help.";
}

export async function runFallbackChat({
  message,
  store,
  userId,
}: {
  message: string;
  store: StoreContext;
  userId: string | null;
}): Promise<string> {
  const text = message.toLowerCase().trim();
  const contact = store.contactEmail ?? store.contactPhone ?? "our support team";

  if (/^(hi|hello|hey|namaste|namaskar)\b/.test(text)) {
    return `Hi! I'm ${store.siteName}'s assistant. I can help you search products, check an order's status, or answer questions about shipping and returns. What do you need?`;
  }

  if (/^search products?$/.test(text)) {
    return "Sure — what product are you looking for? (e.g. a pickle, ghee, or spice)";
  }

  if (/^(shipping( ?& ?| and )?returns?)$/.test(text)) {
    const feeText =
      store.shippingFlatFee > 0 ? `${formatINR(store.shippingFlatFee)} flat shipping` : "free shipping";
    const freeText = store.freeShippingThreshold ? ` (free above ${formatINR(store.freeShippingThreshold)})` : "";
    return `We charge ${feeText}${freeText}. Cash on Delivery is ${
      store.codEnabled ? "available" : "currently not available"
    }. You can cancel an order from Account → Orders while it's Pending or Paid; for returns/refunds contact us at ${contact}.`;
  }

  if (/^(track my order|my order|order status)$/.test(text)) {
    return `Please share your Order ID (from your confirmation email or Account → My Orders) so I can check its status.${
      userId ? "" : " If you checked out as a guest, please also include the 10-digit phone number you used."
    }`;
  }

  if (/\b(order|track|status|invoice|bill|delivery)\b/.test(text)) {
    const idMatch = message.match(/\b[a-z0-9]{20,}\b/i);
    const phoneMatch = message.match(/\b\d{10}\b/);

    if (idMatch) {
      const result = await verifyAndGetOrder({ orderId: idMatch[0], phone: phoneMatch?.[0], userId });

      if ("error" in result) {
        if (result.error === "not_found") {
          return "I couldn't find an order with that ID. Please double-check it, or visit Account → Orders.";
        }
        return "For your security, please also share the 10-digit phone number used at checkout so I can verify this order.";
      }

      const itemsList = result.order.items
        .map((i) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} × ${i.quantity}`)
        .join(", ");
      return `Order #${result.order.id.slice(-8).toUpperCase()} is currently ${result.order.status}. Items: ${itemsList}. Total: ${formatINR(
        result.order.totalAmount
      )}. Full details & invoice: ${result.order.invoiceUrl}`;
    }

    return `Please share your Order ID (from your confirmation email or Account → My Orders) so I can check its status.${
      userId ? "" : " If you checked out as a guest, please also include the 10-digit phone number you used."
    }`;
  }

  if (/\b(return|refund|cancel)\b/.test(text)) {
    return `You can cancel an order from Account → Orders while it's still Pending or Paid. For return/refund help, contact us at ${contact}.`;
  }

  if (/\b(shipping|delivery time|cod|cash on delivery)\b/.test(text)) {
    const feeText =
      store.shippingFlatFee > 0 ? `${formatINR(store.shippingFlatFee)} flat shipping` : "free shipping";
    const freeText = store.freeShippingThreshold ? ` (free above ${formatINR(store.freeShippingThreshold)})` : "";
    return `We charge ${feeText}${freeText}. Cash on Delivery is ${store.codEnabled ? "available" : "currently not available"}.`;
  }

  const products = await searchProducts(message);
  if (products.length > 0) {
    const list = products.map((p) => `• ${p.name} — ${formatINR(p.price)} (${p.url})`).join("\n");
    return `Here's what I found:\n${list}`;
  }

  return `I couldn't quite find that. You can browse all products at /shop, or contact us at ${contact} for help.`;
}
