
import { Users, DollarSign, TrendingDown } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ConversionAnalyticsPage() {
  const metricCardsData = [
    { 
      title: "Total Non-Managed Accounts", 
      value: "245", 
      description: "Number of non-managed accounts", 
      icon: Users 
    },
    { 
      title: "Total AUM in Non-Managed", 
      value: "$82,000,000", 
      description: "Assets not enrolled in managed programs", 
      icon: DollarSign 
    },
    { 
      title: "Estimated Lost Revenue (YTD)", 
      value: "$162,000", 
      description: "Estimated advisory revenue not earned YTD", 
      icon: TrendingDown 
    },
  ];

  const topHouseholdsByNonManagedAUMData = [
    { householdName: 'Rodriguez LLC', accounts: 3, managedAUM: '$0', nonManagedAUM: '$2.1M', percentInManaged: '0%', potentialUpside: '$21,000 (est.)' },
    { householdName: 'Smith Family Trust', accounts: 2, managedAUM: '$500K', nonManagedAUM: '$1.8M', percentInManaged: '21.7%', potentialUpside: '$18,000 (est.)' },
    { householdName: 'Chen Holdings', accounts: 5, managedAUM: '$1.2M', nonManagedAUM: '$1.5M', percentInManaged: '44.4%', potentialUpside: '$15,000 (est.)' },
    { householdName: 'Patel Group', accounts: 1, managedAUM: '$0', nonManagedAUM: '$1.3M', percentInManaged: '0%', potentialUpside: '$13,000 (est.)' },
    { householdName: 'Williams Partners', accounts: 4, managedAUM: '$2.5M', nonManagedAUM: '$1.1M', percentInManaged: '69.4%', potentialUpside: '$11,000 (est.)' },
  ];

  const topHouseholdsOutperformanceData = [
    { householdName: 'Thompson Wealth', accounts: 7, managedAUM: '$4.1M', nonManagedAUM: '$1.2M', managedYTD: '12.5%', nonManagedYTD: '6.1%', outperformance: '6.4%' },
    { householdName: 'Garcia Investments', accounts: 3, managedAUM: '$2.5M', nonManagedAUM: '$800K', managedYTD: '10.2%', nonManagedYTD: '5.5%', outperformance: '4.7%' },
    { householdName: 'Lee Capital', accounts: 5, managedAUM: '$6.0M', nonManagedAUM: '$1.5M', managedYTD: '11.8%', nonManagedYTD: '7.0%', outperformance: '4.8%' },
    { householdName: 'Davis & Co.', accounts: 2, managedAUM: '$1.8M', nonManagedAUM: '$500K', managedYTD: '9.5%', nonManagedYTD: '4.2%', outperformance: '5.3%' },
    { householdName: 'Miller Trust', accounts: 6, managedAUM: '$3.3M', nonManagedAUM: '$950K', managedYTD: '13.1%', nonManagedYTD: '6.8%', outperformance: '6.3%' },
  ];

  return (
    <main className="flex-1 min-h-screen p-6 space-y-8 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Conversion Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metricCardsData.map((card, index) => (
          <PlaceholderCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>

      <PlaceholderCard title="Top Households by Non-Managed AUM">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Household Name</TableHead>
              <TableHead className="text-right"># of Accounts</TableHead>
              <TableHead className="text-right">Managed AUM</TableHead>
              <TableHead className="text-right">Non-Managed AUM</TableHead>
              <TableHead className="text-right">% in Managed</TableHead>
              <TableHead className="text-right">Potential Upside</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topHouseholdsByNonManagedAUMData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.householdName}</TableCell>
                <TableCell className="text-right">{row.accounts}</TableCell>
                <TableCell className="text-right">{row.managedAUM}</TableCell>
                <TableCell className="text-right">{row.nonManagedAUM}</TableCell>
                <TableCell className="text-right">{row.percentInManaged}</TableCell>
                <TableCell className="text-right text-green-400">{row.potentialUpside}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-xs text-muted-foreground">
          Top 5 households ranked by non-managed AUM. Estimated potential upside based on a hypothetical 1% advisory fee.
        </p>
      </PlaceholderCard>

      <PlaceholderCard title="Top Households: Managed Outperformance vs. Non-Managed (YTD)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Household Name</TableHead>
              <TableHead className="text-right"># of Accts</TableHead>
              <TableHead className="text-right">Managed AUM</TableHead>
              <TableHead className="text-right">Non-Managed AUM</TableHead>
              <TableHead className="text-right">Managed YTD %</TableHead>
              <TableHead className="text-right">Non-Managed YTD %</TableHead>
              <TableHead className="text-right">Outperformance %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topHouseholdsOutperformanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.householdName}</TableCell>
                <TableCell className="text-right">{row.accounts}</TableCell>
                <TableCell className="text-right">{row.managedAUM}</TableCell>
                <TableCell className="text-right">{row.nonManagedAUM}</TableCell>
                <TableCell className="text-right text-green-400">{row.managedYTD}</TableCell>
                <TableCell className="text-right">{row.nonManagedYTD}</TableCell>
                <TableCell className="text-right text-green-400">{row.outperformance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PlaceholderCard>
    </main>
  );
}
