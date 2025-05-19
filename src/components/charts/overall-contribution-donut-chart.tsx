
"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface OverallContributionDonutChartProps {
  totalContributed: number;
  totalLimit: number;
}

export function OverallContributionDonutChart({
  totalContributed,
  totalLimit,
}: OverallContributionDonutChartProps) {
  const remainingToContribute = Math.max(0, totalLimit - totalContributed);
  const fundedPercentage = totalLimit > 0 ? (totalContributed / totalLimit) * 100 : 0;

  const chartData = [
    { name: "Contributed", value: totalContributed, fill: "var(--color-contributed)" },
    { name: "Remaining", value: remainingToContribute, fill: "var(--color-remaining)" },
  ];

  const chartConfig = {
    value: {
      label: "Amount",
    },
    contributed: {
      label: "Total Contributed",
      color: "hsl(var(--chart-1))",
    },
    remaining: {
      label: "Total Remaining to Max Out",
      color: "hsl(var(--muted))",
    },
  } satisfies ChartConfig;

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={100}
            outerRadius={140}
            strokeWidth={2}
            stroke="hsl(var(--card))"
            activeIndex={activeIndex ?? undefined}
            activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent }) => {
              return (
                <g>
                  <text x={cx} y={cy! - 15} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--foreground))" className="text-lg font-semibold">
                    {totalLimit > 0 ? `${fundedPercentage.toFixed(1)}%` : 'N/A'}
                  </text>
                   <text x={cx} y={cy! + 10} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--muted-foreground))" className="text-sm">
                    Funded
                  </text>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ? outerRadius + 6 : 0}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    stroke={fill}
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.fill} style={{ outline: 'none' }}/>
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            verticalAlign="bottom"
            align="center"
            className="mt-4"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
