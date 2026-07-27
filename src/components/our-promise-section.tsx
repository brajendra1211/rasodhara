const PROMISES = [
  {
    title: "No Artificial Preservatives",
    description: "Made using traditional preservation methods.",
    icon: "M12 3c-4 3-7 6-7 10a7 7 0 0014 0c0-4-3-7-7-10z",
  },
  {
    title: "Handcrafted in Small Batches",
    description: "Freshly prepared with care and attention.",
    icon: "M4 8h16v3a8 8 0 01-16 0V8zM7 8V6a5 5 0 0110 0v2",
  },
  {
    title: "Quality Tested",
    description: "Every batch undergoes strict quality testing for safety and consistency.",
    icon: "M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z",
  },
];

export function OurPromiseSection() {
  return (
    <section className="bg-amber-100/60 dark:bg-zinc-900">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {PROMISES.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-8 w-8 shrink-0 text-olive-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-[#3f2d20] dark:text-zinc-100">{item.title}</h3>
              <p className="text-sm text-[#5c4a3a] dark:text-zinc-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
