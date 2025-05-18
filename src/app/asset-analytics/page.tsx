
import { Download } from 'lucide-react';
import Image from 'next/image';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { AssetAllocationDonutChart } from '@/components/charts/asset-allocation-donut-chart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const metricCardsData = [
  {
    title: "Total AUM",
    value: "$12.5M",
    description: "+5.2% last month",
    icon: "/icons/total-aum.svg",
  },
  {
    title: "YTD Return",
    value: "+8.7%",
    description: "vs. Benchmark +7.1%",
    icon: "/icons/ytd-return.svg",
  },
  {
    title: "% in Model Portfolios",
    value: "72%",
    description: "Target 80%",
    icon: "/icons/model-portfolios.svg",
  },
  {
    title: "Inflows (MTD)",
    value: "$350K",
    description: "+15% from last month",
    icon: "/icons/inflows.svg",
  },
  {
    title: "Outflows (MTD)",
    value: "$120K",
    description: "-5% from last month",
    icon: "/icons/outflows.svg",
  },
  {
    title: "Net Flows (MTD)",
    value: "$230K",
    description: "Net positive inflow",
    icon: "/icons/net-flows.svg",
  },
];

const assetBreakdownData = [
  { name: "US Equities", percentage: "40%", color: "bg-[hsl(var(--chart-1))]" },
  { name: "International Equities", percentage: "20%", color: "bg-[hsl(var(--chart-2))]" },
  { name: "Fixed Income", percentage: "25%", color: "bg-[hsl(var(--chart-3))]" },
  { name: "Alternatives", percentage: "10%", color: "bg-[hsl(var(--chart-4))]" },
  { name: "Cash & Equivalents", percentage: "5%", color: "bg-[hsl(var(--chart-5))]" },
];

const topPerformingAssetsData = [
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology', value: '$1.2M', weight: '9.6%', ytdReturn: '+15.2%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', value: '$1.1M', weight: '8.8%', ytdReturn: '+12.5%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. A', category: 'Communication Services', value: '$950K', weight: '7.6%', ytdReturn: '+10.8%' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Consumer Discretionary', value: '$800K', weight: '6.4%', ytdReturn: '+9.1%' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'Technology', value: '$750K', weight: '6.0%', ytdReturn: '+22.3%' },
];


export default function AssetAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Assets Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <PlaceholderCard title="Advisor">
          <Select>
            <SelectTrigger id="advisor-select" className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
              <SelectValue placeholder="Select Advisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mike_mcdermott_mam">Mike McDermott MAM</SelectItem>
              <SelectItem value="sam_rothstein_sar">Sam Rothstein SAR</SelectItem>
            </SelectContent>
          </Select>
        </PlaceholderCard>
        <PlaceholderCard title="Custodian">
          <Select defaultValue="all_custodians">
            <SelectTrigger id="custodian-select" className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
              <SelectValue placeholder="Select Custodian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_custodians">All Custodians</SelectItem>
              <SelectItem value="pershing">Pershing</SelectItem>
              <SelectItem value="schwab">Charles Schwab</SelectItem>
              <SelectItem value="fidelity">Fidelity</SelectItem>
              <SelectItem value="goldman">Goldman Sachs</SelectItem>
              <SelectItem value="pas">PAS</SelectItem>
            </SelectContent>
          </Select>
        </PlaceholderCard>
        <PlaceholderCard title="Timeframe">
          <Select defaultValue="ytd">
            <SelectTrigger id="timeframe-select" className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
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

      <PlaceholderCard title="Asset Allocation by Type" className="lg:col-span-1">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-[350px] md:h-[400px] w-full">
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
                <TableCell className="text-right">{asset.value}</TableCell>
                <TableCell className="text-right">{asset.weight}</TableCell>
                <TableCell className={`text-right font-semibold ${asset.ytdReturn.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.ytdReturn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}
