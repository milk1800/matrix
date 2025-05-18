import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function AssetAnalyticsPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Total Assets Value"
          value="$12.5M"
          description="+5.2% last month"
          icon={DollarSign}
        />
        <PlaceholderCard
          title="Asset Performance"
          value="+15%"
          description="Year-over-year growth"
          icon={TrendingUp}
        />
        <PlaceholderCard
          title="Active Assets"
          value="1,280"
          description="Currently managed"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PlaceholderCard title="Asset Allocation Trend" className="lg:col-span-1">
          <div className="h-[300px]">
            <PlaceholderChart dataAiHint="allocation trend" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">Asset Breakdown</h3>
            {assetBreakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-sm ${item.color}`}></span>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.percentage}</span>
              </div>
            ))}
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
