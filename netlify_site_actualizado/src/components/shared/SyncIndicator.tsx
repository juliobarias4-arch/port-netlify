import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusDot } from "./StatusDot";
import { formatDate, formatRelative, minutesSince } from "@/lib/format";

/**
 * Sync freshness pill. Color by age of synced_at:
 *  - green  < 15 min
 *  - yellow < 2 h
 *  - red    > 2 h
 */
export function SyncIndicator({ syncedAt }: { syncedAt: string | null | undefined }) {
  const mins = minutesSince(syncedAt);
  const tone = mins < 15 ? "success" : mins < 120 ? "warning" : "danger";
  const toneCls =
    tone === "success"
      ? "bg-success-50 text-success-700"
      : tone === "warning"
        ? "bg-warning-50 text-warning-700"
        : "bg-danger-50 text-danger-700";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium ${toneCls}`}
        >
          <StatusDot tone={tone} pulse={tone === "success"} />
          <span className="hidden sm:inline">
            Sincronizado {formatRelative(syncedAt)}
          </span>
          <span className="sm:hidden">{formatRelative(syncedAt)}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Última sincronización: {formatDate(syncedAt, "datetime")}
      </TooltipContent>
    </Tooltip>
  );
}
