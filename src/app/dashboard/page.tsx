
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Search, 
  Send,
  Brain,
  BarChart4,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

// IMPORTANT: For production, move this API key to a secure environment variable (e.g., .env.local)
// and access it via process.env.POLYGON_API_KEY.
const POLYGON_API_KEY = "4eIDg99n4FM2EKLkA8voxgJBrzIwQHkV"; 

interface MarketData {
  name: string;
  polygonTicker: string;
  icon?: React.ElementType;
  // Simplified status for this layout iteration
  openTime?: string; 
  closeTime?: string; 
  timezone?: string;
}

const initialMarketOverviewData: MarketData[] = [
  { name: 'S&P 500', polygonTicker: 'I:SPX', icon: Landmark, openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York' },
  { name: 'NASDAQ', polygonTicker: 'I:NDX', icon: Landmark, openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York' },
  { name: 'Dow Jones', polygonTicker: 'I:DJI', icon: Landmark, openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York' },
  { name: 'VIX', polygonTicker: 'I:VIX', icon: Landmark, openTime: '09:30', closeTime: '16:15', timezone: 'America/New_York' },
];

const newsData = [
  {
    id: 1,
    headline: "Global Markets Rally on Positive Inflation Outlook",
    summary: "Major indices saw significant gains as new inflation data suggests a cooling trend, boosting investor confidence.",
    timestamp: "2h ago",
    sentiment: "positive",
  },
  {
    id: 2,
    headline: "Tech Sector Faces Scrutiny Over New Regulations",
    summary: "Upcoming regulatory changes are causing uncertainty in the tech industry, with several large-cap stocks experiencing volatility.",
    timestamp: "5h ago",
    sentiment: "neutral",
  },
  {
    id: 3,
    headline: "Oil Prices Surge Amid Geopolitical Tensions",
    summary: "Crude oil futures jumped over 3% today following new developments in international relations, impacting energy stocks.",
    timestamp: "1d ago",
    sentiment: "negative",
  },
  {
    id: 4,
    headline: "Central Bank Hints at Future Monetary Policy Shift",
    summary: "Analysts are closely watching statements from the central bank, which indicated a potential adjustment to its current monetary policy.",
    timestamp: "2d ago",
    sentiment: "neutral",
  },
];

const getNewsSentimentBadgeClass = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "negative":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};

interface FetchedIndexData {
  c?: number; 
  o?: number; 
  error?: string;
  loading?: boolean;
}

interface MarketStatusInfo {
  statusText: string;
  tooltipText: string;
}


export default function DashboardPage() {
  const [marketApiData, setMarketApiData] = React.useState<Record<string, FetchedIndexData>>({});
  const [tickerQuery, setTickerQuery] = React.useState('');
  const [tickerData, setTickerData] = React.useState<any>(null); // Placeholder for actual ticker lookup data
  const [isLoadingTicker, setIsLoadingTicker] = React.useState(false);
  const [marketStatuses, setMarketStatuses] = React.useState<Record<string, MarketStatusInfo>>({});
  const [currentTimeEST, setCurrentTimeEST] = React.useState<string>('Loading...');

  const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
    try {
      const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`);
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMessage = `API Error: ${response.status} - ${errorData.message}`;
          else if (errorData && errorData.error) errorMessage = `API Error: ${response.status} - ${errorData.error}`;
        } catch (e) { /* Ignore if error response is not JSON */ }
        console.error(`Error fetching ${symbol}: ${errorMessage}`);
        return { error: `API Error: ${response.status}` };
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { c, o } = data.results[0];
        return { c, o };
      }
      return { error: 'No data' };
    } catch (error: any) {
      console.error(`Network/Fetch error for ${symbol}:`, error.message || error);
      return { error: 'Fetch error' };
    }
  };
  
  React.useEffect(() => {
    const loadMarketData = async () => {
      const initialApiData: Record<string, FetchedIndexData> = {};
      initialMarketOverviewData.forEach(market => {
        initialApiData[market.polygonTicker] = { loading: true };
      });
      setMarketApiData(initialApiData);

      const promises = initialMarketOverviewData.map(market => 
        fetchIndexData(market.polygonTicker).then(data => ({ symbol: market.polygonTicker, data }))
      );
      
      const results = await Promise.allSettled(promises);
      
      const newApiData: Record<string, FetchedIndexData> = {};
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          newApiData[result.value.symbol] = result.value.data;
        } else {
          // Handle rejected promises if needed, though fetchIndexData returns an error object
        }
      });
      setMarketApiData(prevData => ({...prevData, ...newApiData}));
    };
    loadMarketData();
  }, []);

  const calculateChangePercent = (currentPrice?: number, openPrice?: number) => {
    if (typeof currentPrice !== 'number' || typeof openPrice !== 'number' || openPrice === 0) {
      return null;
    }
    return ((currentPrice - openPrice) / openPrice) * 100;
  };

  const handleTickerLookup = () => {
    if (!tickerQuery.trim()) return;
    setIsLoadingTicker(true);
    // Simulate API call
    setTimeout(() => {
      setTickerData({
        name: `${tickerQuery.toUpperCase()} Company Inc.`,
        logo: `https://placehold.co/40x40.png?text=${tickerQuery.toUpperCase()}`,
        marketCap: "1.5T",
        peRatio: "25.5",
        dividendYield: "1.8%",
        fiftyTwoWeekHigh: "$200.00",
        fiftyTwoWeekLow: "$150.00",
        ytdReturn: "+10.5%",
        oneYearReturn: "+22.3%",
      });
      setIsLoadingTicker(false);
    }, 1500);
  };

   // Simplified Market Status Logic for this iteration (focus on data display)
   React.useEffect(() => {
    const updateStatuses = () => {
      const newStatuses: Record<string, MarketStatusInfo> = {};
      const now = new Date();
      const estOffset = -4 * 60; // EDT offset, adjust if standard time
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const estTime = new Date(utc + (3600000 * (estOffset/60)));
      
      const currentHourEST = estTime.getHours();
      const currentMinuteEST = estTime.getMinutes();

      initialMarketOverviewData.forEach(market => {
        if (market.openTime && market.closeTime) {
            const [openHour, openMinute] = market.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = market.closeTime.split(':').map(Number);

            const isOpen = (currentHourEST > openHour || (currentHourEST === openHour && currentMinuteEST >= openMinute)) &&
                           (currentHourEST < closeHour || (currentHourEST === closeHour && currentMinuteEST < closeMinute));
            
            let statusText = "🔴 Market Closed";
            if (isOpen) statusText = "🟢 Market Open";
            // Simplified: Not adding "Closing Soon" for this pass to focus on Polygon data integration

            newStatuses[market.name] = {
                statusText,
                tooltipText: `Market Hours: ${market.openTime} - ${market.closeTime} EST`
            };
        } else {
            newStatuses[market.name] = { statusText: "Status N/A", tooltipText: "Market hours not defined"};
        }
      });
      setMarketStatuses(newStatuses);
    };
    
    updateStatuses(); // Initial call
    const intervalId = setInterval(updateStatuses, 60000); // Update every minute
    const clockIntervalId = setInterval(() => {
        setCurrentTimeEST(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second:'2-digit' }));
    }, 1000);

    return () => {
        clearInterval(intervalId);
        clearInterval(clockIntervalId);
    };
  }, []);


  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      {/* Header removed as per prompt "Top Index Overview (Top Row)" suggesting content starts directly */}
      
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialMarketOverviewData.map((market) => {
            const data = marketApiData[market.polygonTicker];
            const status = marketStatuses[market.name] || { statusText: "Loading...", tooltipText: "Fetching status..."};
            
            let valueDisplay = "$0.00";
            let changeDisplay: React.ReactNode = "0.00%";
            
            if (data?.loading) {
              valueDisplay = "Loading...";
              changeDisplay = "Loading...";
            } else if (data?.error) {
              valueDisplay = <span className="text-sm text-red-400/80 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {data.error}</span>;
              changeDisplay = "";
            } else if (data?.c !== undefined && data?.o !== undefined) {
              valueDisplay = `$${data.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const percentChange = calculateChangePercent(data.c, data.o);
              if (percentChange !== null) {
                const changeType = percentChange >= 0 ? 'up' : 'down';
                changeDisplay = (
                  <span className={cn("text-sm", changeType === 'up' ? 'text-green-400' : 'text-red-400')}>
                    {changeType === 'up' ? <TrendingUp className="inline-block w-4 h-4 mr-1" /> : <TrendingDown className="inline-block w-4 h-4 mr-1" />}
                    {percentChange.toFixed(2)}%
                  </span>
                );
              } else {
                changeDisplay = "N/A";
              }
            }

            return (
              <PlaceholderCard 
                key={market.name} 
                title={market.name} 
                icon={market.icon || Landmark}
                className="transition-all duration-300 ease-in-out"
              >
                <div className="text-2xl font-bold text-foreground mb-1">{valueDisplay}</div>
                <div className="text-sm mb-3">{changeDisplay}</div>
                <div className="h-10 w-full my-2 bg-black/30 rounded-md flex items-center justify-center backdrop-blur-sm" data-ai-hint="mini trendline chart">
                   <span className="text-xs text-muted-foreground/50">Mini Trend</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/20 flex justify-between items-center">
                        <span>{status.statusText}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{currentTimeEST.replace(' EST','')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>{status.tooltipText}</p>
                       {data?.c !== undefined && <p>Prev. Close: ${data.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                       {data?.o !== undefined && <p>Prev. Open: ${data.o.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PlaceholderCard>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PlaceholderCard title="Why the Market Moved" icon={Brain} className="h-full">
            {/* Glowing header simulated by CardTitle style */}
            <p className="text-sm text-muted-foreground leading-relaxed font-serif mt-2">
              Market sentiment turned positive following the release of favorable inflation data, suggesting that price pressures may be easing. This led to a broad rally across major indices, particularly in growth-oriented sectors like technology and consumer discretionary. Investors are now keenly awaiting upcoming corporate earnings reports for further direction.
            </p>
          </PlaceholderCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PlaceholderCard title="Top News Stories" icon={Newspaper}>
            <ul className="space-y-4">
              {newsData.map((news) => (
                <li key={news.id} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-semibold text-foreground">{news.headline}</h4>
                    <Badge variant="outline" className={cn("text-xs", getNewsSentimentBadgeClass(news.sentiment))}>
                      {news.sentiment}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{news.summary}</p>
                  <p className="text-xs text-muted-foreground/70">{news.timestamp}</p>
                </li>
              ))}
            </ul>
          </PlaceholderCard>

          <PlaceholderCard title="Ticker Lookup Tool" icon={Search}>
            <div className="flex space-x-2 mb-4">
              <Input 
                type="text" 
                placeholder="Enter stock ticker (e.g., AAPL)" 
                className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                value={tickerQuery}
                onChange={(e) => setTickerQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTickerLookup()}
              />
              <Button onClick={handleTickerLookup} disabled={isLoadingTicker}>
                {isLoadingTicker ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </div>
            {isLoadingTicker && <p className="text-sm text-muted-foreground text-center">Fetching data...</p>}
            {tickerData && !isLoadingTicker && (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <img src={tickerData.logo} alt={`${tickerData.name} logo`} className="w-10 h-10 rounded-md bg-muted p-1" data-ai-hint="company logo" />
                  <h4 className="text-lg font-semibold text-foreground">{tickerData.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div><strong className="text-muted-foreground">Market Cap:</strong> {tickerData.marketCap}</div>
                  <div><strong className="text-muted-foreground">P/E Ratio:</strong> {tickerData.peRatio}</div>
                  <div><strong className="text-muted-foreground">Dividend Yield:</strong> {tickerData.dividendYield}</div>
                  <div><strong className="text-muted-foreground">52W High:</strong> {tickerData.fiftyTwoWeekHigh}</div>
                  <div><strong className="text-muted-foreground">52W Low:</strong> {tickerData.fiftyTwoWeekLow}</div>
                </div>
                <div className="pt-3 border-t border-border/30">
                    <strong className="text-muted-foreground block mb-1">Performance:</strong>
                    <div className="flex justify-between"><span>YTD: <span className={cn(tickerData.ytdReturn.startsWith('+') ? "text-green-400" : "text-red-400")}>{tickerData.ytdReturn}</span></span></div>
                    <div className="flex justify-between"><span>1Y: <span className={cn(tickerData.oneYearReturn.startsWith('+') ? "text-green-400" : "text-red-400")}>{tickerData.oneYearReturn}</span></span></div>
                </div>
              </div>
            )}
          </PlaceholderCard>
        </div>
      </div>
    </main>
  );
}

