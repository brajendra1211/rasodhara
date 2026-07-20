import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCoupon } from "@/lib/actions/coupons";
import { CouponForm } from "@/components/admin/coupon-form";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const updateWithId = updateCoupon.bind(null, coupon.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit coupon</h1>
      <CouponForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          code: coupon.code,
          type: coupon.type,
          value: String(coupon.type === "FIXED" ? coupon.value / 100 : coupon.value),
          minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount / 100) : "",
          maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
          expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : "",
          active: coupon.active,
        }}
      />
    </div>
  );
}
