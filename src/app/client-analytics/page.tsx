
"use client"; // To enable potential future interactions and for consistency

import * as React from 'react';
import { Users, DollarSign, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { ClientTypeByChannelChart } from '@/components/charts/client-type-by-channel-chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const metricCardsData = [
  { 
    title: "Total Active Clients", 
    value: "238", 
    description: <span className="text-green-400 text-sm">+5 new clients this month</span>, 
    icon: Users 
  },
  { 
    title: "Average AUM per Client", 
    value: "$51,872", 
    icon: DollarSign 
  },
  { 
    title: "Client Retention Rate", 
    value: "92%", 
    description: <span className="text-sm">Over the last 12 months</span>, 
    icon: TrendingUp 
  },
  { 
    title: "New vs. Lost Clients (QTD)", 
    value: "15 / 3", 
    description: <span className="text-sm">New clients / Lost clients</span>, 
    icon: ArrowRightLeft 
  },
];

const topClientsByAumData = [
  { rank: 1, name: "Client Alpha", aum: 4200000, aumDisplay: "$4.2M" },
  { rank: 2, name: "Client Bravo", aum: 3600000, aumDisplay: "$3.6M" },
  { rank: 3, name: "Client Charlie", aum: 3100000, aumDisplay: "$3.1M" },
  { rank: 4, name: "Client Delta", aum: 2800000, aumDisplay: "$2.8M" },
  { rank: 5, name: "Client Echo", aum: 2500000, aumDisplay: "$2.5M" },
  { rank: 6, name: "Client Foxtrot", aum: 2200000, aumDisplay: "$2.2M" },
  { rank: 7, name: "Client Golf", aum: 1900000, aumDisplay: "$1.9M" },
  { rank: 8, name: "Client Hotel", aum: 1600000, aumDisplay: "$1.6M" },
  { rank: 9, name: "Client India", aum: 1300000, aumDisplay: "$1.3M" },
  { rank: 10, name: "Client Juliett", aum: 1000000, aumDisplay: "$1.0M" },
];

const maxAum = Math.max(...topClientsByAumData.map(client => client.aum), 0);

interface Client65PlusData {
  id: string;
  clientName: string;
  age: number;
  aumDisplay: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryAge: number;
  relationshipDepthPercent: number;
  beneficiaryIsClient: boolean;
  multipleChildBeneficiaries: boolean;
}

const topClients65PlusWithChildBeneficiariesData: Client65PlusData[] = [
  { id: "c1", clientName: "Eleanor Vance", age: 72, aumDisplay: "$2.4M", primaryBeneficiaryName: "Michael Vance", primaryBeneficiaryAge: 34, relationshipDepthPercent: 85, beneficiaryIsClient: false, multipleChildBeneficiaries: true },
  { id: "c2", clientName: "Arthur Sterling", age: 68, aumDisplay: "$1.8M", primaryBeneficiaryName: "Sophia Sterling", primaryBeneficiaryAge: 29, relationshipDepthPercent: 70, beneficiaryIsClient: true, multipleChildBeneficiaries: false },
  { id: "c3", clientName: "Beatrice Holloway", age: 75, aumDisplay: "$3.1M", primaryBeneficiaryName: "James Holloway", primaryBeneficiaryAge: 40, relationshipDepthPercent: 95, beneficiaryIsClient: false, multipleChildBeneficiaries: true },
  { id: "c4", clientName: "Clarence Bellwether", age: 66, aumDisplay: "$1.2M", primaryBeneficiaryName: "Olivia Bellwether", primaryBeneficiaryAge: 31, relationshipDepthPercent: 60, beneficiaryIsClient: true, multipleChildBeneficiaries: false },
  { id: "c5", clientName: "Dorothy Finch", age: 80, aumDisplay: "$2.9M", primaryBeneficiaryName: "William Finch", primaryBeneficiaryAge: 45, relationshipDepthPercent: 75, beneficiaryIsClient: false, multipleChildBeneficiaries: false },
];

export default function ClientAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Client Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCardsData.map((card, index) => (
          <PlaceholderCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PlaceholderCard title="Top 10 Clients by AUM">
          <div className="space-y-3 mt-1">
            {topClientsByAumData.map((client) => {
              const barWidthPercentage = maxAum > 0 ? (client.aum / maxAum) * 100 : 0;
              return (
                <div key={client.rank} className="flex items-center justify-between py-2 border-b border-border/10 last:border-b-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground w-7 text-right mr-2">{client.rank}.</span>
                    <span className="text-base text-foreground truncate" title={client.name}>{client.name}</span>
                  </div>
                  <div className="flex items-center gap-3 w-2/5 sm:w-1/2">
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full" 
                        style={{ width: `${barWidthPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground min-w-[50px] text-right">{client.aumDisplay}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </PlaceholderCard>
        <PlaceholderCard title="Client Type by Channel">
           <div className="h-[300px] md:h-[350px]">
            <ClientTypeByChannelChart />
          </div>
        </PlaceholderCard>
      </div>

      <PlaceholderCard title="Top 10 Clients Age 65+ with Children as Beneficiaries" icon={Users}>
        <div className="space-y-4 mt-2">
          {topClients65PlusWithChildBeneficiariesData.map((client) => (
            <div key={client.id} className="p-3 rounded-md border border-border/20 hover:bg-muted/10 transition-colors duration-150 ease-out">
              <div className="flex justify-between items-start mb-1">
                <h4 className={cn("text-md font-semibold text-foreground", client.multipleChildBeneficiaries && "text-green-400")}>
                  {client.clientName} <span className="text-sm font-normal text-muted-foreground">({client.age})</span>
                </h4>
                <span className="text-sm font-semibold text-primary">{client.aumDisplay}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                Beneficiary: {client.primaryBeneficiaryName} ({client.primaryBeneficiaryAge})
                {!client.beneficiaryIsClient && (
                  <Badge variant="outline" className="ml-2 text-xs bg-yellow-500/10 border-yellow-500/50 text-yellow-400">Not Onboarded</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Relationship Depth: <span className="font-semibold text-primary">{client.relationshipDepthPercent}%</span>
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm">
            Start Next-Gen Outreach
          </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}
