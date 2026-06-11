import { TrendingDown } from "lucide-react";
import { MovementsView, type MovementRow } from "./MovementsView";
import { useSnapshotData } from "@/context/SnapshotContext";

export function EgresosView() {
  const data = useSnapshotData();
  const rows: MovementRow[] = data.egresos.records.map((r) => ({
    date: r.expense_date,
    concept: r.concept,
    amount: r.amount,
    note: r.note,
  }));

  return (
    <MovementsView
      rows={rows}
      tone="danger"
      icon={TrendingDown}
      noun="egreso"
      filenamePrefix="egresos"
    />
  );
}
