
"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { format as formatDateFns, parseISO } from "date-fns";

export interface PriceHistoryPoint {
  date: string; // "YYYY-MM-DD"
  close: number;
}

interface TickerPriceChartProps {
  data: PriceHistoryPoint[];
}

const chartConfig = {
  closePrice: {
    label: "Close Price",
    color: "hsl(var(--primary))", 
  },
} satisfies ChartConfig;

export function TickerPriceChart({ data }: TickerPriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No price data available for the selected range.
      </div>
    );
  }

  const formattedData = data.map(point => ({
    ...point,
    displayDate: formatDateFns(parseISO(point.date), "MMM dd"),
    fullDate: formatDateFns(parseISO(point.date), "MMM dd, yyyy"),
  }));


  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0, // Removed bottom margin to eliminate space for X-axis labels/ticks
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
          <XAxis
            dataKey="displayDate" // Still need dataKey for data mapping
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false} // Hide tick lines
            axisLine={false} // Hide axis line
            tickFormatter={() => ''} // Hide labels by returning empty string
            height={0} // Attempt to completely remove space taken by X-axis
            tickMargin={0}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            tickFormatter={(value) => `$${value.toFixed(0)}`} 
            domain={['dataMin - 5', 'dataMax + 5']} 
          />
          <ChartTooltip
            cursor={{ stroke: "hsl(var(--primary)/0.3)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(value, payload) => {
                    return payload?.[0]?.payload?.fullDate || value;
                }}
                formatter={(value, name) => (
                  <>
                    <span className="font-semibold text-foreground">${(value as number).toFixed(2)}</span>
                  </>
                )}
              />
            }
          />
          <Line
            dataKey="close"
            type="monotone"
            stroke="var(--color-closePrice)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-closePrice)", strokeWidth: 0 }}
            nameKey="closePrice"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

