const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// Lightness curve borrowed from the built-in amber-* ramp so a custom brand
// color keeps the same visual contrast between steps as the original design.
const LIGHTNESS_CURVE: Record<(typeof RAMP_STEPS)[number], number> = {
  50: 96,
  100: 91,
  200: 79,
  300: 67,
  400: 57,
  500: 47,
  600: 38,
  700: 31,
  800: 25,
  900: 20,
  950: 13,
};

export const DEFAULT_THEME_COLOR = "#b8860b";

export function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }

  return { h: h * 60, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (n: number) =>
    Math.round(f(n) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

/** Generates a 50-950 shade ramp from a single base color, e.g. for a `--color-amber-*` override. */
export function generateColorRamp(baseHex: string): Record<(typeof RAMP_STEPS)[number], string> {
  const { h, s } = hexToHsl(baseHex);

  const ramp = {} as Record<(typeof RAMP_STEPS)[number], string>;
  for (const step of RAMP_STEPS) {
    ramp[step] = hslToHex(h, s, LIGHTNESS_CURVE[step]);
  }
  return ramp;
}
