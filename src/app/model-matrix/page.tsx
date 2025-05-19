
"use client";

import * as React from "react";
import { Download, UserCog, LibraryBig, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModelData {
  id: string;
  manager: string;
  strategyName: string;
  aum: string;
  feePercent: string;
  style: string;
  ytdReturn: string;
  ytdBenchmark: string;
  oneYearReturn: string;
  oneYearBenchmark: string;
  threeYearReturn: string;
  threeYearBenchmark: string;
  fiveYearReturn: string;
  fiveYearBenchmark: string;
  sharpeRatio: string;
  irr: string;
  beta: string;
}

const modelPerformanceData: ModelData[] = [
  {
    id: "strat1",
    manager: "Alpha Advisors",
    strategyName: "Global Growth Equity",
    aum: "$150M",
    feePercent: "0.85%",
    style: "Growth",
    ytdReturn: "+12.5%",
    ytdBenchmark: "+10.2%",
    oneYearReturn: "+22.1%",
    oneYearBenchmark: "+20.5%",
    threeYearReturn: "+15.3% p.a.",
    threeYearBenchmark: "+14.0% p.a.",
    fiveYearReturn: "+13.8% p.a.",
    fiveYearBenchmark: "+12.5% p.a.",
    sharpeRatio: "1.25",
    irr: "18.2%",
    beta: "1.10",
  },
  {
    id: "strat2",
    manager: "Beta Capital",
    strategyName: "Core Fixed Income",
    aum: "$250M",
    feePercent: "0.40%",
    style: "Fixed Income",
    ytdReturn: "+2.1%",
    ytdBenchmark: "+1.8%",
    oneYearReturn: "+4.5%",
    oneYearBenchmark: "+4.2%",
    threeYearReturn: "+3.0% p.a.",
    threeYearBenchmark: "+2.8% p.a.",
    fiveYearReturn: "+2.5% p.a.",
    fiveYearBenchmark: "+2.3% p.a.",
    sharpeRatio: "0.95",
    irr: "3.5%",
    beta: "0.65",
  },
  {
    id: "strat3",
    manager: "Gamma Investments",
    strategyName: "Emerging Markets Value",
    aum: "$75M",
    feePercent: "1.10%",
    style: "Value",
    ytdReturn: "-3.2%",
    ytdBenchmark: "-2.5%",
    oneYearReturn: "+8.0%",
    oneYearBenchmark: "+9.5%",
    threeYearReturn: "+5.5% p.a.",
    threeYearBenchmark: "+6.0% p.a.",
    fiveYearReturn: "+7.2% p.a.",
    fiveYearBenchmark: "+7.8% p.a.",
    sharpeRatio: "0.60",
    irr: "6.8%",
    beta: "1.35",
  },
  {
    id: "strat4",
    manager: "Delta Asset Mgmt",
    strategyName: "Balanced Portfolio UMA",
    aum: "$320M",
    feePercent: "0.65%",
    style: "Balanced",
    ytdReturn: "+7.8%",
    ytdBenchmark: "+7.0%",
    oneYearReturn: "+14.2%",
    oneYearBenchmark: "+13.5%",
    threeYearReturn: "+9.1% p.a.",
    threeYearBenchmark: "+8.5% p.a.",
    fiveYearReturn: "+8.5% p.a.",
    fiveYearBenchmark: "+8.0% p.a.",
    sharpeRatio: "1.10",
    irr: "10.5%",
    beta: "0.98",
  },
  {
    id: "strat5",
    manager: "Alpha Advisors",
    strategyName: "Tech Innovators SMA",
    aum: "$90M",
    feePercent: "1.00%",
    style: "Sector - Tech",
    ytdReturn: "+18.5%",
    ytdBenchmark: "+16.0%",
    oneYearReturn: "+35.2%",
    oneYearBenchmark: "+30.8%",
    threeYearReturn: "+22.0% p.a.",
    threeYearBenchmark: "+20.1% p.a.",
    fiveYearReturn: "+20.5% p.a.",
    fiveYearBenchmark: "+18.9% p.a.",
    sharpeRatio: "1.40",
    irr: "25.1%",
    beta: "1.20",
  },
];

const getReturnClass = (returnValue: string) => {
  if (returnValue.startsWith('+')) return 'text-green-400';
  if (returnValue.startsWith('-')) return 'text-red-400';
  return 'text-foreground'; // Default if no sign or N/A
};


export default function ModelMatrixPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Model Matrix</h1>
      
      <PlaceholderCard title="Model Strategy Performance Matrix" className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Manager</TableHead>
              <TableHead className="font-bold">Strategy Name</TableHead>
              <TableHead className="font-bold text-right">AUM</TableHead>
              <TableHead className="font-bold text-right">Fee %</TableHead>
              <TableHead className="font-bold text-center">Style</TableHead>
              <TableHead className="font-bold text-right">YTD Ret</TableHead>
              <TableHead className="font-bold text-right">YTD Bench</TableHead>
              <TableHead className="font-bold text-right">1Y Ret</TableHead>
              <TableHead className="font-bold text-right">1Y Bench</TableHead>
              <TableHead className="font-bold text-right">3Y Ret</TableHead>
              <TableHead className="font-bold text-right">3Y Bench</TableHead>
              <TableHead className="font-bold text-right">5Y Ret</TableHead>
              <TableHead className="font-bold text-right">5Y Bench</TableHead>
              <TableHead className="font-bold text-right">Sharpe</TableHead>
              <TableHead className="font-bold text-right">IRR</TableHead>
              <TableHead className="font-bold text-right">Beta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelPerformanceData.map((model) => (
              <TableRow key={model.id} className="hover:bg-muted/50">
                <TableCell className="font-medium whitespace-nowrap">{model.manager}</TableCell>
                <TableCell className="whitespace-nowrap">{model.strategyName}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{model.aum}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{model.feePercent}</TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  <Badge variant={model.style === "Growth" ? "default" : model.style === "Value" ? "secondary" : "outline"} 
                         className={cn(
                            model.style === "Growth" && "bg-purple-500/70 hover:bg-purple-500/90 border-purple-400",
                            model.style === "Value" && "bg-blue-500/70 hover:bg-blue-500/90 border-blue-400",
                            model.style === "Fixed Income" && "bg-teal-500/70 hover:bg-teal-500/90 border-teal-400",
                            model.style === "Balanced" && "bg-amber-500/70 hover:bg-amber-500/90 border-amber-400",
                            "text-white"
                         )}
                  >
                    {model.style}
                  </Badge>
                </TableCell>
                <TableCell className={cn("text-right whitespace-nowrap font-semibold", getReturnClass(model.ytdReturn))}>{model.ytdReturn}</TableCell>
                <TableCell className="text-right whitespace-nowrap text-muted-foreground">{model.ytdBenchmark}</TableCell>
                <TableCell className={cn("text-right whitespace-nowrap font-semibold", getReturnClass(model.oneYearReturn))}>{model.oneYearReturn}</TableCell>
                <TableCell className="text-right whitespace-nowrap text-muted-foreground">{model.oneYearBenchmark}</TableCell>
                <TableCell className={cn("text-right whitespace-nowrap font-semibold", getReturnClass(model.threeYearReturn))}>{model.threeYearReturn}</TableCell>
                <TableCell className="text-right whitespace-nowrap text-muted-foreground">{model.threeYearBenchmark}</TableCell>
                <TableCell className={cn("text-right whitespace-nowrap font-semibold", getReturnClass(model.fiveYearReturn))}>{model.fiveYearReturn}</TableCell>
                <TableCell className="text-right whitespace-nowrap text-muted-foreground">{model.fiveYearBenchmark}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{model.sharpeRatio}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{model.irr}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{model.beta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-6">
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download PDF Summary
            </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}

