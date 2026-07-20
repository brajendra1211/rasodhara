export function computeOrderTotals({
  subtotal,
  discountAmount,
  shippingFlatFee,
  freeShippingThreshold,
  gstRatePercent,
}: {
  subtotal: number;
  discountAmount: number;
  shippingFlatFee: number;
  freeShippingThreshold: number | null;
  gstRatePercent: number;
}) {
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee =
    freeShippingThreshold !== null && afterDiscount >= freeShippingThreshold ? 0 : shippingFlatFee;
  const taxAmount = Math.round((afterDiscount * gstRatePercent) / 100);
  const totalAmount = afterDiscount + shippingFee + taxAmount;

  return { shippingFee, taxAmount, totalAmount };
}
