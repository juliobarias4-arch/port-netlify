import { useState } from "react";
import { ChevronRight, ShieldCheck, History, CheckCircle2 } from "lucide-react";
import { SectionShell } from "@/components/shared/SectionShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataCard } from "@/components/shared/DataCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResidentAvatar } from "@/components/shared/ResidentRow";
import { MoneyCell } from "@/components/shared/MoneyCell";
import { AgingBars } from "@/components/charts/AgingBars";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSnapshotData } from "@/context/SnapshotContext";
import type { PendingDebtor, LegacyDebt } from "@/types/snapshot";

function LegacyDebtsSection({ legacy }: { legacy: LegacyDebt[] }) {
  const pendingTotal = legacy
    .filter((d) => !d.paid)
    .reduce((s, d) => s + d.amount, 0);

  return (
    <Card className="mt-6 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-h3 text-foreground">Deudas anteriores</h3>
          <p className="text-small text-muted-foreground">
            Deudas de antes del inicio del programa (julio 2026)
          </p>
        </div>
        <div className="text-right">
          <p className="text-caption uppercase tracking-wide text-muted-foreground">
            Pendiente
          </p>
          <MoneyCell value={pendingTotal} tone="danger" className="text-h3" />
        </div>
      </div>

      {legacy.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <History className="size-7 text-muted-foreground" />
          <p className="text-body text-muted-foreground">
            No hay deudas anteriores registradas.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {legacy.map((d) => (
            <li
              key={d.id}
              className={`flex items-center justify-between gap-4 px-6 py-4 ${
                d.paid ? "opacity-60" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                    d.paid ? "bg-primary-100" : "bg-danger-50"
                  }`}
                >
                  <span
                    className={`text-caption font-bold ${
                      d.paid ? "text-primary-700" : "text-danger-600"
                    }`}
                  >
                    {d.doctor_name.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-body-medium text-foreground">{d.doctor_name}</p>
                  <p className="truncate text-small text-muted-foreground">
                    {d.concept}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div>
                  <MoneyCell
                    value={d.amount}
                    tone={d.paid ? "muted" : "danger"}
                    className="text-body-medium"
                  />
                </div>
                {d.paid ? (
                  <span className="flex items-center justify-end gap-1 text-caption font-medium text-success-600">
                    <CheckCircle2 className="size-3.5" /> Pagada
                  </span>
                ) : (
                  <span className="block text-caption text-muted-foreground">Pendiente</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function DeudasView() {
  const data = useSnapshotData();
  const { pending } = data.deudas;
  const legacy = data.deudas.legacy ?? [];
  const [selected, setSelected] = useState<PendingDebtor | null>(null);

  function rankOf(doctor: string) {
    return data.cuotas.grid.find((r) => r.doctor === doctor)?.rank ?? "";
  }

  if (pending.length === 0) {
    return (
      <SectionShell>
        <EmptyState
          icon={ShieldCheck}
          tone="success"
          title="Sin deudas pendientes"
          description="Todos los residentes están al día con sus cuotas."
          className="bg-success-50/40"
        />
        <LegacyDebtsSection legacy={legacy} />
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Debtors table */}
        <Card className="overflow-hidden lg:col-span-8">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-h3 text-foreground">Residentes con deuda</h3>
            <p className="text-small text-muted-foreground">
              {pending.length} con cuotas pendientes
            </p>
          </div>
          <ul className="divide-y divide-border">
            {pending.map((d) => (
              <li key={d.doctor}>
                <button
                  type="button"
                  onClick={() => setSelected(d)}
                  className="flex w-full items-center gap-4 px-6 py-3 text-left transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-[180px]">
                    <ResidentAvatar name={d.doctor} rank={rankOf(d.doctor)} />
                  </div>
                  <div className="hidden flex-1 flex-wrap gap-1.5 sm:flex">
                    {d.months.slice(0, 4).map((m) => (
                      <Badge key={m.label} variant="danger">
                        {m.label}
                      </Badge>
                    ))}
                    {d.months.length > 4 && (
                      <Badge variant="secondary">
                        +{d.months.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <MoneyCell value={d.total_due} tone="danger" className="text-body-medium" />
                    <p className="text-caption text-muted-foreground">
                      {d.count} {d.count === 1 ? "mes" : "meses"}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Aging */}
        <DataCard
          title="Antigüedad de la deuda"
          subtitle="Distribución por días vencidos"
          className="lg:col-span-4"
        >
          <AgingBars pending={pending} periodMonths={data.cuotas.period_months} />
        </DataCard>
      </div>

      {/* Legacy debts */}
      <LegacyDebtsSection legacy={legacy} />

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.doctor}</SheetTitle>
                <SheetDescription>
                  {selected.count} {selected.count === 1 ? "mes" : "meses"} pendientes ·{" "}
                  Total <MoneyCell value={selected.total_due} tone="danger" />
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-2 overflow-y-auto px-6 py-4">
                {selected.months.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-muted px-4 py-3"
                  >
                    <span className="text-body text-foreground">{m.label}</span>
                    <MoneyCell value={m.amount} tone="danger" className="text-body-medium" />
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SectionShell>
  );
}
