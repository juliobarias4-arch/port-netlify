import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_ITEMS } from "./navItems";
import { SidebarItem } from "./SidebarItem";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarProps {
  expanded: boolean;
  onToggleExpand: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function Sidebar({
  expanded,
  onToggleExpand,
  onLogout,
  onNavigate,
}: SidebarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "flex h-full flex-col bg-[var(--sidebar)] py-4 transition-[width] duration-200",
        expanded ? "w-60 px-3" : "w-[72px] items-center px-0",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "mb-6 flex items-center",
          expanded ? "gap-3 px-2" : "justify-center",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-body-medium font-extrabold text-white">
          DA
        </div>
        {expanded && (
          <div className="leading-tight">
            <p className="text-body-medium font-semibold text-white">
              Portal contable
            </p>
            <p className="text-micro text-[var(--sidebar-icon)]">
              Anestesiología
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            expanded={expanded}
            end={item.to === "/"}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Footer: expand toggle + logout */}
      <div className="mt-auto flex flex-col gap-1 pt-3">
        <ExpandToggle expanded={expanded} onToggle={onToggleExpand} />
        <LogoutButton expanded={expanded} onLogout={onLogout} />
      </div>
    </nav>
  );
}

function ExpandToggle({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = expanded ? PanelLeftClose : PanelLeftOpen;
  const btn = (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Colapsar menú" : "Expandir menú"}
      className={cn(
        "flex h-11 items-center rounded-md text-[var(--sidebar-icon)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-white",
        expanded ? "gap-3 px-3" : "w-11 justify-center",
      )}
    >
      <Icon className="size-5 shrink-0" />
      {expanded && <span className="text-body-medium">Colapsar</span>}
    </button>
  );
  if (expanded) return btn;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right">Expandir menú</TooltipContent>
    </Tooltip>
  );
}

function LogoutButton({
  expanded,
  onLogout,
}: {
  expanded: boolean;
  onLogout: () => void;
}) {
  const btn = (
    <button
      type="button"
      onClick={onLogout}
      aria-label="Cerrar sesión"
      className={cn(
        "flex h-11 items-center rounded-md text-[var(--sidebar-icon)] transition-colors hover:bg-danger-500 hover:text-white",
        expanded ? "gap-3 px-3" : "w-11 justify-center",
      )}
    >
      <LogOut className="size-5 shrink-0" />
      {expanded && <span className="text-body-medium">Cerrar sesión</span>}
    </button>
  );
  if (expanded) return btn;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right">Cerrar sesión</TooltipContent>
    </Tooltip>
  );
}
