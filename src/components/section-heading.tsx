export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 flex flex-col items-center gap-2 text-center">
      <h2 className="text-2xl font-bold text-[#3f2d20] sm:text-3xl dark:text-zinc-50">{title}</h2>
      <div className="flex items-center gap-2 text-amber-500">
        <span className="h-px w-8 bg-amber-300" />
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
          <circle cx="12" cy="12" r="6" />
        </svg>
        <span className="h-px w-8 bg-amber-300" />
      </div>
      {subtitle && <p className="max-w-xl text-sm text-[#5c4a3a] sm:text-base dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
}
