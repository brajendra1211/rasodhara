import { createTrustBadge } from "@/lib/actions/settings";
import { TrustBadgeForm } from "@/components/admin/trust-badge-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default function NewTrustBadgePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Trust Badges" />

      <h2 className="mb-6 text-xl font-semibold">New trust badge</h2>
      <TrustBadgeForm action={createTrustBadge} submitLabel="Create badge" />
    </div>
  );
}
