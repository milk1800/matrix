
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PortfolioMatrixPage() {
  const portfolioOverviewData = [
    { ticker: 'AAPL', name: 'Alpha Fund', category: 'Equity', value: '$1,250,000', weight: '25.0%', ytdReturn: '+5.2%' },
    { ticker: 'MSFT', name: 'Beta Bond Portfolio', category: 'Fixed Income', value: '$800,000', weight: '16.0%', ytdReturn: '+2.1%' },
    { ticker: 'GOOG', name: 'Gamma Real Estate', category: 'Alternatives', value: '$500,000', weight: '10.0%', ytdReturn: '+7.8%' },
    { ticker: 'AMZN', name: 'Delta Growth Stock', category: 'Equity', value: '$150,000', weight: '3.0%', ytdReturn: '+12.5%' },
    { ticker: 'TSLA', name: 'Epsilon Money Market', category: 'Cash Eq.', value: '$2,000,000', weight: '40.0%', ytdReturn: '+0.5%' },
    { ticker: 'JPM', name: 'Zeta Financial Holding', category: 'Financials', value: '$300,000', weight: '6.0%', ytdReturn: '-3.5%' },
  ];

  const missedOpportunitiesData = [...portfolioOverviewData];


  return (
    <main className="flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Portfolio Matrix Dashboard</h1>
      
      <PlaceholderCard title="Portfolio Analysis Engine">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full">
            <Label htmlFor="portfolio-id-input" className="sr-only">Portfolio ID</Label>
            <Input id="portfolio-id-input" placeholder="e.g. ACC123456789" className="bg-input border-input text-foreground" />
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
          Displaying all portfolio items. Further analysis will highlight specific missed opportunities.
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
              <TableRow key={`missed-${item.ticker}`}>
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
    </main>
  );
}
