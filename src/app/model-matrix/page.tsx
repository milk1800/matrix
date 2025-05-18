
import { UserCog, LibraryBig, FileText } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';

const modelCardsData = [
  {
    title: "Advisor Directed Models",
    value: "15",
    description: "Customized by advisors",
    icon: UserCog,
  },
  {
    title: "UMA Models",
    value: "8",
    description: "Unified Managed Accounts",
    icon: LibraryBig,
  },
  {
    title: "SMA Models",
    value: "22",
    description: "Separately Managed Accounts",
    icon: FileText,
  },
];

export default function ModelMatrixPage() {
  return (
    <main className="flex-1 p-6 space-y-6 md:p-8 min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Model Matrix Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modelCardsData.map((card, index) => (
          <PlaceholderCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 mt-2"> {/* mt-2 adds 8px to the main space-y-6 (24px) for 32px total */}
        <PlaceholderCard title="Model Portfolio Performance">
          <div className="h-[400px]">
            <PlaceholderChart dataAiHint="model performance matrix" />
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}
