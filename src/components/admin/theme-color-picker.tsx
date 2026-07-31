"use client";

import { useState } from "react";
import { generateColorRamp, isValidHexColor } from "@/lib/theme-color";

export function ThemeColorPicker({ defaultValue }: { defaultValue: string }) {
  const [color, setColor] = useState(defaultValue);
  const ramp = isValidHexColor(color) ? generateColorRamp(color) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label="Theme color"
          value={isValidHexColor(color) ? color : defaultValue}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-zinc-300 dark:border-zinc-700"
        />
        <input
          name="themeColor"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="#b8860b"
          className="w-32 rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {!isValidHexColor(color) && <span className="text-xs text-red-600">Use a 6-digit hex, e.g. #b8860b</span>}
      </div>

      {ramp && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Preview shades (used for buttons, links, accents)</span>
          <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
            {Object.entries(ramp).map(([step, hex]) => (
              <div key={step} title={`${step}: ${hex}`} className="h-8 flex-1" style={{ backgroundColor: hex }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
