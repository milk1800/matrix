
"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { assetType: "usEquities", value: 40, fill: "var(--color-usEquities)" },
  { assetType: "intlEquities", value: 20, fill: "var(--color-intlEquities)" },
  { assetType: "fixedIncome", value: 25, fill: "var(--color-fixedIncome)" },
  { assetType: "alternatives", value: 10, fill: "var(--color-alternatives)" },
  { assetType: "cash", value: 5, fill: "var(--color-cash)" },
]

const chartConfig = {
  value: {
    label: "Percentage", // General label for the values
  },
  usEquities: {
    label: "US Equities",
    color: "hsl(var(--chart-1))",
  },
  intlEquities: {
    label: "International Equities",
    color: "hsl(var(--chart-2))",
  },
  fixedIncome: {
    label: "Fixed Income",
    color: "hsl(var(--chart-3))",
  },
  alternatives: {
    label: "Alternatives",
    color: "hsl(var(--chart-4))",
  },
  cash: {
    label: "Cash & Equivalents",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function AssetAllocationDonutChart() {
  const [activeSegmentKey, setActiveSegmentKey] = React.useState<string | null>(null)

  const activeIndex = React.useMemo(() => {
    if (!activeSegmentKey) return -1;
    return chartData.findIndex((d) => d.assetType === activeSegmentKey);
  }, [activeSegmentKey]);


  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="assetType" />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="assetType"
            innerRadius={100}
            outerRadius={140}
            strokeWidth={2}
            stroke="hsl(var(--card))" // Creates separation between segments
            activeIndex={activeIndex}
            activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent }) => {
              const RADIAN = Math.PI / 180;
              return (
                <g>
                  <text x={cx} y={cy! - 10} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--foreground))" className="text-sm">
                    {payload.assetType ? chartConfig[payload.assetType as keyof typeof chartConfig]?.label : ''}
                  </text>
                  <text x={cx} y={cy! + 10} textAnchor="middle" dominantBaseline="central" fill={fill} className="text-xl font-bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                  <Cell
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius ? outerRadius + 8 : 0} // Pop-out effect
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    stroke={fill} 
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            onMouseEnter={(_, index) => setActiveSegmentKey(chartData[index].assetType)}
            onMouseLeave={() => setActiveSegmentKey(null)}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.assetType}
                fill={entry.fill} // This will be processed by ChartContainer based on chartConfig
                style={{ outline: 'none' }} // Explicitly remove outline for focused Cell
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
