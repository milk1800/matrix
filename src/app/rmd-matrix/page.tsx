
"use client";

import * as React from "react";
import { Download } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const allClientData = [
  {
    id: "1",
    clientName: "Johnathan 'Johnny' Doe",
    accountType: "Traditional IRA",
    ytdLimitDue: "$5,000 / $7,000",
    progressPercent: 71,
    suggestedMonthly: "$400.00/mo",
    rmdDue: "$12,000 / $6,000",
    daysLeft: 45,
  },
  {
    id: "2",
    clientName: "Alice Wonderland",
    accountType: "401(k)",
    ytdLimitDue: "$7,000 / $7,000",
    progressPercent: 100,
    suggestedMonthly: "N/A",
    rmdDue: "N/A",
    daysLeft: 120,
  },
  {
    id: "3",
    clientName: "Robert 'Robbie' Smith",
    accountType: "Roth IRA",
    ytdLimitDue: "$2,500 / $6,500",
    progressPercent: 38,
    suggestedMonthly: "$500.00/mo",
    rmdDue: "$8,000 / $3,000",
    daysLeft: 15,
  },
  {
    id: "4",
    clientName: "Eleanor Vance",
    accountType: "SEP IRA",
    ytdLimitDue: "$10,000 / $15,000",
    progressPercent: 67,
    suggestedMonthly: "$850.00/mo",
    rmdDue: "$25,000 / $10,000",
    daysLeft: 88,
  },
   {
    id: "5",
    clientName: "Michael 'Mikey' Cho",
    accountType: "Traditional IRA",
    ytdLimitDue: "$3,000 / $7,000",
    progressPercent: 43,
    suggestedMonthly: "$600.00/mo",
    rmdDue: "$15,000 / $7,500",
    daysLeft: 60,
  },
  {
    id: "6",
    clientName: "Sarah Connor",
    accountType: "Traditional IRA",
    ytdLimitDue: "$6,500 / $7,000",
    progressPercent: 93,
    suggestedMonthly: "$50.00/mo",
    rmdDue: "$9,000 / $4,500",
    daysLeft: 30,
  },
  {
    id: "7",
    clientName: "Bruce Wayne",
    accountType: "401(k)",
    ytdLimitDue: "$4,000 / $20,500",
    progressPercent: 20,
    suggestedMonthly: "$1,500.00/mo",
    rmdDue: "$50,000 / $25,000",
    daysLeft: 250,
  },
  {
    id: "8",
    clientName: "Diana Prince",
    accountType: "Roth IRA",
    ytdLimitDue: "$6,500 / $6,500",
    progressPercent: 100,
    suggestedMonthly: "N/A",
    rmdDue: "N/A",
    daysLeft: 180,
  },
  {
    id: "9",
    clientName: "Clark Kent",
    accountType: "SEP IRA",
    ytdLimitDue: "$12,000 / $15,000",
    progressPercent: 80,
    suggestedMonthly: "$300.00/mo",
    rmdDue: "$30,000 / $15,000",
    daysLeft: 90,
  },
  {
    id: "10",
    clientName: "Peter Parker",
    accountType: "Traditional IRA",
    ytdLimitDue: "$1,000 / $7,000",
    progressPercent: 14,
    suggestedMonthly: "$700.00/mo",
    rmdDue: "$5,000 / $2,500",
    daysLeft: 10,
  },
  {
    id: "11",
    clientName: "Tony Stark",
    accountType: "401(k)",
    ytdLimitDue: "$15,000 / $20,500",
    progressPercent: 73,
    suggestedMonthly: "$500.00/mo",
    rmdDue: "$100,000 / $50,000",
    daysLeft: 200,
  },
  {
    id: "12",
    clientName: "Natasha Romanoff",
    accountType: "Roth IRA",
    ytdLimitDue: "$3,000 / $6,500",
    progressPercent: 46,
    suggestedMonthly: "$350.00/mo",
    rmdDue: "$7,000 / $3,500",
    daysLeft: 75,
  },
  {
    id: "13",
    clientName: "Steve Rogers",
    accountType: "SEP IRA",
    ytdLimitDue: "$5,000 / $15,000",
    progressPercent: 33,
    suggestedMonthly: "$1,000.00/mo",
    rmdDue: "$20,000 / $10,000",
    daysLeft: 50,
  },
  {
    id: "14",
    clientName: "Thor Odinson",
    accountType: "Traditional IRA",
    ytdLimitDue: "$7,000 / $7,000",
    progressPercent: 100,
    suggestedMonthly: "N/A",
    rmdDue: "N/A",
    daysLeft: 300,
  },
  {
    id: "15",
    clientName: "Wanda Maximoff",
    accountType: "401(k)",
    ytdLimitDue: "$2,000 / $20,500",
    progressPercent: 10,
    suggestedMonthly: "$1,850.00/mo",
    rmdDue: "$18,000 / $9,000",
    daysLeft: 22,
  },
   {
    id: "16",
    clientName: "Vision 'Synth' Android",
    accountType: "Roth IRA",
    ytdLimitDue: "$1,500 / $6,500",
    progressPercent: 23,
    suggestedMonthly: "$500.00/mo",
    rmdDue: "$6,000 / $3,000",
    daysLeft: 5,
  },
];

const INITIAL_VISIBLE_COUNT = 10;
const CLIENTS_TO_LOAD_COUNT = 5;

export default function RMDMatrixPage() {
  const [visibleClientCount, setVisibleClientCount] = React.useState(INITIAL_VISIBLE_COUNT);

  const clientsToDisplay = allClientData.slice(0, visibleClientCount);
  const remainingClients = allClientData.length - visibleClientCount;

  const handleShowMore = () => {
    setVisibleClientCount(prevCount => 
      Math.min(prevCount + CLIENTS_TO_LOAD_COUNT, allClientData.length)
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">RMD Matrix Dashboard</h1>
      
      <PlaceholderCard title="Client RMD Overview" className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Client Name</TableHead>
              <TableHead className="font-bold">Account Type</TableHead>
              <TableHead className="font-bold whitespace-nowrap">YTD / Limit (Due)</TableHead>
              <TableHead className="font-bold min-w-[150px]">Progress</TableHead>
              <TableHead className="font-bold whitespace-nowrap">Suggested Monthly</TableHead>
              <TableHead className="font-bold whitespace-nowrap">RMD Due</TableHead>
              <TableHead className="font-bold text-center">Days Left</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsToDisplay.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium whitespace-nowrap">{client.clientName}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{client.accountType}</TableCell>
                <TableCell className="whitespace-nowrap">{client.ytdLimitDue}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={client.progressPercent}
                      className={cn(
                        "h-3 flex-grow",
                        client.progressPercent >= 80 ? "[&>div]:bg-[hsl(var(--chart-3))]" : // Green for >= 80%
                        client.progressPercent >= 40 ? "[&>div]:bg-[hsl(var(--chart-4))]" : // Yellow for >= 40% and < 80%
                        "[&>div]:bg-[hsl(var(--chart-5))]"  // Red for < 40%
                      )}
                      aria-label={`Progress ${client.progressPercent}%`}
                    />
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">{client.progressPercent}%</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{client.suggestedMonthly}</TableCell>
                <TableCell className="whitespace-nowrap">{client.rmdDue}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-semibold px-2.5 py-1 text-sm",
                      client.daysLeft < 30 ? "bg-red-500/20 border-red-500/50 text-red-400" : 
                      client.daysLeft < 90 ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" :
                      "bg-green-500/20 border-green-500/50 text-green-400"
                    )}
                  >
                    {client.daysLeft}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          {remainingClients > 0 && (
            <Button variant="outline" className="rounded-md w-full sm:w-auto" onClick={handleShowMore}>
              Show More Clients ({remainingClients} remaining)
            </Button>
          )}
          <Button variant="outline" className="rounded-md w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download All (Excel)
          </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}

