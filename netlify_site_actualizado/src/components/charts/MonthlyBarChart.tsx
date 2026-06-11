import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartTooltip } from "./ChartTooltip";
import { useChartColors } from "@/hooks/useChartColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { MonthlyPoint } from "@/types/snapshot";

type Mode = "both" | "paid" | "debt";

function compactCurrency(v: number): string {
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return String(v);
}

export function MonthlyBarChart({ data }: { data: MonthlyPoint[] }) {
  const [mode, setMode] = useState<Mode>("both");
  const colors = useChartColors();
  const reduced = useReducedMotion();

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList>
          <TabsTrigger value="paid">Pagado</TabsTrigger>
          <TabsTrigger value="debt">Deuda</TabsTrigger>
          <TabsTrigger value="both">Ambos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="22%">
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={colors.grid}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.axis, fontSize: 12 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickFormatter={compactCurrency}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: colors.grid, opacity: 0.4 }}
            />
            {(mode === "both" || mode === "paid") && (
              <Bar
                dataKey="paid"
                name="Pagado"
                fill={colors.paid}
                radius={[4, 4, 0, 0]}
                isAnimationActive={!reduced}
                animationDuration={300}
              />
            )}
            {(mode === "both" || mode === "debt") && (
              <Bar
                dataKey="debt"
                name="Deuda"
                fill={colors.debt}
                radius={[4, 4, 0, 0]}
                isAnimationActive={!reduced}
                animationDuration={300}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: colors.paid }}
          />
          Pagado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: colors.debt }}
          />
          Deuda
        </span>
      </div>
    </div>
  );
}
