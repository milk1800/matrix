
"use client";

import * as React from "react";
import { Download, TrendingUp, MessageSquare, Loader2, AlertTriangle, PieChart } from 'lucide-react';
import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircularProgressRing } from "@/components/ui/circular-progress-ring";
import { AccountTypeProgressRing } from "@/components/charts/account-type-progress-ring"; // New import

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
  const currentMonth = new Date().getMonth(); 
  return Math.max(1, 12 - (currentMonth + 1)); 
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

const MOCK_FEE_RATE = 0.01; 

const IRA_TYPES_ORDER: AccountType[] = ['Roth IRA', 'Traditional IRA', 'SEP IRA', 'SIMPLE IRA'];


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
  
  const aggregatedDataByType = React.useMemo(() => {
    const result: Record<AccountType, { 
      totalRemaining: number; 
      totalOpportunity: number; 
      totalLimit: number;
      totalContributed: number;
      percentageFunded: number;
    }> = {
      "Traditional IRA": { totalRemaining: 0, totalOpportunity: 0, totalLimit: 0, totalContributed: 0, percentageFunded: 0 },
      "Roth IRA": { totalRemaining: 0, totalOpportunity: 0, totalLimit: 0, totalContributed: 0, percentageFunded: 0 },
      "SEP IRA": { totalRemaining: 0, totalOpportunity: 0, totalLimit: 0, totalContributed: 0, percentageFunded: 0 },
      "SIMPLE IRA": { totalRemaining: 0, totalOpportunity: 0, totalLimit: 0, totalContributed: 0, percentageFunded: 0 },
    };

    accounts.forEach(acc => {
      const remaining = Math.max(0, acc.annualLimit - acc.amountContributed);
      result[acc.accountType].totalRemaining += remaining;
      result[acc.accountType].totalOpportunity += remaining * MOCK_FEE_RATE;
      result[acc.accountType].totalLimit += acc.annualLimit;
      result[acc.accountType].totalContributed += acc.amountContributed;
    });

    return IRA_TYPES_ORDER.map(type => {
      const data = result[type];
      const percentageFunded = data.totalLimit > 0 ? (data.totalContributed / data.totalLimit) * 100 : 0;
      return {
        name: type,
        ...data,
        percentageFunded: parseFloat(percentageFunded.toFixed(1)),
      };
    });
  }, [accounts]);


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
                  <TableCell className="text-right text-foreground">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {aggregatedDataByType.map((item) => (
          <PlaceholderCard 
            key={item.name} 
            title={item.name} 
            className="flex flex-col items-center text-center"
          >
            <AccountTypeProgressRing 
              progress={item.percentageFunded} 
              accountType={item.name as AccountType} 
              size={150} 
              strokeWidth={12} 
            />
            <p className="text-3xl font-bold text-foreground mt-3">
              {item.percentageFunded.toFixed(1)}% <span className="text-base font-normal text-muted-foreground">Funded</span>
            </p>
            <p className="text-sm text-green-400 mt-1">
              +${item.totalOpportunity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} fee potential left
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (${item.totalRemaining.toLocaleString()} remaining contribution)
            </p>
          </PlaceholderCard>
        ))}
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
