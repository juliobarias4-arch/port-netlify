import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentState = "paid" | "unpaid" | "future";

/**
 * 28px month cell badge.
 * - paid: green check
 * - unpaid (within payable window): red X
 * - future (not yet payable): grey minus
 */
export function PaymentBadge({
  state,
  className,
}: {
  state: PaymentState;
  className?: string;
}) {
  const config = {
    paid: {
      cls: "bg-success-50 text-success-700 ring-1 ring-inset ring-success-100 dark:ring-success-100",
      Icon: Check,
      label: "Pagado",
    },
    unpaid: {
      cls: "bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-100",
      Icon: X,
      label: "Pendiente",
    },
    future: {
      cls: "bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border",
      Icon: Minus,
      label: "Futuro",
    },
  }[state];

  const { Icon } = config;
  return (
    <span
      role="img"
      aria-label={config.label}
      title={config.label}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md",
        config.cls,
        className,
      )}
    >
      <Icon className="size-4" strokeWidth={2.5} />
    </span>
  );
}
