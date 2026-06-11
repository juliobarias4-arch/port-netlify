// Rank color mapping for resident ranks (R4..R1).

export interface RankStyle {
  label: string;
  badge: string; // tailwind classes for chip background/text
  dot: string; // css color for status dots
}

const RANK_STYLES: Record<string, RankStyle> = {
  R4: {
    label: "R4",
    badge: "bg-primary-100 text-primary-700 dark:text-primary-700",
    dot: "var(--primary-500)",
  },
  R3: {
    label: "R3",
    badge: "bg-info-50 text-info-600",
    dot: "var(--info-500)",
  },
  R2: {
    label: "R2",
    badge: "bg-success-50 text-success-700",
    dot: "var(--success-500)",
  },
  R1: {
    label: "R1",
    badge: "bg-warning-50 text-warning-700",
    dot: "var(--warning-500)",
  },
};

const FALLBACK: RankStyle = {
  label: "—",
  badge: "bg-muted text-muted-foreground",
  dot: "var(--axis-text)",
};

export function getRankColor(rank: string): RankStyle {
  return RANK_STYLES[rank?.toUpperCase?.()] ?? { ...FALLBACK, label: rank || "—" };
}

/** Rank ordering for grouping (R4 first). */
export const RANK_ORDER = ["R4", "R3", "R2", "R1"];

export function rankSortIndex(rank: string): number {
  const i = RANK_ORDER.indexOf(rank?.toUpperCase?.());
  return i === -1 ? RANK_ORDER.length : i;
}

/** Deterministic initials from a doctor name. */
export function initials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
