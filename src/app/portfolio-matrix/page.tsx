import { PieChart, Briefcase, TrendingUp } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function PortfolioMatrixPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Matrix Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Total Portfolios"
          value="85"
          description="Managed portfolios"
          icon={Briefcase}
        />
        <PlaceholderCard
          title="Average Portfolio Value"
          value="$1.2M"
          description="Across all portfolios"
          icon={PieChart}
        />
        <PlaceholderCard
          title="Portfolio Growth"
          value="+8.5%"
          description="Average YTD growth"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <PlaceholderCard title="Portfolio Distribution Matrix">
          <div className="h-[400px]">
            <PlaceholderChart dataAiHint="portfolio distribution" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
