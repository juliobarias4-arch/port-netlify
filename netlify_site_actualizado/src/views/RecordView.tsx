import { CalendarRange } from "lucide-react";
import { SectionShell } from "@/components/shared/SectionShell";
import { QuarterCard } from "@/components/shared/QuarterCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useSnapshotData } from "@/context/SnapshotContext";

export function RecordView() {
  const data = useSnapshotData();
  const { trimesters } = data.record;

  if (!trimesters.length) {
    return (
      <SectionShell>
        <EmptyState
          icon={CalendarRange}
          title="Sin trimestres"
          description="Aún no hay información de cumplimiento por trimestre."
        />
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {trimesters.map((t) => (
          <QuarterCard key={t.num} trimester={t} />
        ))}
      </div>
    </SectionShell>
  );
}
