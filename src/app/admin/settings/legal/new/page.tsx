import { createLegalPage } from "@/lib/actions/settings";
import { LegalPageForm } from "@/components/admin/legal-page-form";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default function NewLegalPagePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Legal Pages" />
      <LegalPageForm action={createLegalPage} submitLabel="Create page" />
    </div>
  );
}
