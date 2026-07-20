import { formatINR } from "@/lib/format";

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.total));

  return (
    <div className="flex h-40 items-end gap-0.5">
      {data.map((d) => (
        <div key={d.date} className="group relative flex-1">
          <div
            className="w-full rounded-t bg-amber-600/80 transition-colors group-hover:bg-amber-700"
            style={{ height: `${Math.max(2, (d.total / max) * 100)}%` }}
          />
          <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-zinc-100 dark:text-zinc-900">
            {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            <br />
            {formatINR(d.total)}
          </div>
        </div>
      ))}
    </div>
  );
}
