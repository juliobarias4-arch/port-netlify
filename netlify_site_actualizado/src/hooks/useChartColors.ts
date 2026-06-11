import { useEffect, useState } from "react";
import { useTheme } from "./useTheme";

export interface ChartColors {
  paid: string;
  debt: string;
  grid: string;
  axis: string;
  palette: string[];
}

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/** Resolves theme-aware chart colors from CSS variables, re-reading on theme change. */
export function useChartColors(): ChartColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(() => compute());

  useEffect(() => {
    // Defer one frame so the `.dark` class has been applied to <html>.
    const id = requestAnimationFrame(() => setColors(compute()));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return colors;
}

function compute(): ChartColors {
  return {
    paid: readVar("--success-500", "#16c47f"),
    debt: readVar("--danger-500", "#ff4757"),
    grid: readVar("--grid-line", "#eff1f8"),
    axis: readVar("--axis-text", "#6b7388"),
    palette: [
      readVar("--chart-1", "#3525cd"),
      readVar("--chart-2", "#16c47f"),
      readVar("--chart-3", "#ffba00"),
      readVar("--chart-4", "#ff4757"),
      readVar("--chart-5", "#6470f0"),
      readVar("--chart-6", "#8b5cf6"),
    ],
  };
}
