import { getRankColor } from "@/lib/rank";
import { cn } from "@/lib/utils";

export function RankChip({ rank, className }: { rank: string; className?: string }) {
  const style = getRankColor(rank);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-micro tracking-wide",
        style.badge,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
