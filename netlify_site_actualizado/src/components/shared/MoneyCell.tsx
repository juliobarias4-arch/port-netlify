import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyCellProps {
  value: number;
  tone?: "default" | "success" | "danger" | "warning" | "muted";
  className?: string;
}

const TONE: Record<NonNullable<MoneyCellProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success-700 dark:text-success-500",
  danger: "text-danger-700 dark:text-danger-500",
  warning: "text-warning-700 dark:text-warning-500",
  muted: "text-muted-foreground",
};

export function MoneyCell({ value, tone = "default", className }: MoneyCellProps) {
  return (
    <span className={cn("money", TONE[tone], className)}>
      {formatCurrency(value)}
    </span>
  );
}
