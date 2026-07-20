import { prisma } from "@/lib/prisma";
import { createAnnouncement, deleteAnnouncement } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcementMessage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Announcements" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        These scroll across the top strip on every page, in order. Use the order number to control sequence.
      </p>

      <form
        action={createAnnouncement}
        className="mb-6 flex max-w-xl flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="text" className="text-sm font-medium">
            Message
          </label>
          <input
            id="text"
            name="text"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex w-20 flex-col gap-1">
          <label htmlFor="order" className="text-sm font-medium">
            Order
          </label>
          <input
            id="order"
            name="order"
            type="number"
            defaultValue={announcements.length}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          Add
        </button>
      </form>

      <table className="w-full max-w-xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Message</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {announcements.map((a) => (
            <tr key={a.id}>
              <td className="py-3 pr-4">{a.order}</td>
              <td className="py-3 pr-4">{a.text}</td>
              <td className="py-3 pr-4 text-zinc-500">{a.active ? "Active" : "Hidden"}</td>
              <td className="py-3 pr-4">
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {announcements.length === 0 && <p className="py-4 text-sm text-zinc-500">No messages yet.</p>}
    </div>
  );
}
