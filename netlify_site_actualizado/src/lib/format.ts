// Formatting helpers — Dominican Republic locale (es-DO), RD$ currency.

const moneyFormatter = new Intl.NumberFormat("es-DO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** RD$ 37,354.00 — prefix RD$, comma thousands, always 2 decimals. */
export function formatCurrency(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `RD$ ${moneyFormatter.format(n)}`;
}

/** Number with thousands separators, no currency. */
export function formatNumber(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return moneyFormatter.format(n);
}

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function parseDate(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  // Accept "2026-05-14T14:54:44" and "2026-07-31"
  const d = new Date(input.includes("T") ? input : `${input}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export type DateStyle = "short" | "long" | "relative" | "datetime";

export function formatDate(
  input: string | Date | null | undefined,
  style: DateStyle = "short",
): string {
  const d = parseDate(input);
  if (!d) return "—";

  if (style === "short") {
    return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}. ${d.getFullYear()}`;
  }
  if (style === "long") {
    return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
  }
  if (style === "datetime") {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}. ${d.getFullYear()}, ${hh}:${mm}`;
  }
  // relative
  return formatRelative(d);
}

export function formatRelative(input: string | Date | null | undefined): string {
  const d = parseDate(input);
  if (!d) return "—";
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  if (sec < 60) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  if (hr < 24) return `hace ${hr} h`;
  if (day === 1) return "ayer";
  if (day < 30) return `hace ${day} días`;
  return formatDate(d, "short");
}

/** Minutes elapsed since an ISO timestamp (for sync freshness). */
export function minutesSince(input: string | Date | null | undefined): number {
  const d = parseDate(input);
  if (!d) return Infinity;
  return (Date.now() - d.getTime()) / 60000;
}
