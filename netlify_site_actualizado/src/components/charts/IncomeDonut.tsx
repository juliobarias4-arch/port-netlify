import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { useChartColors } from "@/hooks/useChartColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatCurrency } from "@/lib/format";

interface IncomeDonutProps {
  duesIncome: number;
  otherIncome: number;
}

export function IncomeDonut({ duesIncome, otherIncome }: IncomeDonutProps) {
  const colors = useChartColors();
  const reduced = useReducedMotion();
  const total = duesIncome + otherIncome;

  const data = [
    { name: "Cuotas", value: duesIncome, color: colors.palette[0] },
    { name: "Otros ingresos", value: otherIncome, color: colors.palette[1] },
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={!reduced}
              animationDuration={300}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-caption text-muted-foreground">Total</span>
          <span className="money text-h3 font-bold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-body">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="money ml-auto font-medium text-foreground">
              {formatCurrency(d.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
