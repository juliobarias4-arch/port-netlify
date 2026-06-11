import { NavLink } from "react-router-dom";
import { MOBILE_NAV_ITEMS } from "./navItems";
import { cn } from "@/lib/utils";

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-background md:hidden"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-micro",
                isActive
                  ? "text-primary-600 dark:text-primary-500"
                  : "text-muted-foreground",
              )
            }
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
