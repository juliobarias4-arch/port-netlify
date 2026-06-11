import { cn } from "@/lib/utils";

export type DotTone = "success" | "danger" | "warning" | "info" | "primary" | "muted";

const TONE_VAR: Record<DotTone, string> = {
  success: "var(--success-500)",
  danger: "var(--danger-500)",
  warning: "var(--warning-500)",
  info: "var(--info-500)",
  primary: "var(--primary-500)",
  muted: "var(--axis-text)",
};

export function StatusDot({
  tone = "muted",
  pulse = false,
  className,
}: {
  tone?: DotTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex size-2.5", className)}>
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ backgroundColor: TONE_VAR[tone] }}
        />
      )}
      <span
        className="relative inline-flex size-2.5 rounded-full"
        style={{ backgroundColor: TONE_VAR[tone] }}
      />
    </span>
  );
}
