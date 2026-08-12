const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getShiprocketToken(email: string, password: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket login failed (${res.status})`);
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error("Shiprocket login did not return a token");
  }

  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

export type ShiprocketOrderItem = {
  name: string;
  sku: string;
  units: number;
  sellingPrice: number;
};

export type ShiprocketOrderInput = {
  orderId: string;
  orderDate: Date;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "Prepaid" | "COD";
  subtotal: number;
  items: ShiprocketOrderItem[];
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
};

export type ShiprocketOrderResult = {
  shiprocketOrderId: string;
  shipmentId: string;
  awbCode: string | null;
  courierName: string | null;
};

function formatShiprocketDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export async function createShiprocketOrder(
  credentials: { email: string; password: string },
  input: ShiprocketOrderInput
): Promise<ShiprocketOrderResult> {
  const token = await getShiprocketToken(credentials.email, credentials.password);

  const [firstName, ...rest] = input.customerName.trim().split(/\s+/);

  const payload = {
    order_id: input.orderId,
    order_date: formatShiprocketDate(input.orderDate),
    pickup_location: "Primary",
    billing_customer_name: firstName || input.customerName,
    billing_last_name: rest.join(" "),
    billing_address: input.address,
    billing_city: input.city,
    billing_pincode: input.pincode,
    billing_state: input.state,
    billing_country: "India",
    billing_email: input.email,
    billing_phone: input.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.sellingPrice,
    })),
    payment_method: input.paymentMethod,
    sub_total: input.subtotal,
    length: input.lengthCm,
    breadth: input.breadthCm,
    height: input.heightCm,
    weight: input.weightKg,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.shipment_id) {
    const message = typeof data?.message === "string" ? data.message : `Shiprocket order creation failed (${res.status})`;
    throw new Error(message);
  }

  let awbCode: string | null = null;
  let courierName: string | null = null;

  try {
    const awbRes = await fetch(`${BASE_URL}/courier/assign/awb`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ shipment_id: data.shipment_id }),
    });
    const awbData = await awbRes.json();
    if (awbRes.ok && awbData?.response?.data) {
      awbCode = awbData.response.data.awb_code ?? null;
      courierName = awbData.response.data.courier_name ?? null;
    }
  } catch {
    // Auto-assigning a courier is best-effort — if it fails, the shipment still
    // exists in Shiprocket and can be assigned a courier manually from its dashboard.
  }

  return {
    shiprocketOrderId: String(data.order_id),
    shipmentId: String(data.shipment_id),
    awbCode,
    courierName,
  };
}
