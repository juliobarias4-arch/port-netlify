import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RankChip } from "./RankChip";
import { initials } from "@/lib/rank";

export function ResidentAvatar({ name, rank }: { name: string; rank: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-body-medium text-foreground">{name}</p>
        <RankChip rank={rank} />
      </div>
    </div>
  );
}
