import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTrustBadge } from "@/lib/actions/settings";
import { TrustBadgeForm } from "@/components/admin/trust-badge-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function EditTrustBadgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const badge = await prisma.trustBadge.findUnique({ where: { id } });
  if (!badge) notFound();

  const updateWithId = updateTrustBadge.bind(null, badge.id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Trust Badges" />

      <h2 className="mb-6 text-xl font-semibold">Edit trust badge</h2>
      <TrustBadgeForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          label: badge.label,
          description: badge.description ?? "",
          icon: badge.icon,
          order: badge.order,
          active: badge.active,
        }}
      />
    </div>
  );
}
