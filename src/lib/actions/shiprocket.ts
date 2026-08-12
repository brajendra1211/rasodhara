"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createShipmentForOrder } from "@/lib/shipment";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function retryShiprocketShipment(orderId: string) {
  await requireAdmin();
  const result = await createShipmentForOrder(orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  return result;
}
