
"use client";

import * as React from "react";
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, Repeat as RepeatIcon, UserX, Activity, MessageSquare, FileDown, Filter, CalendarDays, ShieldAlert } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FlaggedActivity {
  id: string;
  accountName: string;
  accountType: "Managed" | "Non-Managed";
  tradesLast30Days: number;
  daysSinceLastTrade: number | null;
  complianceFlag: "Excessive Trading" | "No Activity" | "Trade Frequency Anomaly";
  flagDate: string;
  aiSuggestion: string;
}

const summaryCardsData = [
  { title: "Total Flagged Accounts", value: "12", icon: ShieldAlert, iconClassName: "text-red-400" },
  { title: "Excessive Trading", value: "3", icon: RepeatIcon, iconClassName: "text-red-400" },
  { title: "Inactive Managed Accounts", value: "5", icon: UserX, iconClassName: "text-yellow-400" },
  { title: "Trade Frequency Anomalies", value: "4", icon: Activity, iconClassName: "text-yellow-400" },
];

const flaggedActivityData: FlaggedActivity[] = [
  { id: "fa1", accountName: "Client Gamma - IRA", accountType: "Non-Managed", tradesLast30Days: 152, daysSinceLastTrade: 1, complianceFlag: "Excessive Trading", flagDate: "2024-10-20", aiSuggestion: "Review trading activity against client's risk profile and IPS." },
  { id: "fa2", accountName: "Client Delta - Trust", accountType: "Managed", tradesLast30Days: 0, daysSinceLastTrade: 45, complianceFlag: "No Activity", flagDate: "2024-10-18", aiSuggestion: "Contact client to discuss portfolio and reconfirm investment objectives." },
  { id: "fa3", accountName: "Client Epsilon - Joint", accountType: "Non-Managed", tradesLast30Days: 5, daysSinceLastTrade: 3, complianceFlag: "Trade Frequency Anomaly", flagDate: "2024-10-15", aiSuggestion: "Verify trades align with recent market news or client instructions." },
  { id: "fa4", accountName: "Client Zeta - Brokerage", accountType: "Managed", tradesLast30Days: 0, daysSinceLastTrade: 62, complianceFlag: "No Activity", flagDate: "2024-10-10", aiSuggestion: "Schedule portfolio review; ensure strategy alignment." },
  { id: "fa5", accountName: "Client Alpha - Roth IRA", accountType: "Non-Managed", tradesLast30Days: 98, daysSinceLastTrade: 2, complianceFlag: "Excessive Trading", flagDate: "2024-10-22", aiSuggestion: "Assess if self-directed trading aligns with stated goals." },
];

const getFlagBadgeVariant = (flag: FlaggedActivity["complianceFlag"]): "destructive" | "default" => {
  switch (flag) {
    case "Excessive Trading":
      return "destructive";
    case "No Activity":
    case "Trade Frequency Anomaly":
      return "default"; // Default for yellow/amber, can be customized further in globals.css if needed
    default:
      return "default";
  }
};

const getFlagBadgeClassName = (flag: FlaggedActivity["complianceFlag"]): string => {
    switch (flag) {
      case "Excessive Trading":
        return "bg-red-500/20 border-red-500/50 text-red-400";
      case "No Activity":
      case "Trade Frequency Anomaly":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      default:
        return "";
    }
  };


export default function ComplianceMatrixPage() {
  const [mavenQuery, setMavenQuery] = React.useState("");

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Compliance Matrix</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCardsData.map((card, index) => (
          <PlaceholderCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconClassName={card.iconClassName}
          />
        ))}
      </div>

      <PlaceholderCard title="Flagged Activity">
        <div className="flex flex-wrap gap-4 mb-4 items-center">
            <Select defaultValue="all_flags">
                <SelectTrigger className="w-full sm:w-auto bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
                <SelectValue placeholder="Filter by Flag Type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all_flags">All Flags</SelectItem>
                <SelectItem value="excessive_trading">Excessive Trading</SelectItem>
                <SelectItem value="no_activity">No Activity</SelectItem>
                <SelectItem value="trade_frequency">Trade Frequency Anomaly</SelectItem>
                </SelectContent>
            </Select>
             <Select defaultValue="all_accounts">
                <SelectTrigger className="w-full sm:w-auto bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
                <SelectValue placeholder="Filter by Account Type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all_accounts">All Account Types</SelectItem>
                <SelectItem value="managed">Managed</SelectItem>
                <SelectItem value="non_managed">Non-Managed</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
                <CalendarDays className="mr-2 h-4 w-4" /> Date Range
            </Button>
             <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="text-right">Trades (30d)</TableHead>
              <TableHead className="text-right">Days Since Last Trade</TableHead>
              <TableHead>Compliance Flag</TableHead>
              <TableHead>Flag Date</TableHead>
              <TableHead>AI Suggestion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedActivityData.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.accountName}</TableCell>
                <TableCell>{activity.accountType}</TableCell>
                <TableCell className="text-right">{activity.tradesLast30Days}</TableCell>
                <TableCell className="text-right">{activity.daysSinceLastTrade === null ? "N/A" : activity.daysSinceLastTrade}</TableCell>
                <TableCell>
                  <Badge variant={getFlagBadgeVariant(activity.complianceFlag)} className={getFlagBadgeClassName(activity.complianceFlag)}>
                    {activity.complianceFlag}
                  </Badge>
                </TableCell>
                <TableCell>{activity.flagDate}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{activity.aiSuggestion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PlaceholderCard>

      <PlaceholderCard title="Maven Compliance Assistant">
        <div className="space-y-4">
          <Input
            placeholder="Ask: Why was account XYZ123 flagged for excessive trading?"
            value={mavenQuery}
            onChange={(e) => setMavenQuery(e.target.value)}
            className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
          />
          <Button className="w-full sm:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" /> Ask Maven
          </Button>
          <div className="mt-4 p-4 bg-muted/30 rounded-md min-h-[100px]">
            <p className="text-sm text-muted-foreground italic">AI response and suggested actions will appear here...</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" />Generate Audit Notes</Button>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" />Export Flagged Summary (PDF)</Button>
          </div>
        </div>
      </PlaceholderCard>

    </main>
  );
}
