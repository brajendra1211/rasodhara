"use client";

export type ConfettiDot = { dx: number; dy: number; color: string; delay: number };

const COLORS = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#ec4899", "#eab308"];
const DOT_COUNT = 10;

export function generateConfettiDots(): ConfettiDot[] {
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / DOT_COUNT + Math.random() * 0.4;
    const distance = 40 + Math.random() * 30;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.08,
    };
  });
}

export function ConfettiBurst({ burstId, dots }: { burstId: number; dots: ConfettiDot[] }) {
  if (burstId === 0 || dots.length === 0) return null;

  return (
    <div key={burstId} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {dots.map((dot, i) => (
        <span
          key={i}
          className="animate-confetti-pop absolute left-1/2 top-1/2 block h-2 w-2 rounded-full"
          style={
            {
              backgroundColor: dot.color,
              "--dx": `${dot.dx}px`,
              "--dy": `${dot.dy}px`,
              animationDelay: `${dot.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
