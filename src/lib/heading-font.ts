export const DEFAULT_HEADING_FONT = "playfair";

export const HEADING_FONT_OPTIONS = [
  { value: "playfair", label: "Playfair Display (elegant serif)", cssVar: "var(--font-playfair)" },
  { value: "merriweather", label: "Merriweather (classic serif)", cssVar: "var(--font-merriweather)" },
  { value: "montserrat", label: "Montserrat (modern sans)", cssVar: "var(--font-montserrat)" },
  { value: "poppins", label: "Poppins (matches body text)", cssVar: "var(--font-poppins)" },
] as const;

export type HeadingFontValue = (typeof HEADING_FONT_OPTIONS)[number]["value"];

export function isValidHeadingFont(value: string): value is HeadingFontValue {
  return HEADING_FONT_OPTIONS.some((o) => o.value === value);
}

export function getHeadingFontCssVar(value: string): string {
  return HEADING_FONT_OPTIONS.find((o) => o.value === value)?.cssVar ?? HEADING_FONT_OPTIONS[0].cssVar;
}
