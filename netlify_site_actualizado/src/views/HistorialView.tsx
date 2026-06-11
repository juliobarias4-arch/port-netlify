import { useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { SectionShell, ViewToolbar } from "@/components/shared/SectionShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/shared/StatusDot";
import { actionTone } from "@/components/shared/ActivityItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSnapshotData } from "@/context/SnapshotContext";
import type { HistoryEntry } from "@/types/snapshot";

const FILTERS: Array<{ key: string; label: string; match: (a: string) => boolean }> = [
  { key: "all", label: "Todo", match: () => true },
  { key: "pagado", label: "Pagos", match: (a) => a.includes("pag") },
  { key: "ingreso", label: "Ingresos", match: (a) => a.includes("ingreso") },
  { key: "egreso", label: "Egresos", match: (a) => a.includes("egreso") },
  { key: "eliminacion", label: "Eliminaciones", match: (a) => a.includes("elimin") },
];

const PAGE = 50;

export function HistorialView() {
  const data = useSnapshotData();
  const log = data.historial.log;

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = FILTERS.find((x) => x.key === filter)!;
    return log.filter(
      (e) =>
        f.match(e.action_type.toLowerCase()) &&
        (!q ||
          e.detail.toLowerCase().includes(q) ||
          e.user.toLowerCase().includes(q)),
    );
  }, [log, filter, query]);

  const visible = filtered.slice(0, limit);

  // group by day (YYYY-MM-DD)
  const grouped = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    visible.forEach((e) => {
      const day = e.timestamp.slice(0, 10);
      const arr = map.get(day) ?? [];
      arr.push(e);
      map.set(day, arr);
    });
    return [...map.entries()];
  }, [visible]);

  return (
    <SectionShell>
      <ViewToolbar>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-caption font-medium transition-colors",
                filter === f.key
                  ? "border-primary bg-primary-50 text-primary-700"
                  : "border-border text-muted-foreground hover:bg-surface-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en el historial…"
            className="pl-9"
          />
        </div>
      </ViewToolbar>

      {grouped.length ? (
        <div className="space-y-6">
          {grouped.map(([day, entries]) => (
            <Card key={day} className="p-6">
              <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDate(day, "long")}
              </p>
              <ol className="relative space-y-0 border-l border-border pl-5">
                {entries.map((e, i) => (
                  <li key={i} className="relative pb-5 last:pb-0">
                    <span className="absolute -left-[26px] top-1 flex size-3">
                      <StatusDot tone={actionTone(e.action_type)} />
                    </span>
                    <p className="text-body text-foreground">{e.detail}</p>
                    <p className="mt-0.5 text-caption text-muted-foreground">
                      {e.user} · {formatDate(e.timestamp, "datetime")}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          ))}

          {filtered.length > limit && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setLimit((l) => l + PAGE)}
              >
                Cargar 50 más
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="Sin registros"
          description="No hay entradas que coincidan con los filtros."
        />
      )}
    </SectionShell>
  );
}
