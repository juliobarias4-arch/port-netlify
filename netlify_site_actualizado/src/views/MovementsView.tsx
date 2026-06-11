import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Search, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionShell, ViewToolbar } from "@/components/shared/SectionShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoneyCell } from "@/components/shared/MoneyCell";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/format";
import { exportCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";

export interface MovementRow {
  date: string;
  concept: string;
  amount: number;
  note: string | null;
}

type SortKey = "date" | "amount";
type SortDir = "asc" | "desc";

interface MovementsViewProps {
  rows: MovementRow[];
  tone: "success" | "danger";
  icon: LucideIcon;
  noun: string; // "ingreso" / "egreso"
  filenamePrefix: string;
}

export function MovementsView({
  rows,
  tone,
  icon: Icon,
  noun,
  filenamePrefix,
}: MovementsViewProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const stats = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.amount, 0);
    const months = new Set(rows.map((r) => r.date.slice(0, 7))).size || 1;
    const max = rows.reduce((m, r) => Math.max(m, r.amount), 0);
    return { total, avg: total / months, max };
  }, [rows]);

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        !q ||
        r.concept.toLowerCase().includes(q) ||
        (r.note?.toLowerCase().includes(q) ?? false),
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      if (sortKey === "amount") return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
  }, [rows, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleExport() {
    exportCsv(
      filenamePrefix,
      ["Fecha", "Concepto", "Monto", "Nota"],
      view.map((r) => [r.date, r.concept, r.amount, r.note ?? ""]),
    );
  }

  const total = view.reduce((s, r) => s + r.amount, 0);

  return (
    <SectionShell>
      {/* Mini KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniStat label={`Total de ${noun}s`} value={stats.total} tone={tone} />
        <MiniStat label="Promedio mensual" value={stats.avg} tone={tone} />
        <MiniStat label="Mayor monto" value={stats.max} tone={tone} />
      </div>

      <ViewToolbar>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar concepto o nota…"
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-4" />
          Exportar
        </Button>
      </ViewToolbar>

      {view.length ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border text-caption uppercase tracking-wide text-muted-foreground">
                  <SortableTh
                    label="Fecha"
                    active={sortKey === "date"}
                    onClick={() => toggleSort("date")}
                  />
                  <th className="px-4 py-3 text-left font-semibold">Concepto</th>
                  <SortableTh
                    label="Monto"
                    align="right"
                    active={sortKey === "amount"}
                    onClick={() => toggleSort("amount")}
                  />
                  <th className="px-4 py-3 text-left font-semibold">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {view.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-surface-muted">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(r.date, "short")}
                    </td>
                    <td className="px-4 py-3 text-body-medium text-foreground">
                      {r.concept}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <MoneyCell value={r.amount} tone={tone} className="text-body-medium" />
                    </td>
                    <td className="px-4 py-3 text-small text-muted-foreground">
                      {r.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-muted px-4 py-3 text-small">
            <span className="text-muted-foreground">Total mostrado:</span>
            <MoneyCell value={total} tone={tone} className="text-body-medium" />
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={query ? Inbox : Icon}
          title={query ? "Sin resultados" : `Sin ${noun}s`}
          description={
            query
              ? "Ajusta la búsqueda para ver más registros."
              : `Todavía no hay ${noun}s registrados.`
          }
        />
      )}
    </SectionShell>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger";
}) {
  return (
    <Card className="p-5">
      <p className="text-caption uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1">
        <MoneyCell value={value} tone={tone} className="text-h2 font-bold" />
      </p>
    </Card>
  );
}

function SortableTh({
  label,
  align = "left",
  active,
  onClick,
}: {
  label: string;
  align?: "left" | "right";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <th className={cn("px-4 py-3 font-semibold", align === "right" ? "text-right" : "text-left")}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active && "text-foreground",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    </th>
  );
}
