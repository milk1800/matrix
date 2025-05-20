
"use client";

import * as React from "react";
import { Download, TrendingUp, MessageSquare, Loader2, AlertTriangle, PieChart } from 'lucide-react'; // Removed BarChart2
import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircularProgressRing } from "@/components/ui/circular-progress-ring";
import { OverallContributionDonutChart } from "@/components/charts/overall-contribution-donut-chart";
// Removed: import { RevenueOpportunityBarChart } from "@/components/charts/revenue-opportunity-bar-chart";

type AccountType = 'Traditional IRA' | 'Roth IRA' | 'SEP IRA' | 'SIMPLE IRA';

interface ContributionAccount {
  id: string;
  accountName: string;
  accountType: AccountType;
  annualLimit: number;
  amountContributed: number;
  dueDate: string; // YYYY-MM-DD format
}

const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return format(date, 'yyyy-MM-dd');
};

const initialContributionAccounts: ContributionAccount[] = [
  { id: "1", accountName: "John's Primary Roth", accountType: "Roth IRA", annualLimit: 7000, amountContributed: 3500, dueDate: getFutureDate(3) },
  { id: "2", accountName: "Jane's Traditional", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 7000, dueDate: getFutureDate(25) },
  { id: "3", accountName: "Business SEP", accountType: "SEP IRA", annualLimit: 66000, amountContributed: 25000, dueDate: getFutureDate(60) },
  { id: "4", accountName: "Side Gig SIMPLE", accountType: "SIMPLE IRA", annualLimit: 16000, amountContributed: 8000, dueDate: getFutureDate(-5) },
  { id: "5", accountName: "John's Rollover IRA", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 1000, dueDate: getFutureDate(90) },
  { id: "6", accountName: "Spouse Roth", accountType: "Roth IRA", annualLimit: 7000, amountContributed: 0, dueDate: getFutureDate(1) },
  { id: "7", accountName: "Emergency Fund IRA", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 3000, dueDate: getFutureDate(0) },
  { id: "8", accountName: "College Fund IRA", accountType: "Roth IRA", annualLimit: 7000, amountContributed: 1500, dueDate: getFutureDate(14) },
  { id: "9", accountName: "Retirement Plus", accountType: "SEP IRA", annualLimit: 66000, amountContributed: 60000, dueDate: getFutureDate(40) },
  { id: "10", accountName: "Travel Savings IRA", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 500, dueDate: getFutureDate(180) },
];

const calculateMonthsLeft = (): number => {
  const currentMonth = new Date().getMonth(); // 0-11
  return Math.max(1, 11 - currentMonth); 
};

interface DueDateInfo {
  mainDisplay: string;
  tooltipDate: string;
  boxClassName: string;
  pulseClassName: string;
}

const getDueDateInfo = (dueDateString: string): DueDateInfo => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const parsedDueDate = parseISO(dueDateString);

  if (!isValid(parsedDueDate)) {
    return { mainDisplay: "N/A", tooltipDate: "Invalid Date", boxClassName: "bg-gray-400 text-black", pulseClassName: "" };
  }
  
  parsedDueDate.setHours(0,0,0,0); 

  const daysRemaining = differenceInDays(parsedDueDate, today);
  let mainDisplay: string;
  let boxClassName: string;
  let pulseClassName = "";

  if (daysRemaining < 0) {
    mainDisplay = `${Math.abs(daysRemaining)}d past`;
    boxClassName = "bg-red-500 text-white";
    pulseClassName = "due-pulse";
  } else if (daysRemaining === 0) {
    mainDisplay = "Today";
    boxClassName = "bg-red-500 text-white";
    pulseClassName = "due-pulse";
  } else if (daysRemaining <= 5) {
    mainDisplay = `${daysRemaining}d left`;
    boxClassName = "bg-red-500 text-white";
    pulseClassName = "due-pulse";
  } else if (daysRemaining < 15) {
    mainDisplay = `${daysRemaining}d left`;
    boxClassName = "bg-red-500 text-white"; 
  } else if (daysRemaining <= 45) {
    mainDisplay = `${daysRemaining}d left`;
    boxClassName = "bg-yellow-400 text-black";
  } else {
    mainDisplay = `${daysRemaining}d left`;
    boxClassName = "bg-green-500 text-white";
  }

  return {
    mainDisplay,
    tooltipDate: format(parsedDueDate, "MMM dd, yyyy"),
    boxClassName,
    pulseClassName,
  };
};

const MOCK_FEE_RATE = 0.01; // 1%

const accountTypeColors: Record<AccountType, string> = {
  'Traditional IRA': "hsl(var(--chart-1))", // Primary Accent - Purple
  'Roth IRA': "hsl(var(--chart-2))", // Secondary Accent - Blue/Teal
  'SEP IRA': "hsl(var(--chart-3))", // Green
  'SIMPLE IRA': "hsl(var(--chart-4))", // Yellow/Orange
};


export default function ContributionMatrixPage() {
  const accounts = initialContributionAccounts;
  const [mavenQuery, setMavenQuery] = React.useState("");
  const [mavenResponse, setMavenResponse] = React.useState<string | null>(null);
  const [isLoadingMaven, setIsLoadingMaven] = React.useState(false);

  const handleAskMaven = async () => {
    if (!mavenQuery.trim()) return;
    setIsLoadingMaven(true);
    setMavenResponse(null);
    await new Promise(resolve => setTimeout(resolve, 1500));

    let responseText = "I'm not sure how to answer that. Try asking about maxing out a specific IRA type.";
    if (mavenQuery.toLowerCase().includes("max out my roth")) {
      const rothAccount = accounts.find(acc => acc.accountType === "Roth IRA");
      if (rothAccount) {
        const remaining = rothAccount.annualLimit - rothAccount.amountContributed;
        if (remaining > 0) {
          responseText = `To max out your Roth IRA (${rothAccount.accountName}), you need to contribute $${remaining.toLocaleString()} more this year.`;
        } else {
          responseText = `Your Roth IRA (${rothAccount.accountName}) is already maxed out for the year!`;
        }
      } else {
        responseText = "You don't seem to have a Roth IRA account listed.";
      }
    }
    setMavenResponse(responseText);
    setIsLoadingMaven(false);
  };

  const monthsLeft = calculateMonthsLeft();

  const overallContributionData = React.useMemo(() => {
    const totalContributed = accounts.reduce((sum, acc) => sum + acc.amountContributed, 0);
    const totalLimit = accounts.reduce((sum, acc) => sum + acc.annualLimit, 0);
    return { totalContributed, totalLimit };
  }, [accounts]);
  
  const aggregatedOpportunityByType = React.useMemo(() => {
    const opportunityByType: Record<AccountType, { totalRemaining: number; totalOpportunity: number }> = {
      "Traditional IRA": { totalRemaining: 0, totalOpportunity: 0 },
      "Roth IRA": { totalRemaining: 0, totalOpportunity: 0 },
      "SEP IRA": { totalRemaining: 0, totalOpportunity: 0 },
      "SIMPLE IRA": { totalRemaining: 0, totalOpportunity: 0 },
    };

    accounts.forEach(acc => {
      const remaining = Math.max(0, acc.annualLimit - acc.amountContributed);
      opportunityByType[acc.accountType].totalRemaining += remaining;
      opportunityByType[acc.accountType].totalOpportunity += remaining * MOCK_FEE_RATE;
    });

    return (Object.keys(opportunityByType) as AccountType[]).map(type => ({
      name: type,
      opportunity: opportunityByType[type].totalOpportunity,
      remainingContribution: opportunityByType[type].totalRemaining,
      accountType: type,
    })).filter(item => item.opportunity > 0 || item.remainingContribution > 0); // Ensure all types with potential or limits are shown
  }, [accounts]);

  const overallTotalRemainingContributions = React.useMemo(() => {
    return aggregatedOpportunityByType.reduce((sum, item) => sum + item.remainingContribution, 0);
  }, [aggregatedOpportunityByType]);

  const overallTotalRevenueOpportunity = React.useMemo(() => {
    return aggregatedOpportunityByType.reduce((sum, item) => sum + item.opportunity, 0);
  }, [aggregatedOpportunityByType]);

  const topIraTypeByOpportunity = React.useMemo(() => {
    if (aggregatedOpportunityByType.length === 0 || overallTotalRevenueOpportunity === 0) {
      return { name: "N/A", percentage: 0 };
    }
    const sortedTypes = [...aggregatedOpportunityByType].sort((a, b) => b.opportunity - a.opportunity);
    const topType = sortedTypes[0];
    const percentage = (topType.opportunity / overallTotalRevenueOpportunity) * 100;
    return { name: topType.name, percentage: parseFloat(percentage.toFixed(1)) };
  }, [aggregatedOpportunityByType, overallTotalRevenueOpportunity]);


  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Contribution Matrix</h1>
      
      <PlaceholderCard title="IRA Contribution Overview" className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Account Name</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold text-right">Annual Limit</TableHead>
              <TableHead className="font-bold text-right w-40">Contributed</TableHead>
              <TableHead className="font-bold text-right">Remaining</TableHead>
              <TableHead className="font-bold min-w-[180px] text-center">Progress (%)</TableHead>
              <TableHead className="font-bold text-right whitespace-nowrap">Monthly to Max-Out</TableHead>
              <TableHead className="font-bold text-center whitespace-nowrap">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const remaining = account.annualLimit - account.amountContributed;
              const progressPercent = account.annualLimit > 0 ? Math.min(100, Math.max(0,(account.amountContributed / account.annualLimit) * 100)) : 0;
              const monthlyToMax = remaining > 0 && monthsLeft > 0 ? (remaining / monthsLeft) : 0;
              const dueDateInfo = getDueDateInfo(account.dueDate);

              return (
                <TableRow key={account.id}>
                  <TableCell className="font-medium whitespace-nowrap">{account.accountName}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{account.accountType}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">${account.annualLimit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span>${account.amountContributed.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">${remaining.toLocaleString()}</TableCell>
                  <TableCell className="flex justify-center items-center">
                     <CircularProgressRing progress={progressPercent} size={48} strokeWidth={5} />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {monthlyToMax > 0 && progressPercent < 100 ? `$${monthlyToMax.toFixed(2)}/mo` : (progressPercent >= 100 ? "Maxed Out" : "N/A")}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={cn("due-box", dueDateInfo.boxClassName, dueDateInfo.pulseClassName)}>
                            {dueDateInfo.mainDisplay}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{dueDateInfo.tooltipDate}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end items-center gap-4 mt-6">
          <Button variant="outline" className="rounded-md">
            <Download className="mr-2 h-4 w-4" /> Download Contribution Summary
          </Button>
        </div>
      </PlaceholderCard>

      {overallTotalRevenueOpportunity > 0 && (
        <PlaceholderCard 
            title="Smart Contribution Insights" 
            icon={AlertTriangle} 
            className="border-yellow-500/50 shadow-yellow-500/10 hover:shadow-yellow-500/20"
        >
            <div className="space-y-3 text-foreground">
                <p className="text-xl font-semibold text-yellow-400">
                    🚨 You’re Leaving ${overallTotalRevenueOpportunity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} in Revenue on the Table
                </p>
                <p>
                    Across your book of business, <span className="font-bold text-white">${overallTotalRemainingContributions.toLocaleString()}</span> in eligible retirement contributions remain unfunded.
                </p>
                <p>
                    Maxing out these accounts before year-end could generate an additional <span className="font-bold text-green-400">${overallTotalRevenueOpportunity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span> in advisory fees.
                </p>
                {topIraTypeByOpportunity.name !== "N/A" && (
                    <p className="font-semibold">
                        ✅ <span className="text-primary">{topIraTypeByOpportunity.name}</span> accounts make up <span className="text-white">{topIraTypeByOpportunity.percentage}%</span> of this opportunity.
                    </p>
                )}
                <p className="text-sm text-muted-foreground">
                    🔔 Prioritize discussions around these account types to help clients optimize their savings and close the advisory gap.
                </p>
                 <div className="flex justify-end pt-2">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                        View Clients with Unfunded IRAs
                    </Button>
                </div>
            </div>
        </PlaceholderCard>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <PlaceholderCard title="Overall Contribution Status" icon={PieChart}>
          <div className="h-[350px] md:h-[400px] w-full">
            {accounts.length > 0 ? (
              <OverallContributionDonutChart
                totalContributed={overallContributionData.totalContributed}
                totalLimit={overallContributionData.totalLimit}
              />
            ) : (
              <p className="text-muted-foreground text-center flex items-center justify-center h-full">No contribution data available.</p>
            )}
          </div>
           <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing % of total IRA contribution limits funded across all accounts.
          </p>
        </PlaceholderCard>
        
        <PlaceholderCard 
          title="Revenue Opportunity by Account Type"
          description={ overallTotalRevenueOpportunity > 0 &&
            <span className="text-lg font-semibold text-green-400">
              Total Potential: ${overallTotalRevenueOpportunity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {aggregatedOpportunityByType.map((item) => (
                    <PlaceholderCard
                        key={item.name}
                        title={item.name}
                        className={cn(
                            "border-t-4",
                            item.name === topIraTypeByOpportunity.name && "shadow-primary/40 shadow-lg"
                        )}
                        style={{ borderTopColor: accountTypeColors[item.accountType as AccountType] || 'hsl(var(--border))' }}
                    >
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-foreground">
                                ${item.remainingContribution.toLocaleString()}
                                <span className="text-xs text-muted-foreground"> left</span>
                            </p>
                            <p className="text-sm text-green-400 font-medium">
                                +${item.opportunity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-xs text-muted-foreground"> fee potential</span>
                            </p>
                        </div>
                    </PlaceholderCard>
                ))}
                {aggregatedOpportunityByType.length === 0 && (
                     <p className="text-muted-foreground text-center md:col-span-2 flex items-center justify-center h-full py-10">
                        All accounts are maxed out or no contribution data available.
                    </p>
                )}
            </div>
            {overallTotalRevenueOpportunity > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Estimated based on remaining contributions and a {MOCK_FEE_RATE*100}% advisory fee. Grouped by IRA type.
            </p>
          )}
        </PlaceholderCard>
      </div>

      <PlaceholderCard title="Ask Maven (Contribution Assistant)" className="mt-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="maven-query-input" className="sr-only">Ask Maven</Label>
            <Input 
              id="maven-query-input"
              placeholder="e.g., How much more to max out my Roth?"
              value={mavenQuery}
              onChange={(e) => setMavenQuery(e.target.value)}
              className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
              disabled={isLoadingMaven}
            />
            <Button onClick={handleAskMaven} disabled={isLoadingMaven || !mavenQuery.trim()}>
              {isLoadingMaven ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              Ask
            </Button>
          </div>
          {isLoadingMaven && (
            <div className="flex items-center justify-center p-4 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              Maven is thinking...
            </div>
          )}
          {mavenResponse && !isLoadingMaven && (
            <div className="p-4 bg-muted/30 rounded-md text-foreground">
              <p className="font-semibold mb-1">Maven says:</p>
              <p>{mavenResponse}</p>
            </div>
          )}
        </div>
      </PlaceholderCard>
    </main>
  );
}

