import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggle}
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {isDark ? (
            <Sun className="size-[18px]" />
          ) : (
            <Moon className="size-[18px]" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isDark ? "Modo claro" : "Modo oscuro"}
      </TooltipContent>
    </Tooltip>
  );
}
