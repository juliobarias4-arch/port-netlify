import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: "default" | "success";
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  tone = "default",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          tone === "success"
            ? "bg-success-50 text-success-600"
            : "bg-surface-muted text-muted-foreground",
        )}
      >
        <Icon className="size-7" />
      </div>
      <div className="space-y-1">
        <p className="text-h3 text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
