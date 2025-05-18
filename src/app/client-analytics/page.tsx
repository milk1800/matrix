
import { Users, DollarSign, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function ClientAnalyticsPage() {
  const metricCardsData = [
    { 
      title: "Total Active Clients", 
      value: "238", 
      description: <span className="text-green-400">+5 new clients this month</span>, 
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
      description: "Over the last 12 months", 
      icon: TrendingUp 
    },
    { 
      title: "New vs. Lost Clients (QTD)", 
      value: "15 / 3", 
      description: "New clients / Lost clients", 
      icon: ArrowRightLeft 
    },
  ];

  return (
    <main className="flex-1 min-h-screen p-6 space-y-8 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Client Analytics Dashboard</h1>
      
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
        <PlaceholderCard title="Client Segmentation by AUM">
          <div className="h-[300px] md:h-[350px]">
            <PlaceholderChart dataAiHint="client segmentation AUM donut" />
          </div>
        </PlaceholderCard>
        <PlaceholderCard title="Client Acquisition Channels">
           <div className="h-[300px] md:h-[350px]">
            <PlaceholderChart dataAiHint="client acquisition channels line revenue" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
