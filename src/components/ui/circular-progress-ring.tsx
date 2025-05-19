
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressRingProps {
  progress: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number; // width of the ring stroke
  className?: string;
}

export function CircularProgressRing({
  progress,
  size = 48,
  strokeWidth = 5,
  className,
}: CircularProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let colorClass = "stroke-[hsl(var(--chart-5))]"; // Red for 0-25%
  if (progress > 75) {
    colorClass = "stroke-[hsl(var(--chart-3))]"; // Green for 76-100%
  } else if (progress > 50) {
    colorClass = "stroke-[hsl(var(--chart-4))]"; // Yellow for 51-75%
  } else if (progress > 25) {
    colorClass = "stroke-[hsl(var(--chart-orange))]"; // Orange for 26-50%
  }

  const glowFilter = progress > 90 ? "drop-shadow(0 0 3px hsl(var(--primary)))" : "none";

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        style={{ filter: glowFilter }}
      >
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            "transition-all duration-300 ease-in-out",
            colorClass
          )}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-sm font-bold text-foreground">
        {`${Math.round(progress)}%`}
      </span>
    </div>
  );
}
