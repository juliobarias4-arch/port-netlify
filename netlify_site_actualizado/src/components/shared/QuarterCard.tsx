import { Check, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RankChip } from "./RankChip";
import { MoneyCell } from "./MoneyCell";
import { rankSortIndex } from "@/lib/rank";
import { cn } from "@/lib/utils";
import type { Trimester } from "@/types/snapshot";

export function QuarterCard({ trimester }: { trimester: Trimester }) {
  const total = trimester.total_paid + trimester.total_pending;
  const pct = total ? Math.round((trimester.total_paid / total) * 100) : 0;
  const isFuture = total === 0;

  const rows = trimester.rows
    .slice()
    .sort(
      (a, b) =>
        rankSortIndex(a.rank) - rankSortIndex(b.rank) ||
        a.doctor.localeCompare(b.doctor),
    );

  return (
    <Card
      className={cn(
        "flex flex-col p-6",
        isFuture && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-micro uppercase tracking-widest text-primary-500 dark:text-primary-400">
            Trimestre {trimester.num}
          </p>
          <h3 className="mt-0.5 text-h3 text-foreground">{trimester.label}</h3>
          <p className="text-small text-muted-foreground">{trimester.period}</p>
        </div>
        {isFuture && <Badge variant="secondary">Próximo</Badge>}
      </div>

      {/* mini stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-surface-muted px-3 py-2">
          <p className="text-caption text-muted-foreground">Cobrado</p>
          <MoneyCell value={trimester.total_paid} tone="success" className="text-body-medium" />
        </div>
        <div className="rounded-md bg-surface-muted px-3 py-2">
          <p className="text-caption text-muted-foreground">Pendiente</p>
          <MoneyCell value={trimester.total_pending} tone="danger" className="text-body-medium" />
        </div>
      </div>

      {/* progress */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-caption text-muted-foreground">
          <span>Cumplimiento</span>
          <span className="font-semibold text-foreground">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div
            className="h-full rounded-full bg-success-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* mini table */}
      {!isFuture && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="text-caption text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Residente</th>
                {trimester.months.map((m) => (
                  <th key={m.key} className="px-1 py-1.5 text-center font-medium">
                    {m.label.split(" ")[0].slice(0, 3)}
                  </th>
                ))}
                <th className="py-1.5 text-right font-medium">Pagado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.doctor}>
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <RankChip rank={r.rank} />
                      <span className="truncate text-foreground">{r.doctor}</span>
                    </div>
                  </td>
                  {r.cells.map((c) => (
                    <td key={c.key} className="px-1 py-1.5 text-center">
                      {c.paid ? (
                        <Check className="mx-auto size-4 text-success-600" strokeWidth={2.5} />
                      ) : (
                        <Minus className="mx-auto size-4 text-muted-foreground" />
                      )}
                    </td>
                  ))}
                  <td className="py-1.5 text-right">
                    <MoneyCell value={r.paid} tone="muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
