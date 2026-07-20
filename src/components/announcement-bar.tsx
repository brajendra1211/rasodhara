import { prisma } from "@/lib/prisma";
import { AnnouncementRotator } from "@/components/announcement-rotator";

const FALLBACK_MESSAGES = ["Welcome to FarmStore — cold-pressed oils, straight from the farm"];

export async function AnnouncementBar() {
  const rows = await prisma.announcementMessage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const messages = rows.length > 0 ? rows.map((r) => r.text) : FALLBACK_MESSAGES;

  return (
    <div className="border-b border-amber-800 bg-amber-700 px-4 py-2.5 text-xs font-semibold text-white sm:text-sm">
      <AnnouncementRotator messages={messages} />
    </div>
  );
}
