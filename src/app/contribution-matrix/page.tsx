
"use client";

import * as React from "react";
import { Download, TrendingUp, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  { id: "1", accountName: "John's Primary Roth", accountType: "Roth IRA", annualLimit: 7000, amountContributed: 3500, dueDate: getFutureDate(5) }, // Due soon
  { id: "2", accountName: "Jane's Traditional", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 7000, dueDate: getFutureDate(25) }, // Approaching
  { id: "3", accountName: "Business SEP", accountType: "SEP IRA", annualLimit: 66000, amountContributed: 25000, dueDate: getFutureDate(60) }, // Far out
  { id: "4", accountName: "Side Gig SIMPLE", accountType: "SIMPLE IRA", annualLimit: 16000, amountContributed: 8000, dueDate: getFutureDate(-5) }, // Past due
  { id: "5", accountName: "John's Rollover IRA", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 1000, dueDate: getFutureDate(90) }, // Far out
  { id: "6", accountName: "Spouse Roth", accountType: "Roth IRA", annualLimit: 7000, amountContributed: 0, dueDate: getFutureDate(1) }, // Due tomorrow
  { id: "7", accountName: "Emergency Fund IRA", accountType: "Traditional IRA", annualLimit: 7000, amountContributed: 3000, dueDate: getFutureDate(0) }, // Due today
];

const calculateMonthsLeft = (): number => {
  const currentMonth = new Date().getMonth(); // 0-11
  return Math.max(1, 11 - currentMonth); // Ensure at least 1 month for calculation if current month is December
};

interface DueDateInfo {
  mainDisplay: string;
  tooltipDate: string;
  colorClass: string;
}

const getDueDateInfo = (dueDateString: string): DueDateInfo => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const parsedDueDate = parseISO(dueDateString);

  if (!isValid(parsedDueDate)) {
    return { mainDisplay: "N/A", tooltipDate: "Invalid Date", colorClass: "text-muted-foreground" };
  }
  
  parsedDueDate.setHours(0,0,0,0); // Normalize due date to the start of the day for accurate comparison

  const daysRemaining = differenceInDays(parsedDueDate, today);
  let colorClass = "text-green-400"; // Default green
  let mainDisplay: string;

  if (daysRemaining < 0) {
    colorClass = "text-red-400";
    mainDisplay = `${Math.abs(daysRemaining)}d past`;
  } else if (daysRemaining === 0) {
    colorClass = "text-red-400";
    mainDisplay = "Today";
  } else if (daysRemaining === 1) {
    colorClass = "text-red-400";
    mainDisplay = "1d left";
  } else if (daysRemaining <= 7) {
    colorClass = "text-red-400";
    mainDisplay = `${daysRemaining}d left`;
  } else if (daysRemaining <= 30) {
    colorClass = "text-yellow-400";
    mainDisplay = `${daysRemaining}d left`;
  } else {
    // Default for > 30 days
    mainDisplay = `${daysRemaining}d left`;
  }

  return {
    mainDisplay,
    tooltipDate: format(parsedDueDate, "MMM dd, yyyy"),
    colorClass,
  };
};


export default function ContributionMatrixPage() {
  const [accounts, setAccounts] = React.useState<ContributionAccount[]>(initialContributionAccounts);
  const [mavenQuery, setMavenQuery] = React.useState("");
  const [mavenResponse, setMavenResponse] = React.useState<string | null>(null);
  const [isLoadingMaven, setIsLoadingMaven] = React.useState(false);
  const { toast } = useToast();

  const handleContributionChange = (accountId: string, newAmount: string) => {
    const numericAmount = parseInt(newAmount, 10);
    if (isNaN(numericAmount) && newAmount !== "") return; 

    setAccounts(prevAccounts =>
      prevAccounts.map(acc => {
        if (acc.id === accountId) {
          let contributed = newAmount === "" ? 0 : numericAmount;
          if (contributed > acc.annualLimit) {
            toast({
              title: "Contribution Exceeds Limit",
              description: `Contribution for ${acc.accountName} cannot exceed $${acc.annualLimit.toLocaleString()}.`,
              variant: "destructive",
            });
            contributed = acc.annualLimit;
          } else if (contributed < 0) {
            contributed = 0;
          }
          return { ...acc, amountContributed: contributed };
        }
        return acc;
      })
    );
  };

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
              <TableHead className="font-bold min-w-[180px]">Progress (%)</TableHead>
              <TableHead className="font-bold text-right whitespace-nowrap">Monthly to Max-Out</TableHead>
              <TableHead className="font-bold text-right whitespace-nowrap">Due Date</TableHead>
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
                    <Input
                      type="number"
                      value={account.amountContributed.toString()} 
                      onChange={(e) => handleContributionChange(account.id, e.target.value)}
                      className="h-8 text-right bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                      min="0"
                      max={account.annualLimit}
                    />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">${remaining.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={progressPercent}
                        className={cn(
                          "h-3 flex-grow",
                           progressPercent >= 80 ? "[&>div]:bg-[hsl(var(--chart-3))]" : 
                           progressPercent >= 40 ? "[&>div]:bg-[hsl(var(--chart-4))]" :
                                                 "[&>div]:bg-[hsl(var(--chart-5))]"
                        )}
                        aria-label={`Progress ${progressPercent.toFixed(0)}%`}
                      />
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">{progressPercent.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {monthlyToMax > 0 && progressPercent < 100 ? `$${monthlyToMax.toFixed(2)}/mo` : (progressPercent >= 100 ? "Maxed Out" : "N/A")}
                  </TableCell>
                  <TableCell className={cn("text-right whitespace-nowrap font-medium", dueDateInfo.colorClass)}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{dueDateInfo.mainDisplay}</span>
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

      <PlaceholderCard title="Ask Maven (Contribution Assistant)">
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

