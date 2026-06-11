import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Titled content card used throughout the dashboard. */
export function DataCard({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: DataCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex items-start justify-between gap-3 p-6 pb-3">
        <div>
          <h3 className="text-h3 text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-small text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className={cn("flex-1 px-6 pb-6", bodyClassName)}>{children}</div>
    </Card>
  );
}
