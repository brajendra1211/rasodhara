import { getSiteSettings } from "@/lib/settings";
import { decryptSecret } from "@/lib/crypto-secret";

export async function getChatbotCredentials() {
  const settings = await getSiteSettings();

  const apiKey = settings.chatbotApiKey ? decryptSecret(settings.chatbotApiKey) : null;

  return {
    enabled: settings.chatbotEnabled && Boolean(apiKey),
    apiKey,
    instructions: settings.chatbotInstructions,
  };
}
