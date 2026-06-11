import { useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import type { Cuotas, PendingDebtor } from "@/types/snapshot";

interface Bucket {
  label: string;
  amount: number;
  color: string;
}

/**
 * Debt aging: classify each unpaid month by days between its due_date and today.
 * Buckets: 0-30 / 31-60 / 61-90 / +90 days.
 */
export function AgingBars({
  pending,
  periodMonths,
}: {
  pending: PendingDebtor[];
  periodMonths: Cuotas["period_months"];
}) {
  const buckets = useMemo<Bucket[]>(() => {
    const dueByLabel = new Map<string, string>();
    periodMonths.forEach((m) => dueByLabel.set(m.label, m.due_date));

    const acc = [0, 0, 0, 0];
    const now = Date.now();
    pending.forEach((d) => {
      d.months.forEach((m) => {
        const due = dueByLabel.get(m.label);
        const days = due
          ? Math.floor((now - new Date(`${due}T00:00:00`).getTime()) / 86400000)
          : 0;
        const idx = days <= 30 ? 0 : days <= 60 ? 1 : days <= 90 ? 2 : 3;
        acc[idx] += m.amount;
      });
    });

    return [
      { label: "0–30 días", amount: acc[0], color: "var(--success-500)" },
      { label: "31–60 días", amount: acc[1], color: "var(--warning-500)" },
      { label: "61–90 días", amount: acc[2], color: "var(--danger-500)" },
      { label: "+90 días", amount: acc[3], color: "var(--danger-700)" },
    ];
  }, [pending, periodMonths]);

  const max = Math.max(1, ...buckets.map((b) => b.amount));

  return (
    <div className="space-y-4">
      {buckets.map((b) => (
        <div key={b.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-caption">
            <span className="text-muted-foreground">{b.label}</span>
            <span className="money font-medium text-foreground">
              {formatCurrency(b.amount)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(b.amount / max) * 100}%`,
                backgroundColor: b.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
