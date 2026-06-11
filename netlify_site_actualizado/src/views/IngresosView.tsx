import { TrendingUp } from "lucide-react";
import { MovementsView, type MovementRow } from "./MovementsView";
import { useSnapshotData } from "@/context/SnapshotContext";

export function IngresosView() {
  const data = useSnapshotData();
  const rows: MovementRow[] = data.ingresos.records.map((r) => ({
    date: r.income_date,
    concept: r.concept,
    amount: r.amount,
    note: r.note,
  }));

  return (
    <MovementsView
      rows={rows}
      tone="success"
      icon={TrendingUp}
      noun="ingreso"
      filenamePrefix="ingresos"
    />
  );
}
