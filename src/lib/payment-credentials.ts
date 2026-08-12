import { getSiteSettings } from "@/lib/settings";
import { decryptSecret } from "@/lib/crypto-secret";

/**
 * Resolves live Razorpay credentials, preferring the admin-configured (DB-stored)
 * values and falling back to RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET env vars.
 */
export async function getRazorpayCredentials() {
  const settings = await getSiteSettings();

  const keyId = settings.razorpayKeyId || process.env.RAZORPAY_KEY_ID || null;
  const keySecret = settings.razorpayKeySecret
    ? decryptSecret(settings.razorpayKeySecret)
    : process.env.RAZORPAY_KEY_SECRET || null;

  const configured = Boolean(keyId && keySecret);
  const enabled = settings.razorpayKeyId ? settings.razorpayEnabled && configured : configured;

  return { enabled, keyId, keySecret };
}
