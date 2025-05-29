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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { format as formatDateFns } from "date-fns";

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
    color: "hsl(var(--primary))", // Use primary accent color
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

  // Format dates for display and ensure they are actual Date objects for Recharts if needed for sorting
  const formattedData = data.map(point => ({
    ...point,
    // Recharts can often handle string dates if they are consistently formatted,
    // but converting to Date objects and then formatting for display is safer.
    displayDate: formatDateFns(new Date(point.date), "MMM dd"), // For X-axis labels
    fullDate: formatDateFns(new Date(point.date), "MMM dd, yyyy"), // For tooltip
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
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // Optionally skip some ticks if there are too many
             interval={Math.floor(data.length / 7)} // Show approx 7 ticks
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            tickFormatter={(value) => `$${value.toFixed(0)}`} // Adjust precision as needed
            domain={['dataMin - 5', 'dataMax + 5']} // Add some padding to min/max
          />
          <ChartTooltip
            cursor={{ stroke: "hsl(var(--primary)/0.3)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(value, payload) => {
                    // payload[0].payload.fullDate should be available
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
            nameKey="closePrice" // This refers to the key in chartConfig
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
