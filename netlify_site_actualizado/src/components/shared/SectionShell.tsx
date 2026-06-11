import { cn } from "@/lib/utils";

/**
 * View wrapper providing the fade+translateY entrance and consistent spacing.
 */
export function SectionShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("animate-view-in space-y-6", className)}>{children}</div>
  );
}

export function ViewToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}
