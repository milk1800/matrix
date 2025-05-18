import { Users, UserPlus, Activity } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function ClientAnalyticsPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Total Clients"
          value="1,520"
          description="+30 new this month"
          icon={Users}
        />
        <PlaceholderCard
          title="New Client Acquisition"
          value="45"
          description="Target: 60"
          icon={UserPlus}
        />
        <PlaceholderCard
          title="Client Activity Rate"
          value="85%"
          description="Active in last 30 days"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PlaceholderCard title="Client Growth Over Time">
          <div className="h-[300px]">
            <PlaceholderChart dataAiHint="client growth" />
          </div>
        </PlaceholderCard>
        <PlaceholderCard title="Client Segmentation">
           <div className="h-[300px]">
            <PlaceholderChart dataAiHint="client segmentation" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
