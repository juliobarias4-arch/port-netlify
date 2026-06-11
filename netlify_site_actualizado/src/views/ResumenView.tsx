import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Users,
} from "lucide-react";
import { SectionShell } from "@/components/shared/SectionShell";
import { KpiCard } from "@/components/shared/KpiCard";
import { DataCard } from "@/components/shared/DataCard";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { IncomeDonut } from "@/components/charts/IncomeDonut";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { ResidentAvatar } from "@/components/shared/ResidentRow";
import { MoneyCell } from "@/components/shared/MoneyCell";
import { EmptyState } from "@/components/shared/EmptyState";
import { useSnapshotData } from "@/context/SnapshotContext";

export function ResumenView() {
  const data = useSnapshotData();
  const { totals, monthly } = data.summary;
  const recentActivity = data.historial.log.slice(0, 6);
  const topDebtors = data.deudas.pending.slice(0, 5);

  return (
    <SectionShell>
      {/* Row 1: KPI cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Balance actual"
          value={totals.balance}
          icon={Wallet}
          accent="primary"
          hint="Fondos disponibles"
        />
        <KpiCard
          label="Ingresos totales"
          value={totals.total_income}
          icon={TrendingUp}
          accent="success"
          hint="Cuotas + otros"
        />
        <KpiCard
          label="Egresos"
          value={totals.expenses}
          icon={TrendingDown}
          accent="danger"
          hint="Salidas registradas"
        />
        <KpiCard
          label="Deuda pendiente"
          value={totals.debt}
          icon={AlertTriangle}
          accent="warning"
          hint="Cuotas sin pagar"
        />
      </div>

      {/* Row 2: monthly chart + donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <DataCard
          title="Movimiento mensual"
          subtitle="Cuotas pagadas vs. deuda por mes"
          className="lg:col-span-8"
        >
          <MonthlyBarChart data={monthly} />
        </DataCard>
        <DataCard
          title="Composición de ingresos"
          subtitle="Cuotas y otros aportes"
          className="lg:col-span-4"
        >
          <IncomeDonut
            duesIncome={totals.dues_income}
            otherIncome={totals.other_income}
          />
        </DataCard>
      </div>

      {/* Row 3: activity feed + top debtors */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <DataCard
          title="Actividad reciente"
          subtitle="Últimos movimientos registrados"
          className="lg:col-span-7"
        >
          {recentActivity.length ? (
            <ul className="divide-y divide-border">
              {recentActivity.map((entry, i) => (
                <ActivityItem key={i} entry={entry} />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Activity}
              title="Sin actividad"
              description="Aún no hay movimientos registrados."
            />
          )}
        </DataCard>

        <DataCard
          title="Residentes con deuda"
          subtitle="Mayores montos pendientes"
          className="lg:col-span-5"
        >
          {topDebtors.length ? (
            <ul className="space-y-1">
              {topDebtors.map((d) => (
                <li
                  key={d.doctor}
                  className="flex items-center justify-between gap-3 rounded-md py-2 transition-colors hover:bg-surface-muted"
                >
                  <ResidentAvatar name={d.doctor} rank={rankOf(data, d.doctor)} />
                  <div className="text-right">
                    <MoneyCell value={d.total_due} tone="danger" className="text-body-medium" />
                    <p className="text-caption text-muted-foreground">
                      {d.count} {d.count === 1 ? "mes" : "meses"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              tone="success"
              title="Sin deudas"
              description="Todos los residentes están al día."
            />
          )}
        </DataCard>
      </div>
    </SectionShell>
  );
}

function rankOf(
  data: ReturnType<typeof useSnapshotData>,
  doctor: string,
): string {
  return data.cuotas.grid.find((r) => r.doctor === doctor)?.rank ?? "";
}
