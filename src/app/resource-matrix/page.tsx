
import { LayoutGrid, Briefcase, Users } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function ResourceMatrixPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Resource Matrix Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Total Resources"
          value="450"
          description="Across all categories"
          icon={LayoutGrid}
        />
        <PlaceholderCard
          title="Utilized Resources"
          value="75%"
          description="Current utilization rate"
          icon={Briefcase}
        />
        <PlaceholderCard
          title="Team Allocation"
          value="92%"
          description="Resources allocated to teams"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <PlaceholderCard title="Resource Allocation Overview">
          <div className="h-[400px]"> {/* Taller chart for matrix view */}
            <PlaceholderChart dataAiHint="resource allocation" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
