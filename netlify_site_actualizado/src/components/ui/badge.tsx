import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-100 text-primary-700",
        secondary: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-success-50 text-success-700",
        danger: "border-transparent bg-danger-50 text-danger-700",
        warning: "border-transparent bg-warning-50 text-warning-700",
        info: "border-transparent bg-info-50 text-info-600",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
