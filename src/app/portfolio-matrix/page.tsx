
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function PortfolioMatrixPage() {
  const portfolioOverviewData = [
    { ticker: 'AAPL', name: 'Alpha Fund', category: 'Equity', value: '$1,250,000', weight: '25.0%', ytdReturn: '+5.2%' },
    { ticker: 'MSFT', name: 'Beta Bond Portfolio', category: 'Fixed Income', value: '$800,000', weight: '16.0%', ytdReturn: '+2.1%' },
    { ticker: 'GOOG', name: 'Gamma Real Estate', category: 'Alternatives', value: '$500,000', weight: '10.0%', ytdReturn: '+7.8%' },
    { ticker: 'AMZN', name: 'Delta Growth Stock', category: 'Equity', value: '$150,000', weight: '3.0%', ytdReturn: '+12.5%' },
    { ticker: 'TSLA', name: 'Epsilon Money Market', category: 'Cash Eq.', value: '$2,000,000', weight: '40.0%', ytdReturn: '+0.5%' },
    { ticker: 'JPM', name: 'Zeta Financial Holding', category: 'Financials', value: '$300,000', weight: '6.0%', ytdReturn: '-3.5%' },
  ];

  const missedOpportunitiesData = [
    { ticker: 'AAPL', name: 'Alpha Fund', category: 'Equity', value: '$1,250,000', weight: '25.0%', ytdReturn: '+5.2%' },
    { ticker: 'MSFT', name: 'Beta Bond Portfolio', category: 'Fixed Income', value: '$800,000', weight: '16.0%', ytdReturn: '-2.1%' }, // Made negative
    { ticker: 'GOOG', name: 'Gamma Real Estate', category: 'Alternatives', value: '$500,000', weight: '10.0%', ytdReturn: '+7.8%' },
    { ticker: 'AMZN', name: 'Delta Growth Stock', category: 'Equity', value: '$150,000', weight: '3.0%', ytdReturn: '-1.5%' }, // Made negative
    { ticker: 'TSLA', name: 'Epsilon Money Market', category: 'Cash Eq.', value: '$2,000,000', weight: '40.0%', ytdReturn: '+0.5%' },
    { ticker: 'JPM', name: 'Zeta Financial Holding', category: 'Financials', value: '$300,000', weight: '6.0%', ytdReturn: '-3.5%' }, // Already negative
  ];


  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Portfolio Matrix Dashboard</h1>
      
      <PlaceholderCard title="Portfolio Analysis Engine">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full sm:max-w-sm">
            <Label htmlFor="portfolio-id-input" className="sr-only">Portfolio ID</Label>
            <Input id="portfolio-id-input" placeholder="e.g. ACC123456789" className="bg-card backdrop-blur-sm border-none shadow-white-glow-soft hover:shadow-white-glow-hover text-foreground" />
          </div>
          <Button className="w-full sm:w-auto shrink-0">Analyze Portfolio</Button>
        </div>
      </PlaceholderCard>

      <PlaceholderCard title="Portfolio Matrix Overview">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Ticker</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold text-right">Value</TableHead>
              <TableHead className="font-bold text-right">Weight</TableHead>
              <TableHead className="font-bold text-right">YTD Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioOverviewData.map((item) => (
              <TableRow key={item.ticker}>
                <TableCell className="font-medium">{item.ticker}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right text-foreground">{item.value}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.weight}</TableCell>
                <TableCell className={`text-right font-semibold ${item.ytdReturn.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  {item.ytdReturn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PlaceholderCard>

      <PlaceholderCard title="Missed Opportunities">
        <p className="text-sm italic text-muted-foreground mb-4">
          Displaying portfolio items. Negative YTD returns are highlighted with a flashing glow. Further analysis can identify specific missed opportunities.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Ticker</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold text-right">Value</TableHead>
              <TableHead className="font-bold text-right">Weight</TableHead>
              <TableHead className="font-bold text-right">YTD Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missedOpportunitiesData.map((item) => (
              <TableRow 
                key={`missed-${item.ticker}`}
                className={cn(
                  item.ytdReturn.startsWith('-') ? 'missed-row-negative' : ''
                )}
              >
                <TableCell className="font-medium">{item.ticker}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right text-foreground">{item.value}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.weight}</TableCell>
                <TableCell className={`text-right font-semibold ${item.ytdReturn.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  {item.ytdReturn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-6">
           <Button
            variant="outline"
            className="rounded-full border-primary text-foreground font-semibold py-2 px-5
                       hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_8px_hsl(var(--primary))]
                       active:scale-95 transition-all duration-300 ease-out"
          >
            🔍 Ask Maven
          </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}
