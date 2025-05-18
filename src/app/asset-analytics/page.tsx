
import Image from 'next/image';
import { AssetAllocationDonutChart } from '@/components/charts/asset-allocation-donut-chart';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AssetAnalyticsPage() {
  const metricCardsData = [
    { title: "Total AUM", value: "$12.5M", description: "+5.2% last month", icon: "/icons/total-aum.svg" },
    { title: "YTD Return", value: "+15.2%", description: "Overall portfolio performance", icon: "/icons/ytd-return.svg" },
    { title: "% in Model Portfolios", value: "68%", description: "Allocated to strategic models", icon: "/icons/model-portfolios.svg" },
    { title: "Inflows (MTD)", value: "$350K", description: "New investments this month", icon: "/icons/inflows.svg" },
    { title: "Outflows (MTD)", value: "$120K", description: "Withdrawals this month", icon: "/icons/outflows.svg" },
    { title: "Net Flows (MTD)", value: "$230K", description: "Net change in assets", icon: "/icons/net-flows.svg" },
  ];

  const assetBreakdownData = [
    { name: "US Equities", percentage: "40%", color: "bg-chart-1" },
    { name: "International Equities", percentage: "20%", color: "bg-chart-2" },
    { name: "Fixed Income", percentage: "25%", color: "bg-chart-3" },
    { name: "Alternatives", percentage: "10%", color: "bg-chart-4" },
    { name: "Cash & Equivalents", percentage: "5%", color: "bg-chart-5" },
  ];

  const topPerformingAssetsData = [
    { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', value: '$1.8M', weight: '7.2%', ytdReturn: '+18.5%' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Consumer Discretionary', value: '$1.5M', weight: '6.0%', ytdReturn: '+22.1%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. Cl A', category: 'Communication Services', value: '$1.3M', weight: '5.2%', ytdReturn: '+16.8%' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'Financials', value: '$1.1M', weight: '4.4%', ytdReturn: '+12.3%' },
    { symbol: 'V', name: 'Visa Inc.', category: 'Information Technology', value: '$950K', weight: '3.8%', ytdReturn: '+14.7%' },
  ];

  return (
    <main className="flex-1 min-h-screen p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Asset Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard title="Advisor">
          <Label htmlFor="advisor-select" className="sr-only">Advisor</Label>
          <Select>
            <SelectTrigger id="advisor-select" className="w-full bg-card border-input text-foreground">
              <SelectValue placeholder="Select Advisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_advisors">All Advisors</SelectItem>
              <SelectItem value="advisor_1">Advisor Alpha</SelectItem>
              <SelectItem value="advisor_2">Advisor Beta</SelectItem>
              <SelectItem value="advisor_3">Advisor Gamma</SelectItem>
            </SelectContent>
          </Select>
        </PlaceholderCard>
        
        <PlaceholderCard title="Custodian">
          <Label htmlFor="custodian-select" className="sr-only">Custodian</Label>
          <Select defaultValue="all_custodians">
            <SelectTrigger id="custodian-select" className="w-full bg-card border-input text-foreground">
              <SelectValue placeholder="Select Custodian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_custodians">All Custodians</SelectItem>
              <SelectItem value="pershing">Pershing</SelectItem>
              <SelectItem value="charles_schwab">Charles Schwab</SelectItem>
              <SelectItem value="fidelity">Fidelity</SelectItem>
              <SelectItem value="goldman_sachs">Goldman Sachs</SelectItem>
              <SelectItem value="pas">PAS</SelectItem>
            </SelectContent>
          </Select>
        </PlaceholderCard>

        <PlaceholderCard title="Timeframe">
          <Label htmlFor="timeframe-select" className="sr-only">Timeframe</Label>
          <Select defaultValue="ytd">
            <SelectTrigger id="timeframe-select" className="w-full bg-card border-input text-foreground">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="qtd">Quarter to Date</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="trailing_12m">Trailing 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </PlaceholderCard>
      </div>

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

      <PlaceholderCard title="Asset Allocation by Type">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center py-4">
          <div className="h-[300px] md:h-[350px]">
            <AssetAllocationDonutChart />
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
        </div>
      </PlaceholderCard>

      <PlaceholderCard title="Top Performing Assets">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">YTD Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformingAssetsData.map((asset) => (
              <TableRow key={asset.symbol}>
                <TableCell className="font-medium">{asset.symbol}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell className="text-muted-foreground">{asset.category}</TableCell>
                <TableCell className="text-right text-foreground">{asset.value}</TableCell>
                <TableCell className="text-right text-muted-foreground">{asset.weight}</TableCell>
                <TableCell className={`text-right font-semibold ${asset.ytdReturn.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{asset.ytdReturn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PlaceholderCard>
    </main>
  );
}
