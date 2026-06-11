import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type Accent = "primary" | "success" | "danger" | "warning";

const ACCENT: Record<Accent, { bg: string; fg: string; value: string }> = {
  primary: {
    bg: "bg-primary-50",
    fg: "text-primary-600 dark:text-primary-500",
    value: "text-foreground",
  },
  success: {
    bg: "bg-success-50",
    fg: "text-success-600",
    value: "text-foreground",
  },
  danger: {
    bg: "bg-danger-50",
    fg: "text-danger-600",
    value: "text-foreground",
  },
  warning: {
    bg: "bg-warning-50",
    fg: "text-warning-600",
    value: "text-foreground",
  },
};

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: Accent;
  delta?: { value: string; positive?: boolean };
  hint?: string;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  delta,
  hint,
}: KpiCardProps) {
  const a = ACCENT[accent];
  return (
    <Card className="group p-6 transition-transform hover:-translate-y-px hover:shadow-card-hover dark:hover:shadow-none">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            a.bg,
            a.fg,
          )}
        >
          <Icon className="size-5" />
        </div>
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-caption font-medium",
              delta.positive
                ? "bg-success-50 text-success-700"
                : "bg-danger-50 text-danger-700",
            )}
          >
            {delta.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-caption uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 money text-display font-extrabold", a.value)}>
        {formatCurrency(value)}
      </p>
      {hint && <p className="mt-1 text-small text-muted-foreground">{hint}</p>}
    </Card>
  );
}
