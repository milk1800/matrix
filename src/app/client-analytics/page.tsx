
"use client"; // To enable potential future interactions and for consistency

import * as React from 'react';
import { Users, DollarSign, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

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
        <PlaceholderCard title="Client Acquisition Channels">
           <div className="h-[300px] md:h-[350px]"> {/* Adjusted height to match typical chart card height */}
            <PlaceholderChart dataAiHint="client acquisition channels line revenue" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
