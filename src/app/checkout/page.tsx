import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const [session, settings] = await Promise.all([auth(), getSiteSettings()]);
  const userId = session?.user?.id;

  const addresses = userId
    ? await prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <CheckoutClient
      siteName={settings.siteName}
      loggedIn={Boolean(userId)}
      addresses={addresses}
      codEnabled={settings.codEnabled}
      shippingFlatFee={settings.shippingFlatFee}
      freeShippingThreshold={settings.freeShippingThreshold}
      gstRatePercent={settings.gstRatePercent}
    />
  );
}
