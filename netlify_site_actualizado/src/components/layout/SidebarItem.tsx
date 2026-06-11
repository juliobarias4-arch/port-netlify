import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  expanded: boolean;
  end?: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  to,
  label,
  icon: Icon,
  expanded,
  end,
  onNavigate,
}: SidebarItemProps) {
  const link = (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex h-11 items-center rounded-md text-[var(--sidebar-icon)] transition-colors",
          expanded ? "gap-3 px-3" : "w-11 justify-center",
          "hover:bg-[var(--sidebar-hover)] hover:text-white",
          isActive && "bg-[var(--sidebar-active)] text-white",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-success-500" />
          )}
          <Icon className="size-5 shrink-0" strokeWidth={2} />
          {expanded && (
            <span className="truncate text-body-medium">{label}</span>
          )}
        </>
      )}
    </NavLink>
  );

  if (expanded) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
