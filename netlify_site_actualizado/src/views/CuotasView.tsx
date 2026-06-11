import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { SectionShell, ViewToolbar } from "@/components/shared/SectionShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentBadge, type PaymentState } from "@/components/shared/PaymentBadge";
import { RankChip } from "@/components/shared/RankChip";
import { MoneyCell } from "@/components/shared/MoneyCell";
import { useSnapshotData } from "@/context/SnapshotContext";
import { rankSortIndex, RANK_ORDER } from "@/lib/rank";
import { exportCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";

function cellState(
  row: Record<string, unknown>,
  key: string,
  payable: Set<string>,
): PaymentState {
  if (!payable.has(key)) return "future";
  return row[key] === true ? "paid" : "unpaid";
}

export function CuotasView() {
  const data = useSnapshotData();
  const { grid, period_months, payable_keys } = data.cuotas;
  const payable = useMemo(() => new Set(payable_keys), [payable_keys]);

  const [query, setQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grid
      .filter((r) => (rankFilter === "all" ? true : r.rank === rankFilter))
      .filter((r) => (q ? r.doctor.toLowerCase().includes(q) : true))
      .slice()
      .sort(
        (a, b) =>
          rankSortIndex(a.rank) - rankSortIndex(b.rank) ||
          a.doctor.localeCompare(b.doctor),
      );
  }, [grid, query, rankFilter]);

  // group rows by rank, preserving order
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((r) => {
      const arr = map.get(r.rank) ?? [];
      arr.push(r);
      map.set(r.rank, arr);
    });
    return [...map.entries()].sort(
      ([a], [b]) => rankSortIndex(a) - rankSortIndex(b),
    );
  }, [filtered]);

  const totals = useMemo(() => {
    let paid = 0;
    let pending = 0;
    grid.forEach((r) =>
      period_months.forEach((m) => {
        if (!payable.has(m.key)) return;
        if (r[m.key] === true) paid += 1;
        else pending += 1;
      }),
    );
    const total = paid + pending;
    return {
      paidAmount: paid * 500,
      pendingAmount: pending * 500,
      compliance: total ? Math.round((paid / total) * 100) : 0,
    };
  }, [grid, period_months, payable]);

  function handleExport() {
    const headers = ["Residente", "Rango", ...period_months.map((m) => m.label), "Deuda total"];
    const rows = filtered.map((r) => [
      r.doctor,
      r.rank,
      ...period_months.map((m) =>
        !payable.has(m.key) ? "—" : r[m.key] === true ? "Pagado" : "Pendiente",
      ),
      r.total_due,
    ]);
    exportCsv("cuotas", headers, rows);
  }

  return (
    <SectionShell>
      <ViewToolbar>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar residente…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={rankFilter} onValueChange={setRankFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los rangos</SelectItem>
              {RANK_ORDER.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-4" />
            Exportar
          </Button>
        </div>
      </ViewToolbar>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-body">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 z-30 min-w-[180px] border-b border-border bg-surface px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Residente
                </th>
                {period_months.map((m) => (
                  <th
                    key={m.key}
                    className="border-b border-border bg-surface px-2 py-3 text-center text-caption font-medium text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{m.label.split(" ")[0].slice(0, 3)}</span>
                      {payable.has(m.key) && (
                        <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                          Activo
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
                <th className="sticky right-0 z-30 min-w-[120px] border-b border-border bg-surface px-4 py-3 text-right text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Deuda
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map(([rank, rows]) => (
                <RankGroup
                  key={rank}
                  rank={rank}
                  rows={rows}
                  months={period_months}
                  payable={payable}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* sticky footer summary */}
        <div className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2 border-t border-border bg-surface-muted px-4 py-3 text-small">
          <span className="text-muted-foreground">
            Cobrado:{" "}
            <MoneyCell value={totals.paidAmount} tone="success" className="font-medium" />
          </span>
          <span className="text-muted-foreground">
            Pendiente:{" "}
            <MoneyCell value={totals.pendingAmount} tone="danger" className="font-medium" />
          </span>
          <span className="text-muted-foreground">
            Cumplimiento:{" "}
            <span className="font-semibold text-foreground">
              {totals.compliance}%
            </span>
          </span>
        </div>
      </Card>
    </SectionShell>
  );
}

function RankGroup({
  rank,
  rows,
  months,
  payable,
}: {
  rank: string;
  rows: ReturnType<typeof useSnapshotData>["cuotas"]["grid"];
  months: ReturnType<typeof useSnapshotData>["cuotas"]["period_months"];
  payable: Set<string>;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={months.length + 2}
          className="sticky left-0 bg-surface-sunken px-4 py-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground"
        >
          <RankChip rank={rank} />
        </td>
      </tr>
      {rows.map((r, i) => (
        <tr key={r.doctor} className="group">
          <td
            className={cn(
              "sticky left-0 z-10 min-w-[180px] bg-surface px-4 py-2 text-body-medium text-foreground transition-colors group-hover:bg-surface-muted",
              i === rows.length - 1 ? "" : "border-b border-border",
            )}
          >
            {r.doctor}
          </td>
          {months.map((m) => (
            <td
              key={m.key}
              className={cn(
                "px-2 py-2 text-center transition-colors group-hover:bg-surface-muted",
                i === rows.length - 1 ? "" : "border-b border-border",
              )}
            >
              <div className="flex justify-center">
                <PaymentBadge state={cellState(r, m.key, payable)} />
              </div>
            </td>
          ))}
          <td
            className={cn(
              "sticky right-0 z-10 bg-surface px-4 py-2 text-right transition-colors group-hover:bg-surface-muted",
              i === rows.length - 1 ? "" : "border-b border-border",
            )}
          >
            <MoneyCell
              value={r.total_due}
              tone={r.total_due > 0 ? "danger" : "muted"}
              className="text-body-medium"
            />
          </td>
        </tr>
      ))}
    </>
  );
}
