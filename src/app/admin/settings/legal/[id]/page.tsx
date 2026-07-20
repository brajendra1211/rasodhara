import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLegalPage } from "@/lib/actions/settings";
import { LegalPageForm } from "@/components/admin/legal-page-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function EditLegalPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.legalPage.findUnique({ where: { id } });
  if (!page) notFound();

  const updateWithId = updateLegalPage.bind(null, page.id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Legal Pages" />
      <LegalPageForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{ title: page.title, slug: page.slug, body: page.body }}
      />
    </div>
  );
}
