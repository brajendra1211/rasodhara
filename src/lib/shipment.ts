import { prisma } from "@/lib/prisma";
import { getShiprocketCredentials } from "@/lib/shiprocket-credentials";
import { createShiprocketOrder } from "@/lib/shiprocket";

export async function createShipmentForOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) return { success: false, error: "Order not found" };
  if (order.shiprocketShipmentId) return { success: true };

  const credentials = await getShiprocketCredentials();
  if (!credentials.enabled || !credentials.email || !credentials.password) {
    return { success: false, error: "Shiprocket is not configured" };
  }

  if (!order.shippingCity || !order.shippingState || !order.shippingPincode) {
    const message = "Order is missing city/state/pincode; edit the order or ask the customer for their full address.";
    await prisma.order.update({ where: { id: orderId }, data: { shiprocketError: message } });
    return { success: false, error: message };
  }

  const email = order.user?.email || order.guestEmail || "";

  const totalWeightGrams = order.items.reduce(
    (sum, item) => sum + item.quantity * (item.product.weightGrams ?? credentials.packageWeightGrams),
    0
  );

  try {
    const result = await createShiprocketOrder(
      { email: credentials.email, password: credentials.password },
      {
        orderId: order.id,
        orderDate: order.createdAt,
        customerName: order.shippingName,
        phone: order.shippingPhone,
        email,
        address: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        pincode: order.shippingPincode,
        paymentMethod: order.paymentMethod === "COD" ? "COD" : "Prepaid",
        subtotal: order.subtotal / 100,
        items: order.items.map((item) => ({
          name: item.product.name + (item.variantLabel ? ` (${item.variantLabel})` : ""),
          sku: item.variantId ?? item.productId,
          units: item.quantity,
          sellingPrice: item.price / 100,
        })),
        weightKg: Math.max(totalWeightGrams, credentials.packageWeightGrams) / 1000,
        lengthCm: credentials.packageLengthCm,
        breadthCm: credentials.packageBreadthCm,
        heightCm: credentials.packageHeightCm,
      }
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        shiprocketOrderId: result.shiprocketOrderId,
        shiprocketShipmentId: result.shipmentId,
        shiprocketAwbCode: result.awbCode,
        shiprocketCourierName: result.courierName,
        shiprocketTrackingUrl: result.awbCode ? `https://shiprocket.co/tracking/${result.awbCode}` : null,
        shiprocketError: null,
      },
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Shiprocket shipment creation failed";
    await prisma.order.update({ where: { id: orderId }, data: { shiprocketError: message } });
    return { success: false, error: message };
  }
}
