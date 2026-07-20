import { prisma } from "@/lib/prisma";
import { deleteNewsletterSubscriber } from "@/lib/actions/settings";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Newsletter subscribers ({subscribers.length})</h1>

      <table className="w-full max-w-xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Subscribed</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {subscribers.map((s) => (
            <tr key={s.id}>
              <td className="py-3 pr-4 font-medium">{s.email}</td>
              <td className="py-3 pr-4 text-zinc-500">{new Date(s.createdAt).toLocaleDateString()}</td>
              <td className="py-3 pr-4">
                <form action={deleteNewsletterSubscriber.bind(null, s.id)}>
                  <button type="submit" className="text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscribers.length === 0 && <p className="py-6 text-sm text-zinc-500">No subscribers yet.</p>}
    </div>
  );
}
