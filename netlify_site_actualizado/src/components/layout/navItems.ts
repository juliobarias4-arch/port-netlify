import {
  LayoutDashboard,
  Grid3x3,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  History,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  subtitle: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Resumen",
    icon: LayoutDashboard,
    subtitle: "Vista general de la contabilidad",
  },
  {
    to: "/cuotas",
    label: "Cuotas",
    icon: Grid3x3,
    subtitle: "Estado de pago mensual por residente",
  },
  {
    to: "/deudas",
    label: "Deudas",
    icon: AlertCircle,
    subtitle: "Cuotas pendientes y antigüedad",
  },
  {
    to: "/ingresos",
    label: "Ingresos",
    icon: TrendingUp,
    subtitle: "Movimientos de entrada de fondos",
  },
  {
    to: "/egresos",
    label: "Egresos",
    icon: TrendingDown,
    subtitle: "Movimientos de salida de fondos",
  },
  {
    to: "/historial",
    label: "Historial",
    icon: History,
    subtitle: "Registro de actividad del sistema",
  },
  {
    to: "/record",
    label: "Record",
    icon: CalendarRange,
    subtitle: "Cumplimiento por trimestre",
  },
];

// Bottom-nav (mobile) shows the 5 most important destinations.
export const MOBILE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((i) =>
  ["/", "/cuotas", "/deudas", "/ingresos", "/historial"].includes(i.to),
);
