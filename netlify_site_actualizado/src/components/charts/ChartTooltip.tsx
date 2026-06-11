import type { TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/format";

/** Shared custom tooltip styled like a small Card. */
export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-card-hover">
      {label != null && (
        <p className="mb-1 text-caption font-medium text-foreground">{label}</p>
      )}
      <div className="space-y-0.5">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-caption">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="money ml-auto font-medium text-foreground">
              {formatCurrency(Number(p.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
