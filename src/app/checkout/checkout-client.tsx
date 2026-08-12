"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/format";
import { computeOrderTotals } from "@/lib/order-totals";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type SavedAddress = {
  id: string;
  label: string | null;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export function CheckoutClient({
  siteName,
  loggedIn,
  addresses,
  codEnabled,
  shippingFlatFee,
  freeShippingThreshold,
  gstRatePercent,
}: {
  siteName: string;
  loggedIn: boolean;
  addresses: SavedAddress[];
  codEnabled: boolean;
  shippingFlatFee: number;
  freeShippingThreshold: number | null;
  gstRatePercent: number;
}) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress ? defaultAddress.id : "new");
  const [name, setName] = useState(defaultAddress?.name ?? "");
  const [phone, setPhone] = useState(defaultAddress?.phone ?? "");
  const [address, setAddress] = useState(defaultAddress?.address ?? "");
  const [city, setCity] = useState(defaultAddress?.city ?? "");
  const [state, setState] = useState(defaultAddress?.state ?? "");
  const [pincode, setPincode] = useState(defaultAddress?.pincode ?? "");
  const [guestEmail, setGuestEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, setCouponPending] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const { shippingFee, taxAmount, totalAmount } = computeOrderTotals({
    subtotal,
    discountAmount,
    shippingFlatFee,
    freeShippingThreshold,
    gstRatePercent,
  });

  function handleSelectAddress(id: string) {
    setSelectedAddressId(id);
    if (id === "new") {
      setName("");
      setPhone("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      return;
    }
    const saved = addresses.find((a) => a.id === id);
    if (saved) {
      setName(saved.name);
      setPhone(saved.phone);
      setAddress(saved.address);
      setCity(saved.city);
      setState(saved.state);
      setPincode(saved.pincode);
    }
  }

  async function handleApplyCoupon() {
    setCouponError(null);
    if (!couponInput.trim()) return;

    setCouponPending(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Could not apply this coupon.");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({ code: data.code, discountAmount: data.discountAmount });
    } catch {
      setCouponError("Could not apply this coupon.");
    } finally {
      setCouponPending(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handlePlaceOrder() {
    setError(null);

    if (!name || !phone || !address || !city || !state || !pincode) {
      setError("Please fill in all shipping details.");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    if (!loggedIn && !/^\S+@\S+\.\S+$/.test(guestEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (paymentMethod === "RAZORPAY" && !scriptReady) {
      setError("Payment gateway is still loading, try again in a moment.");
      return;
    }

    setPending(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingState: state,
          shippingPincode: pincode,
          couponCode: appliedCoupon?.code,
          paymentMethod,
          guestEmail: loggedIn ? undefined : guestEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong while placing your order.");
        setPending(false);
        return;
      }

      if (data.paymentMethod === "COD") {
        clear();
        const tokenParam = data.guestAccessToken ? `?token=${data.guestAccessToken}` : "";
        router.push(`/order/${data.orderId}${tokenParam}`);
        return;
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: siteName,
        description: "Order payment",
        order_id: data.razorpayOrderId,
        prefill: { name, contact: phone },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...response }),
          });

          if (verifyRes.ok) {
            clear();
            const tokenParam = data.guestAccessToken ? `?token=${data.guestAccessToken}` : "";
            router.push(`/order/${data.orderId}${tokenParam}`);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setPending(false),
        },
      });

      razorpay.open();
    } catch {
      setError("Something went wrong while placing your order.");
      setPending(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onReady={() => setScriptReady(true)} />

      <h1 className="mb-6 text-2xl font-semibold">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Shipping details</h2>

          {!loggedIn && (
            <div className="flex flex-col gap-1">
              <label htmlFor="guestEmail" className="text-sm font-medium">
                Email (for order updates)
              </label>
              <input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          )}

          {addresses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label htmlFor="savedAddress" className="text-sm font-medium">
                Deliver to
              </label>
              <select
                id="savedAddress"
                value={selectedAddressId}
                onChange={(e) => handleSelectAddress(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label || a.name} &mdash; {a.address.slice(0, 40)}
                  </option>
                ))}
                <option value="new">Use a new address</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="text-sm font-medium">
              Delivery address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              placeholder="House no., street, locality"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="pincode" className="text-sm font-medium">
              Pincode
            </label>
            <input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="max-w-[10rem] rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Payment method</span>
            <label className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              Pay online (UPI / Card / Netbanking)
            </label>
            {codEnabled && (
              <label className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={pending}
            className="mt-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {pending
              ? "Processing..."
              : paymentMethod === "COD"
                ? `Place order (${formatINR(totalAmount)})`
                : `Pay ${formatINR(totalAmount)}`}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Order summary</h2>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex justify-between py-2 text-sm">
                <span>
                  {item.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} &times; {item.quantity}
                </span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <label htmlFor="coupon" className="text-sm font-medium">
              Coupon code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
                <span>
                  &ldquo;{appliedCoupon.code}&rdquo; applied &mdash; &minus;{formatINR(appliedCoupon.discountAmount)}
                </span>
                <button type="button" onClick={handleRemoveCoupon} className="font-medium hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponPending}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-sm text-red-600">{couponError}</p>}
          </div>

          <div className="flex justify-between border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-700 dark:text-green-400">
              <span>Discount</span>
              <span>&minus;{formatINR(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingFee > 0 ? formatINR(shippingFee) : "Free"}</span>
          </div>
          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>GST</span>
              <span>{formatINR(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold dark:border-zinc-800">
            <span>Total</span>
            <span>{formatINR(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
