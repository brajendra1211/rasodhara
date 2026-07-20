import { createCoupon } from "@/lib/actions/coupons";
import { CouponForm } from "@/components/admin/coupon-form";

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New coupon</h1>
      <CouponForm action={createCoupon} submitLabel="Create coupon" />
    </div>
  );
}
