import { StatusDot, type DotTone } from "./StatusDot";
import { formatRelative } from "@/lib/format";
import type { HistoryEntry } from "@/types/snapshot";

export function actionTone(action: string): DotTone {
  const a = action.toLowerCase();
  if (a.includes("pag")) return "success";
  if (a.includes("ingreso")) return "info";
  if (a.includes("egreso")) return "warning";
  if (a.includes("elimin")) return "danger";
  return "muted";
}

export function ActivityItem({ entry }: { entry: HistoryEntry }) {
  return (
    <li className="flex gap-3 py-2.5">
      <div className="mt-1.5 shrink-0">
        <StatusDot tone={actionTone(entry.action_type)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body text-foreground">{entry.detail}</p>
        <p className="mt-0.5 text-caption text-muted-foreground">
          {entry.user} · {formatRelative(entry.timestamp)}
        </p>
      </div>
    </li>
  );
}
