import { Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SyncIndicator } from "@/components/shared/SyncIndicator";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  subtitle: string;
  syncedAt: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  onOpenMobileNav: () => void;
}

export function Topbar({
  title,
  subtitle,
  syncedAt,
  refreshing,
  onRefresh,
  onLogout,
  onOpenMobileNav,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-h2 text-foreground sm:text-h1">{title}</h1>
        <p className="hidden truncate text-small text-muted-foreground sm:block">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <SyncIndicator syncedAt={syncedAt} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Actualizar datos"
            >
              <RefreshCw
                className={cn("size-[18px]", refreshing && "animate-spin")}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Actualizar</TooltipContent>
        </Tooltip>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Cuenta"
            >
              <Avatar className="size-8">
                <AvatarFallback>DA</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sesión de consulta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-danger-700 focus:bg-danger-50"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
