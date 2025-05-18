
import { Shapes, SlidersHorizontal, Puzzle } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

export default function ModelMatrixPage() {
  return (
    <main className="flex-1 min-h-screen p-6 space-y-6 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Model Matrix Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Active Models"
          value="32"
          description="Investment models"
          icon={Shapes}
        />
        <PlaceholderCard
          title="Model Parameters"
          value="150+"
          description="Configurable settings"
          icon={SlidersHorizontal}
        />
        <PlaceholderCard
          title="Model Complexity"
          value="High"
          description="Average complexity score"
          icon={Puzzle}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <PlaceholderCard title="Model Performance Matrix">
          <div className="h-[400px]">
            <PlaceholderChart dataAiHint="model performance" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
