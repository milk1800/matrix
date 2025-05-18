import { Repeat, Users, Target } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function ConversionAnalyticsPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Conversion Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Overall Conversion Rate"
          value="4.2%"
          description="Lead to client"
          icon={Repeat}
        />
        <PlaceholderCard
          title="Leads Generated"
          value="1,200"
          description="This month"
          icon={Users}
        />
        <PlaceholderCard
          title="Cost Per Acquisition"
          value="$150"
          description="Average CPA"
          icon={Target}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PlaceholderCard title="Conversion Funnel">
          <div className="h-[300px]">
            <PlaceholderChart dataAiHint="conversion funnel" />
          </div>
        </PlaceholderCard>
        <PlaceholderCard title="Channel Performance">
           <div className="h-[300px]">
            <PlaceholderChart dataAiHint="channel performance" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
