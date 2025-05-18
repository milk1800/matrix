import { CalendarClock, Percent, Bell } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function RMDMatrixPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">RMD Matrix Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Upcoming RMDs"
          value="75"
          description="Next 90 days"
          icon={CalendarClock}
        />
        <PlaceholderCard
          title="RMD Compliance Rate"
          value="99.8%"
          description="Successful distributions"
          icon={Percent}
        />
        <PlaceholderCard
          title="Pending Actions"
          value="5"
          description="Require attention"
          icon={Bell}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <PlaceholderCard title="RMD Distribution Schedule">
          <div className="h-[400px]">
            <PlaceholderChart dataAiHint="distribution schedule" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
