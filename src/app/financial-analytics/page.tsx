
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function FinancialAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Total Revenue"
          value="$2.3M"
          description="+12% this quarter"
          icon={DollarSign}
        />
        <PlaceholderCard
          title="Net Profit Margin"
          value="18.5%"
          description="Improved by 2%"
          icon={TrendingUp}
        />
        <PlaceholderCard
          title="Operational Costs"
          value="$850K"
          description="-3% from last quarter"
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PlaceholderCard title="Revenue vs. Expenses">
          <div className="h-[300px]">
            <PlaceholderChart dataAiHint="revenue expenses" />
          </div>
        </PlaceholderCard>
        <PlaceholderCard title="Cash Flow Projection">
           <div className="h-[300px]">
            <PlaceholderChart dataAiHint="cash flow" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
