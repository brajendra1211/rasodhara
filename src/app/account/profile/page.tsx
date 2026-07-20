import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/account-nav";
import { ProfileForms } from "@/components/profile-forms";

export const metadata: Metadata = {
  title: "Your Profile",
  robots: { index: false, follow: false },
};

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/profile");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login?callbackUrl=/account/profile");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your account</h1>
      <AccountNav active="Profile" />

      <ProfileForms name={user.name} email={user.email} phone={user.phone ?? ""} />
    </div>
  );
}
