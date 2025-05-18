import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function AssetAnalyticsPage() {
  return (
    <main className="flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Analytics</h1>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
        <Select defaultValue="all_advisors">
          <SelectTrigger className="w-full md:w-[200px] bg-card border-input text-foreground">
            <SelectValue placeholder="Select Advisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_advisors">All Advisors</SelectItem>
            <SelectItem value="advisor_1">Advisor Alpha</SelectItem>
            <SelectItem value="advisor_2">Advisor Beta</SelectItem>
            <SelectItem value="advisor_3">Advisor Gamma</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all_custodians">
          <SelectTrigger className="w-full md:w-[200px] bg-card border-input text-foreground">
            <SelectValue placeholder="Select Custodian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_custodians">All Custodians</SelectItem>
            <SelectItem value="custodian_x">Custodian X</SelectItem>
            <SelectItem value="custodian_y">Custodian Y</SelectItem>
            <SelectItem value="custodian_z">Custodian Z</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="ytd">
          <SelectTrigger className="w-full md:w-[200px] bg-card border-input text-foreground">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtd">Month to Date</SelectItem>
            <SelectItem value="qtd">Quarter to Date</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="trailing_12m">Trailing 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
