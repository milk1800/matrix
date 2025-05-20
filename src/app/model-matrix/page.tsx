
"use client";

import * as React from "react";
import { Download, UserCog, LibraryBig, FileText, TrendingUp, TrendingDown, DollarSign, SlidersHorizontal, FileDown, ChevronsUpDown, Brain, AlertTriangle } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlaceholderChart } from "@/components/dashboard/placeholder-chart";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModelData {
  id: string;
  manager: string;
  strategyName: string;
  aum: string; // Keep as string for original table, parse for comparison
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
    manager: "Blackrock", // Updated from Alpha Advisors
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
    manager: "Blackrock", // Updated from Alpha Advisors
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

const sandboxSelectedManagers = modelPerformanceData
  .filter(m => ["strat1", "strat2", "strat4"].includes(m.id))
  .map((m, index) => ({
    ...m,
    weight: index === 0 ? 50 : index === 1 ? 30 : 20, // Default weights: Blackrock 50%, Beta Capital 30%, Delta Asset Mgmt 20%
  }));


const getReturnClass = (returnValue: string) => {
  if (!returnValue || returnValue === "N/A") return 'text-muted-foreground';
  if (returnValue.startsWith('+')) return 'text-green-400';
  if (returnValue.startsWith('-')) return 'text-red-400';
  return 'text-foreground';
};

const parseAUM = (aumString: string): number => {
  if (!aumString || typeof aumString !== 'string') return 0;
  const value = parseFloat(aumString.replace('$', '').replace(/M/i, ''));
  if (isNaN(value)) return 0;
  if (aumString.toLowerCase().includes('m')) {
    return value * 1000000;
  }
  if (aumString.toLowerCase().includes('k')) {
    return value * 1000;
  }
  return value;
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

interface ComparisonCardData extends Omit<ModelData, 'aum' | 'id' | 'strategyName'> {
  strategies: string[];
  totalAum: number;
  programFeePercent: string;
  totalCostPercent: string;
}

const PROGRAM_FEE_PERCENT = 0.0020; // 0.20%

const parsePercentage = (str: string | null | undefined): number => {
  if (!str || typeof str !== 'string' || str === "N/A") return 0;
  return parseFloat(str.replace('%', '').replace(' p.a.', '')) / 100;
};

const parseFee = (str: string | null | undefined): number => {
  if (!str || typeof str !== 'string' || str === "N/A") return 0;
  return parseFloat(str.replace('%', '')) / 100;
};

const parseNumericString = (str: string | null | undefined): number => {
  if (!str || typeof str !== 'string' || str === "N/A") return 0;
  return parseFloat(str);
};

const formatPercentageDisplay = (num: number | null | undefined, digits: number = 1): string => {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  const percentage = num * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(digits)}%`;
};


export default function ModelMatrixPage() {
  const [selectedManagerNames, setSelectedManagerNames] = React.useState<string[]>([]);
  const [sandboxManagerWeights, setSandboxManagerWeights] = React.useState<Record<string, number>>(() => {
    const initialWeights: Record<string, number> = {};
    sandboxSelectedManagers.forEach(manager => {
      initialWeights[manager.id] = manager.weight;
    });
    return initialWeights;
  });
  const [blendedMetrics, setBlendedMetrics] = React.useState<any | null>(null);
  const [weightError, setWeightError] = React.useState<string | null>(null);


  const availableManagers = React.useMemo(() => {
    const managerNames = new Set(modelPerformanceData.map(model => model.manager));
    return Array.from(managerNames);
  }, []);

  const handleManagerSelect = (managerName: string) => {
    setSelectedManagerNames((prevSelected) => {
      if (prevSelected.includes(managerName)) {
        return prevSelected.filter(name => name !== managerName);
      } else {
        if (prevSelected.length < 3) {
          return [...prevSelected, managerName];
        }
        return prevSelected; // Max 3 selected
      }
    });
  };

  const comparisonCardsData: ComparisonCardData[] = React.useMemo(() => {
    return selectedManagerNames.map(managerName => {
      const managerStrategies = modelPerformanceData.filter(model => model.manager === managerName);
      if (managerStrategies.length === 0) {
        return {
          manager: managerName,
          strategies: ["N/A"],
          totalAum: 0,
          feePercent: "N/A",
          programFeePercent: `${(PROGRAM_FEE_PERCENT * 100).toFixed(2)}%`, 
          totalCostPercent: "N/A",
          style: "N/A",
          ytdReturn: "N/A", ytdBenchmark: "N/A",
          oneYearReturn: "N/A", oneYearBenchmark: "N/A",
          threeYearReturn: "N/A", threeYearBenchmark: "N/A",
          fiveYearReturn: "N/A", fiveYearBenchmark: "N/A",
          sharpeRatio: "N/A", irr: "N/A", beta: "N/A",
        };
      }

      const totalAum = managerStrategies.reduce((sum, strategy) => sum + parseAUM(strategy.aum), 0);
      const firstStrategy = managerStrategies[0];
      const advisoryFee = parseFee(firstStrategy.feePercent);
      const totalCost = advisoryFee + PROGRAM_FEE_PERCENT;

      return {
        manager: managerName,
        strategies: managerStrategies.map(s => s.strategyName),
        totalAum: totalAum,
        feePercent: firstStrategy.feePercent,
        programFeePercent: `${(PROGRAM_FEE_PERCENT * 100).toFixed(2)}%`,
        totalCostPercent: `${(totalCost * 100).toFixed(2)}%`,
        style: firstStrategy.style,
        ytdReturn: firstStrategy.ytdReturn, ytdBenchmark: firstStrategy.ytdBenchmark,
        oneYearReturn: firstStrategy.oneYearReturn, oneYearBenchmark: firstStrategy.oneYearBenchmark,
        threeYearReturn: firstStrategy.threeYearReturn, threeYearBenchmark: firstStrategy.threeYearBenchmark,
        fiveYearReturn: firstStrategy.fiveYearReturn, fiveYearBenchmark: firstStrategy.fiveYearBenchmark,
        sharpeRatio: firstStrategy.sharpeRatio,
        irr: firstStrategy.irr,
        beta: firstStrategy.beta,
      };
    });
  }, [selectedManagerNames]);

  const handleSandboxWeightChange = (managerId: string, newWeight: number) => {
    setSandboxManagerWeights(prevWeights => {
      const updatedWeights = { ...prevWeights, [managerId]: Math.max(0, Math.min(100, newWeight)) };
      let currentTotalWeight = Object.values(updatedWeights).reduce((sum, w) => sum + w, 0);

      if (currentTotalWeight > 100) {
        let overage = currentTotalWeight - 100;
        const otherManagerIds = sandboxSelectedManagers.map(m => m.id).filter(id => id !== managerId);
        
        // Sort other managers by weight descending, so we reduce from largest first
        otherManagerIds.sort((a, b) => (updatedWeights[b] || 0) - (updatedWeights[a] || 0));

        for (const otherId of otherManagerIds) {
          if (overage <= 0) break;
          const currentOtherWeight = updatedWeights[otherId] || 0;
          const reduction = Math.min(overage, currentOtherWeight);
          updatedWeights[otherId] = currentOtherWeight - reduction;
          overage -= reduction;
        }
        // If still over, cap the initially changed manager's weight
        if (overage > 0) {
           updatedWeights[managerId] = (updatedWeights[managerId] || 0) - overage;
           if(updatedWeights[managerId] < 0) updatedWeights[managerId] = 0; // Ensure it doesn't go negative
        }
      }
      return updatedWeights;
    });
  };

  React.useEffect(() => {
    const totalCurrentWeight = Object.values(sandboxManagerWeights).reduce((sum, weight) => sum + weight, 0);

    if (Math.abs(totalCurrentWeight - 100) > 0.1) { // Allow for small float discrepancies
      setWeightError("Total weight must be 100%.");
      setBlendedMetrics(null);
      return;
    }
    setWeightError(null);

    let blendedYtdReturn = 0;
    let blendedOneYearReturn = 0;
    let blendedThreeYearReturn = 0;
    let blendedFiveYearReturn = 0;
    let blendedSharpeRatio = 0;
    let blendedIrr = 0;
    let blendedBeta = 0;
    let blendedTotalCost = 0;

    sandboxSelectedManagers.forEach(manager => {
      const weight = (sandboxManagerWeights[manager.id] || 0) / 100;
      if (weight === 0) return;

      blendedYtdReturn += parsePercentage(manager.ytdReturn) * weight;
      blendedOneYearReturn += parsePercentage(manager.oneYearReturn) * weight;
      blendedThreeYearReturn += parsePercentage(manager.threeYearReturn) * weight;
      blendedFiveYearReturn += parsePercentage(manager.fiveYearReturn) * weight;
      blendedSharpeRatio += parseNumericString(manager.sharpeRatio) * weight;
      blendedIrr += parsePercentage(manager.irr) * weight;
      blendedBeta += parseNumericString(manager.beta) * weight;
      blendedTotalCost += (parseFee(manager.feePercent) + PROGRAM_FEE_PERCENT) * weight;
    });

    setBlendedMetrics({
      ytdReturn: blendedYtdReturn,
      oneYearReturn: blendedOneYearReturn,
      threeYearReturn: blendedThreeYearReturn,
      fiveYearReturn: blendedFiveYearReturn,
      sharpeRatio: blendedSharpeRatio,
      irr: blendedIrr,
      beta: blendedBeta,
      totalCost: blendedTotalCost,
    });

  }, [sandboxManagerWeights]);


  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Model Matrix</h1>

      <PlaceholderCard title="Manager Comparison Tool">
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <ChevronsUpDown className="mr-2 h-4 w-4" />
                Select Managers ({selectedManagerNames.length}/3)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover text-popover-foreground">
              <DropdownMenuLabel>Available Managers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableManagers.map((managerName) => (
                <DropdownMenuCheckboxItem
                  key={managerName}
                  checked={selectedManagerNames.includes(managerName)}
                  onCheckedChange={() => handleManagerSelect(managerName)}
                  disabled={!selectedManagerNames.includes(managerName) && selectedManagerNames.length >= 3}
                >
                  {managerName}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedManagerNames.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {comparisonCardsData.map((data) => (
              <PlaceholderCard key={data.manager} title={data.manager} className="flex flex-col">
                <div className="space-y-3 text-sm flex-grow">
                  <p><strong className="text-muted-foreground">Strategies:</strong> {data.strategies.join(", ")}</p>
                  <p><strong className="text-muted-foreground">Total AUM:</strong> {formatCurrency(data.totalAum)}</p>
                  <p><strong className="text-muted-foreground">Advisory Fee:</strong> {data.feePercent}</p>
                  <p><strong className="text-muted-foreground">Program Fee:</strong> {data.programFeePercent}</p>
                  <p><strong className="text-muted-foreground">Total Cost:</strong> {data.totalCostPercent}</p>
                  <p><strong className="text-muted-foreground">Style:</strong> <Badge variant="outline" className={cn(
                      data.style === "Growth" && "bg-purple-500/70 hover:bg-purple-500/90 border-purple-400 text-white",
                      data.style === "Value" && "bg-blue-500/70 hover:bg-blue-500/90 border-blue-400 text-white",
                      data.style === "Fixed Income" && "bg-teal-500/70 hover:bg-teal-500/90 border-teal-400 text-white",
                      data.style === "Balanced" && "bg-amber-500/70 hover:bg-amber-500/90 border-amber-400 text-white",
                      data.style.startsWith("Sector") && "bg-pink-500/70 hover:bg-pink-500/90 border-pink-400 text-white"
                    )}>{data.style}</Badge>
                  </p>
                  <h4 className="font-semibold text-base mt-3 pt-2 border-t border-border/50">Performance:</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>YTD: <span className={getReturnClass(data.ytdReturn)}>{data.ytdReturn}</span></span>
                    <span className="text-muted-foreground">Bench: {data.ytdBenchmark}</span>
                    <span>1Y: <span className={getReturnClass(data.oneYearReturn)}>{data.oneYearReturn}</span></span>
                    <span className="text-muted-foreground">Bench: {data.oneYearBenchmark}</span>
                    <span>3Y: <span className={getReturnClass(data.threeYearReturn)}>{data.threeYearReturn}</span></span>
                    <span className="text-muted-foreground">Bench: {data.threeYearBenchmark}</span>
                    <span>5Y: <span className={getReturnClass(data.fiveYearReturn)}>{data.fiveYearReturn}</span></span>
                    <span className="text-muted-foreground">Bench: {data.fiveYearBenchmark}</span>
                  </div>
                   <h4 className="font-semibold text-base mt-3 pt-2 border-t border-border/50">Risk Metrics:</h4>
                   <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                        <div><strong className="text-muted-foreground block text-xs">Sharpe</strong>{data.sharpeRatio}</div>
                        <div><strong className="text-muted-foreground block text-xs">Beta</strong>{data.beta}</div>
                        <div><strong className="text-muted-foreground block text-xs">IRR</strong>{data.irr}</div>
                   </div>
                </div>
              </PlaceholderCard>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
                <p className="text-muted-foreground text-sm">Time Frame:</p>
                <Button variant="outline" size="sm" disabled>YTD</Button>
                <Button variant="ghost" size="sm" disabled>1Y</Button>
                <Button variant="ghost" size="sm" disabled>3Y</Button>
                <Button variant="ghost" size="sm" disabled>5Y</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
                <p className="text-muted-foreground text-sm">Sort by:</p>
                <Button variant="outline" size="sm" disabled>Performance</Button>
                <Button variant="ghost" size="sm" disabled>Fee</Button>
                <Button variant="ghost" size="sm" disabled>Risk</Button>
            </div>
             <div className="flex justify-end mt-4">
                <Button variant="outline" disabled>
                    <FileDown className="mr-2 h-4 w-4" /> Download Comparison PDF
                </Button>
            </div>
        </div>
      </PlaceholderCard>
      
      <PlaceholderCard title="Model Strategy Performance Matrix (All Strategies)" className="overflow-x-auto mt-8">
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
                            model.style.startsWith("Sector") && "bg-pink-500/70 hover:bg-pink-500/90 border-pink-400",
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

      <PlaceholderCard title="Model Rebalancing Sandbox" className="mt-8">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Select managers from the matrix above or search to add them to the sandbox (max 3-5). 
            Adjust weights to simulate blended portfolio metrics.
          </p>
          
          {weightError && (
            <div className="flex items-center p-3 text-sm text-red-400 bg-red-500/10 border border-red-400/50 rounded-md">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {weightError}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Selected Managers for Rebalancing</h3>
            {sandboxSelectedManagers.map((manager) => (
              <div key={manager.id} className="p-4 rounded-md border border-border/50 bg-black/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{manager.manager}</p>
                    <p className="text-xs text-muted-foreground">{manager.strategyName}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                      manager.style === "Growth" && "bg-purple-500/70 hover:bg-purple-500/90 border-purple-400 text-white",
                      manager.style === "Value" && "bg-blue-500/70 hover:bg-blue-500/90 border-blue-400 text-white",
                      manager.style === "Fixed Income" && "bg-teal-500/70 hover:bg-teal-500/90 border-teal-400 text-white",
                      manager.style === "Balanced" && "bg-amber-500/70 hover:bg-amber-500/90 border-amber-400 text-white",
                      manager.style.startsWith("Sector") && "bg-pink-500/70 hover:bg-pink-500/90 border-pink-400 text-white"
                    )}>{manager.style}</Badge>
                </div>
                <div>
                  <Label htmlFor={`weight-slider-${manager.id}`} className="text-xs text-muted-foreground">
                    Weight: {sandboxManagerWeights[manager.id] || 0}%
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      id={`weight-slider-${manager.id}`}
                      value={[sandboxManagerWeights[manager.id] || 0]}
                      max={100}
                      step={1}
                      className="w-[70%]"
                      onValueChange={(value) => handleSandboxWeightChange(manager.id, value[0])}
                      aria-label={`Weight for ${manager.strategyName}`}
                    />
                    <Input
                      type="number"
                      value={sandboxManagerWeights[manager.id] || 0}
                      onChange={(e) => handleSandboxWeightChange(manager.id, parseInt(e.target.value, 10) || 0)}
                      className="w-[30%] h-8 text-xs bg-input border-border/50 text-foreground"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            ))}
             {sandboxSelectedManagers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No managers selected for rebalancing.</p>
            )}
          </div>

          <PlaceholderCard title="Simulated Blended Metrics" className="bg-black/30">
             {blendedMetrics ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div><strong className="text-muted-foreground block">YTD Return:</strong> <span className={getReturnClass(formatPercentageDisplay(blendedMetrics.ytdReturn))}>{formatPercentageDisplay(blendedMetrics.ytdReturn)}</span></div>
                    <div><strong className="text-muted-foreground block">1Y Return:</strong> <span className={getReturnClass(formatPercentageDisplay(blendedMetrics.oneYearReturn))}>{formatPercentageDisplay(blendedMetrics.oneYearReturn)}</span></div>
                    <div><strong className="text-muted-foreground block">3Y Return:</strong> <span className={getReturnClass(formatPercentageDisplay(blendedMetrics.threeYearReturn))}>{formatPercentageDisplay(blendedMetrics.threeYearReturn)} p.a.</span></div>
                    <div><strong className="text-muted-foreground block">5Y Return:</strong> <span className={getReturnClass(formatPercentageDisplay(blendedMetrics.fiveYearReturn))}>{formatPercentageDisplay(blendedMetrics.fiveYearReturn)} p.a.</span></div>
                    <div><strong className="text-muted-foreground block">Sharpe Ratio:</strong> {blendedMetrics.sharpeRatio?.toFixed(2) ?? "N/A"}</div>
                    <div><strong className="text-muted-foreground block">IRR:</strong> {formatPercentageDisplay(blendedMetrics.irr)}</div>
                    <div><strong className="text-muted-foreground block">Beta:</strong> {blendedMetrics.beta?.toFixed(2) ?? "N/A"}</div>
                    <div className="md:col-span-2"><strong className="text-muted-foreground block">Weighted Total Cost:</strong> {formatPercentageDisplay(blendedMetrics.totalCost, 2)}</div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Adjust weights to 100% to see blended metrics.</p>
            )}
          </PlaceholderCard>

          <PlaceholderCard title="Blended Performance Visualization">
            <div className="h-[300px]">
              <PlaceholderChart dataAiHint="blended portfolio performance comparison bar" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                Chart will compare original vs. simulated allocation if applicable.
            </p>
          </PlaceholderCard>

          <div className="flex justify-end mt-6">
            <Button variant="outline" disabled={!!weightError || Object.values(sandboxManagerWeights).reduce((sum, w) => sum + w, 0) !== 100}>
              <FileDown className="mr-2 h-4 w-4" /> Download Scenario PDF
            </Button>
          </div>
        </div>
      </PlaceholderCard>
    </main>
  );
}

      