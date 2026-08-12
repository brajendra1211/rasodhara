import { getSiteSettings } from "@/lib/settings";
import { decryptSecret } from "@/lib/crypto-secret";

export async function getShiprocketCredentials() {
  const settings = await getSiteSettings();

  const email = settings.shiprocketEmail || null;
  const password = settings.shiprocketPassword ? decryptSecret(settings.shiprocketPassword) : null;

  return {
    enabled: settings.shiprocketEnabled && Boolean(email && password),
    email,
    password,
    packageWeightGrams: settings.shiprocketPackageWeightGrams,
    packageLengthCm: settings.shiprocketPackageLengthCm,
    packageBreadthCm: settings.shiprocketPackageBreadthCm,
    packageHeightCm: settings.shiprocketPackageHeightCm,
  };
}
