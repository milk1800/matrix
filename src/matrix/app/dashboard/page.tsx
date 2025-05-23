
"use client";

import * as React from 'react';
import Image from "next/image";
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
  Clock,
  Sparkles,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface MarketData {
  name: string;
  polygonTicker: string; 
  icon?: React.ElementType;
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
  c?: number; // Close price
  o?: number; // Open price
  error?: string;
  loading?: boolean;
}

interface MarketStatusInfo {
  statusText: string;
  tooltipText: string;
  shadowClass: string;
}

// Function to fetch index data
const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  // Log to check if the API key is being read, masking most of it for security
  console.log(`Fetching data for ${symbol} using API key: ${apiKey ? '******' + apiKey.slice(-4) : 'UNDEFINED'}`);

  if (!apiKey) {
    console.error("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. Please ensure it's in .env.local and the dev server was restarted.");
    return { error: 'API Key Missing. Configure in .env.local & restart server.' };
  }

  try {
    // Ensure the adjusted=true parameter is included as per Polygon.io documentation
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
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
      const { c, o } = data.results[0]; // c: close, o: open
      return { c, o };
    }
    return { error: 'No data' };
  } catch (error: any) {
    console.error(`Network/Fetch error for ${symbol}:`, error.message || error);
    return { error: 'Fetch error' };
  }
};


export default function DashboardPage() {
  const [marketApiData, setMarketApiData] = React.useState<Record<string, FetchedIndexData>>({});
  const [tickerQuery, setTickerQuery] = React.useState('');
  const [tickerData, setTickerData] = React.useState<any>(null); 
  const [isLoadingTicker, setIsLoadingTicker] = React.useState(false);
  const [marketStatuses, setMarketStatuses] = React.useState<Record<string, MarketStatusInfo>>({});
  const [currentTimeEST, setCurrentTimeEST] = React.useState<string>('Loading...');
  
  React.useEffect(() => {
    const loadMarketData = async () => {
      if (!process.env.NEXT_PUBLIC_POLYGON_API_KEY) {
        console.warn("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not defined. Market data will not be fetched. Ensure .env.local is set and server restarted.");
        const errorState: Record<string, FetchedIndexData> = {};
        initialMarketOverviewData.forEach(market => {
          errorState[market.polygonTicker] = { error: 'API Key Missing. Check .env.local & restart server.' };
        });
        setMarketApiData(errorState);
        return;
      }

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
          console.error("Promise rejected unexpectedly in loadMarketData:", result.reason);
          // Potentially set an error state for the specific symbol if needed
          // newApiData[symbolAssociatedWithRejectedPromise] = { error: 'Failed to fetch' };
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
    setTickerData(null); 
    // Simulate API call for ticker lookup
    setTimeout(() => {
      setTickerData({
        name: `${tickerQuery.toUpperCase()} Company Inc.`,
        logo: `https://placehold.co/40x40.png?text=${tickerQuery.toUpperCase()}`, // Placeholder logo
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

   React.useEffect(() => {
    const updateMarketStatuses = () => {
      const newStatuses: Record<string, MarketStatusInfo> = {};
      const now = new Date();
      
      let currentHourEST = 0;
      let currentMinuteEST = 0;
      
      try {
        const estFormatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
          timeZone: 'America/New_York',
        });
        const parts = estFormatter.formatToParts(now);
        parts.forEach(part => {
          if (part.type === 'hour') currentHourEST = parseInt(part.value);
          if (part.type === 'minute') currentMinuteEST = parseInt(part.value);
        });
      } catch (e) {
        console.error("Error formatting EST time, defaulting to local time for logic:", e);
        const localNow = new Date(); 
        currentHourEST = localNow.getHours();
        currentMinuteEST = localNow.getMinutes();
      }

      const todayForLogic = new Date(); 
      todayForLogic.setHours(0,0,0,0);


      initialMarketOverviewData.forEach(market => {
        if (market.openTime && market.closeTime) {
            const [openHour, openMinute] = market.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = market.closeTime.split(':').map(Number);

            const marketOpenTime = new Date(todayForLogic);
            marketOpenTime.setHours(openHour, openMinute, 0, 0);

            const marketCloseTime = new Date(todayForLogic);
            marketCloseTime.setHours(closeHour, closeMinute, 0, 0);
            
            const nowInEstEquivalentForLogic = new Date(todayForLogic);
            nowInEstEquivalentForLogic.setHours(currentHourEST, currentMinuteEST, 0, 0);


            const isCurrentlyOpen = 
                nowInEstEquivalentForLogic >= marketOpenTime &&
                nowInEstEquivalentForLogic < marketCloseTime;

            const timeToCloseMs = marketCloseTime.getTime() - nowInEstEquivalentForLogic.getTime();
            const isClosingSoon = isCurrentlyOpen && timeToCloseMs > 0 && timeToCloseMs <= 60 * 60 * 1000; // 1 hour

            let statusText = "🔴 Market Closed";
            let shadowClass = "shadow-market-closed";
            let tooltipText = `Market Hours: ${market.openTime} - ${market.closeTime} ET`;

            if (isClosingSoon) {
                statusText = "🟡 Closing Soon";
                shadowClass = "shadow-market-closing";
                tooltipText = `Market closes at ${market.closeTime} ET`;
            } else if (isCurrentlyOpen) {
                statusText = "🟢 Market Open";
                shadowClass = "shadow-market-open";
                tooltipText = `Market closes at ${market.closeTime} ET`;
            }
            
            newStatuses[market.name] = { statusText, tooltipText, shadowClass };
        } else {
            newStatuses[market.name] = { statusText: "Status N/A", tooltipText: "Market hours not defined", shadowClass: "" };
        }
      });
      setMarketStatuses(newStatuses);
    };
    
    updateMarketStatuses(); // Initial call
    const intervalId = setInterval(updateMarketStatuses, 60000); // Update every minute
    const clockIntervalId = setInterval(() => {
        try {
            setCurrentTimeEST(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second:'2-digit' }));
        } catch (e) {
            setCurrentTimeEST(new Date().toLocaleTimeString()); // Fallback
        }
    }, 1000); // Update every second

    return () => {
        clearInterval(intervalId);
        clearInterval(clockIntervalId);
    };
  }, []);


  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome Josh!
      </h1>
      
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialMarketOverviewData.map((market) => {
            const apiResult = marketApiData[market.polygonTicker];
            const statusInfo = marketStatuses[market.name] || { statusText: "Loading...", tooltipText: "Fetching status...", shadowClass: ""};
            
            let valueDisplay: React.ReactNode = "$0.00";
            let changeDisplay: React.ReactNode = "0.00%";
            
            if (apiResult?.loading) {
              valueDisplay = <span className="text-sm text-muted-foreground">Loading...</span>;
              changeDisplay = <span className="text-xs text-muted-foreground">Loading...</span>;
            } else if (apiResult?.error) {
              valueDisplay = <span className="text-sm text-red-400/80 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {apiResult.error}</span>;
              changeDisplay = "";
            } else if (apiResult?.c !== undefined && apiResult?.o !== undefined) {
              valueDisplay = `$${apiResult.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const percentChange = calculateChangePercent(apiResult.c, apiResult.o);
              if (percentChange !== null) {
                const changeType = percentChange >= 0 ? 'up' : 'down';
                changeDisplay = (
                  <span className={cn("text-sm font-semibold", changeType === 'up' ? 'text-green-400' : 'text-red-400')}>
                    {changeType === 'up' ? <TrendingUp className="inline-block w-4 h-4 mr-1" /> : <TrendingDown className="inline-block w-4 h-4 mr-1" />}
                    {percentChange.toFixed(2)}%
                  </span>
                );
              } else {
                changeDisplay = <span className="text-xs text-muted-foreground">N/A</span>;
              }
            }

            return (
              <PlaceholderCard 
                key={market.name} 
                title={market.name} 
                icon={market.icon || Landmark}
                className={cn(
                  "transition-all duration-300 ease-in-out", 
                  statusInfo.shadowClass
                )}
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
                        <span>{statusInfo.statusText}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{currentTimeEST.replace(/\s(AM|PM)/, '')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>{statusInfo.tooltipText}</p>
                       {apiResult?.c !== undefined && <p>Prev. Close: ${apiResult.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                       {apiResult?.o !== undefined && <p>Prev. Open: ${apiResult.o.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PlaceholderCard>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlaceholderCard title="Why the Market Moved" icon={Brain} className="lg:col-span-1 h-full">
          <p className="text-sm text-muted-foreground leading-relaxed font-serif mt-2">
            Market sentiment turned positive following the release of favorable inflation data, suggesting that price pressures may be easing. This led to a broad rally across major indices, particularly in growth-oriented sectors like technology and consumer discretionary. Investors are now keenly awaiting upcoming corporate earnings reports for further direction.
          </p>
        </PlaceholderCard>
        <PlaceholderCard title="Top News Stories" icon={Newspaper} className="lg:col-span-2 h-full">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 hidden lg:block"> {/* Spacer */} </div>
        <PlaceholderCard title="Ticker Lookup Tool" icon={Search} className="lg:col-span-2">
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
              {isLoadingTicker ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
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
    </main>
  );
}

