
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
  Cpu, 
  BarChart4,
  AlertCircle,
  Clock,
  Sparkles,
  CalendarDays,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subYears } from 'date-fns';
import { TickerPriceChart, type PriceHistoryPoint } from '@/components/charts/TickerPriceChart';

interface MarketData {
  label: string;
  polygonTicker: string;
  icon?: React.ElementType;
  openTime?: string;
  closeTime?: string;
  timezone?: string;
}

const initialMarketOverviewData: MarketData[] = [
  {
    label: 'S&P 500 (I:SPX)',
    polygonTicker: 'I:SPX',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Dow 30 (I:DJI)',
    polygonTicker: 'I:DJI',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Nasdaq (I:IXIC)',
    polygonTicker: 'I:IXIC',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Russell 2000 (I:RUT)',
    polygonTicker: 'I:RUT',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
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

interface TickerFullData {
  companyName: string;
  symbol: string;
  exchange: string;
  sector: string;
  industry: string;
  logo: string;
  marketCap: string;
  currentPrice: string;
  priceChangeAmount: string | null;
  priceChangePercent: string | null;
  previousClose: string;
  openPrice: string;
  daysRange: string;
  fiftyTwoWeekRange: string;
  volume: string;
  avgVolume: string;
  peRatio: string;
  epsTTM: string;
  dividendYield: string;
  beta: string;
  nextEarningsDate: string;
  dividendDate: string;
  priceHistory: PriceHistoryPoint[]; 
  recentNews: any[]; 
}

interface MarketStatusInfo {
  statusText: string;
  tooltipText: string;
  shadowClass: string;
}

// Function to fetch index data
const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  console.log(`[Polygon API] Attempting to use API key ending with: ...${apiKey ? apiKey.slice(-4) : 'UNDEFINED'} for symbol: ${symbol}`);

  if (!apiKey) {
    console.error("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. Please ensure it's in .env.local and the dev server was restarted.");
    return { error: 'API Key Missing. Configure in .env.local & restart server.' };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      let responseText = "";
      try {
        const errorData = await response.json();
        console.log(`[Polygon API Debug] Raw error response for ${symbol}:`, errorData); 

        if (Object.keys(errorData).length === 0 && errorData.constructor === Object) {
            console.warn(`[Polygon API Warn] Received empty JSON error object from Polygon for ${symbol}. Status: ${response.status}. This often means the API key is invalid, lacks permissions for ${symbol}, or the requested ticker is unavailable on your plan.`);
            errorMessage = `API Error: ${response.status} - Polygon returned an empty error response for ${symbol}. Check API key, permissions, or ticker availability.`;
            if (response.status === 429) { // Explicitly check for 429
              errorMessage = `API Error: 429 - You've exceeded the maximum requests per minute for ${symbol}, please wait or upgrade your subscription to continue. https://polygon.io/pricing`;
            }
        } else {
            if (errorData && errorData.message) errorMessage = `API Error: ${response.status} - ${errorData.message}`;
            else if (errorData && errorData.error) errorMessage = `API Error: ${response.status} - ${errorData.error}`;
            else if (errorData && errorData.request_id) errorMessage = `API Error: ${response.status} (Request ID: ${errorData.request_id})`;
            else errorMessage = `API Error: ${response.status} - ${response.statusText || 'Unknown error'}`;
        }
      } catch (e: any) { 
          try {
            responseText = await response.text();
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}. Status: ${response.status}. Response text snippet:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw response snippet: ${responseText.substring(0,50)}...`;
          } catch (textErr: any) {
            console.warn(`[Polygon API Warn] Could not parse JSON or text error response for ${symbol}. Status: ${response.status}. Also failed to read response as text: ${textErr.message}`);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Unknown error structure and failed to read response text.'}`;
          }
      }
      console.error(`Error fetching ${symbol}: ${errorMessage}`);
      return { error: errorMessage }; // Return the more detailed message
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { c, o } = data.results[0];
      return { c, o };
    }
    console.warn(`[Polygon API Warn] No data results found for ${symbol} in Polygon response.`);
    return { error: `No data results from Polygon for ${symbol}` };
  } catch (error: any) {
    const networkErrorMsg = `Network/Fetch error for ${symbol}: ${error.message || 'Unknown network error'}`;
    console.error(`[Polygon API Error] ${networkErrorMsg}`);
    return { error: networkErrorMsg };
  }
};

export default function DashboardPage() {
  const [marketApiData, setMarketApiData] = React.useState<Record<string, FetchedIndexData>>({});
  const [tickerQuery, setTickerQuery] = React.useState('');
  const [tickerData, setTickerData] = React.useState<TickerFullData | null>(null);
  const [isLoadingTicker, setIsLoadingTicker] = React.useState(false);
  const [tickerError, setTickerError] = React.useState<string | null>(null);
  const [marketStatuses, setMarketStatuses] = React.useState<Record<string, MarketStatusInfo>>({});
  const [currentTimeEST, setCurrentTimeEST] = React.useState<string>('Loading...');

  React.useEffect(() => {
    const loadMarketData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("[Polygon API] CRITICAL: NEXT_PUBLIC_POLYGON_API_KEY is not defined in the environment. Market data will not be fetched. Ensure .env.local is set and the dev server was restarted.");
        const errorState: Record<string, FetchedIndexData> = {};
        initialMarketOverviewData.forEach(market => {
          errorState[market.polygonTicker] = { error: 'API Key Missing. Configure in .env.local & restart server.' };
        });
        setMarketApiData(errorState);
        return;
      }
      console.log("[Polygon API] Initiating market data fetch for overview cards.");

      const initialApiDataState: Record<string, FetchedIndexData> = {};
      initialMarketOverviewData.forEach(market => {
        initialApiDataState[market.polygonTicker] = { loading: true };
      });
      setMarketApiData(initialApiDataState);

      const promises = initialMarketOverviewData.map(market =>
        fetchIndexData(market.polygonTicker).then(data => ({ symbol: market.polygonTicker, data }))
      );

      const results = await Promise.allSettled(promises);

      const newApiData: Record<string, FetchedIndexData> = {};
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          newApiData[result.value.symbol] = result.value.data;
        } else {
          console.error("[Polygon API] Promise rejected unexpectedly in loadMarketData for overview cards:", result.reason);
          // Potentially set an error state for the specific symbol if result.reason contains it
          // This part might need adjustment if result.reason is not structured as expected
          // For now, the fetchIndexData itself handles setting the error for its specific symbol.
        }
      });
      setMarketApiData(prevData => ({ ...prevData, ...newApiData }));
    };
    loadMarketData();
  }, []);

  const calculateChangePercent = (currentPrice?: number, openPrice?: number) => {
    if (typeof currentPrice !== 'number' || typeof openPrice !== 'number' || openPrice === 0 || isNaN(currentPrice) || isNaN(openPrice)) {
      return null;
    }
    return ((currentPrice - openPrice) / openPrice) * 100;
  };

  const handleTickerLookup = async () => {
    if (!tickerQuery.trim()) return;
    setIsLoadingTicker(true);
    setTickerData(null);
    setTickerError(null);

    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) {
      setTickerError("API Key is missing. Please configure NEXT_PUBLIC_POLYGON_API_KEY in .env.local and restart the server.");
      setIsLoadingTicker(false);
      return;
    }

    const symbol = tickerQuery.toUpperCase();
    const toDate = format(new Date(), 'yyyy-MM-dd');
    const fromDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

    try {
      console.log(`[Ticker Lookup] Fetching details for ${symbol} using API key: ******${apiKey.slice(-4)}`);
      const [detailsRes, prevDayRes, historyRes] = await Promise.all([
        fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`),
        fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`),
        fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`)
      ]);

      let companyDetails: any = {};
      let detailsError: string | null = null;
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        companyDetails = detailsData.results || {};
      } else {
        detailsError = `Details: ${detailsRes.statusText || detailsRes.status}`;
        console.warn(`[Ticker Lookup] Failed to fetch details for ${symbol}: ${detailsRes.status} - ${await detailsRes.text()}`);
      }

      let ohlcvData: any = {};
      let prevDayError: string | null = null;
      if (prevDayRes.ok) {
        const prevDayData = await prevDayRes.json();
        ohlcvData = (prevDayData.results && prevDayData.results.length > 0) ? prevDayData.results[0] : {};
      } else {
        prevDayError = `Prev. Day: ${prevDayRes.statusText || prevDayRes.status}`;
        console.warn(`[Ticker Lookup] Failed to fetch previous day OHLCV for ${symbol}: ${prevDayRes.status} - ${await prevDayRes.text()}`);
      }
      
      let priceHistoryPoints: PriceHistoryPoint[] = [];
      let historyError: string | null = null;
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.results) {
          priceHistoryPoints = historyData.results.map((r: any) => ({
            date: format(new Date(r.t), 'yyyy-MM-dd'),
            close: r.c,
          }));
        }
      } else {
        historyError = `History: ${historyRes.statusText || historyRes.status}`;
        console.warn(`[Ticker Lookup] Failed to fetch price history for ${symbol}: ${historyRes.status} - ${await historyRes.text()}`);
      }

      if (Object.keys(companyDetails).length === 0 && Object.keys(ohlcvData).length === 0) {
        let combinedError = `No data found for ticker ${symbol}.`;
        const apiErrors = [detailsError, prevDayError, historyError].filter(Boolean).join(', ');
        if (apiErrors) {
            combinedError += ` API Issues: ${apiErrors}`;
        }
        setTickerError(combinedError);
        setIsLoadingTicker(false);
        return;
      }

      const currentPrice = ohlcvData.c;
      const openPrice = ohlcvData.o;
      const priceChangeAmount = typeof currentPrice === 'number' && typeof openPrice === 'number' ? (currentPrice - openPrice) : null;
      const priceChangePercent = calculateChangePercent(currentPrice, openPrice);

      setTickerData({
        companyName: companyDetails.name || `${symbol} (Name N/A)`,
        symbol: companyDetails.ticker || symbol,
        exchange: companyDetails.primary_exchange || "N/A",
        sector: companyDetails.sic_description || "N/A", 
        industry: companyDetails.sic_description || "N/A", 
        logo: companyDetails.branding?.logo_url ? `${companyDetails.branding.logo_url}?apiKey=${apiKey}` : `https://placehold.co/48x48.png?text=${symbol}`,
        marketCap: companyDetails.market_cap ? (companyDetails.market_cap / 1_000_000_000).toFixed(2) + "B" : "N/A",
        currentPrice: typeof currentPrice === 'number' ? currentPrice.toFixed(2) : "N/A",
        priceChangeAmount: typeof priceChangeAmount === 'number' ? priceChangeAmount.toFixed(2) : "N/A",
        priceChangePercent: typeof priceChangePercent === 'number' ? priceChangePercent.toFixed(2) : "N/A",
        previousClose: typeof ohlcvData.c === 'number' ? ohlcvData.c.toFixed(2) : "N/A", // Previous day's close
        openPrice: typeof ohlcvData.o === 'number' ? ohlcvData.o.toFixed(2) : "N/A", // Previous day's open
        daysRange: (typeof ohlcvData.l === 'number' && typeof ohlcvData.h === 'number') ? `${ohlcvData.l.toFixed(2)} - ${ohlcvData.h.toFixed(2)}` : "N/A", // Previous day's range
        fiftyTwoWeekRange: "N/A", // Requires different endpoint or calculation
        volume: typeof ohlcvData.v === 'number' ? ohlcvData.v.toLocaleString() : "N/A", // Previous day's volume
        avgVolume: "N/A", // Requires different endpoint or calculation
        peRatio: "N/A", // Requires different endpoint
        epsTTM: "N/A", // Requires different endpoint
        dividendYield: "N/A", // Requires different endpoint
        beta: "N/A", // Requires different endpoint
        nextEarningsDate: "N/A", // Requires different endpoint
        dividendDate: "N/A", // Requires different endpoint
        priceHistory: priceHistoryPoints,
        recentNews: [], // Placeholder, requires news API
      });

    } catch (error: any) {
      console.error("[Ticker Lookup] Error in handleTickerLookup:", error);
      setTickerError(`Failed to fetch data for ${symbol}. ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoadingTicker(false);
    }
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
        console.warn("Error formatting EST time for market status, defaulting to local time for logic:", e);
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

            const marketOpenTimeToday = new Date(todayForLogic);
            marketOpenTimeToday.setHours(openHour, openMinute, 0, 0);

            const marketCloseTimeToday = new Date(todayForLogic);
            marketCloseTimeToday.setHours(closeHour, closeMinute, 0, 0);
            
            const currentTimeWithEstHours = new Date(todayForLogic);
            currentTimeWithEstHours.setHours(currentHourEST, currentMinuteEST, 0, 0);

            const isCurrentlyOpen =
                currentTimeWithEstHours >= marketOpenTimeToday &&
                currentTimeWithEstHours < marketCloseTimeToday;

            const timeToCloseMs = marketCloseTimeToday.getTime() - currentTimeWithEstHours.getTime();
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
            
            newStatuses[market.label] = { statusText, tooltipText, shadowClass };
        } else {
            newStatuses[market.label] = { statusText: "Status N/A", tooltipText: "Market hours not defined", shadowClass: "" };
        }
      });
      setMarketStatuses(newStatuses);
    };
    
    updateMarketStatuses();
    const intervalId = setInterval(updateMarketStatuses, 60000);
    const clockIntervalId = setInterval(() => {
        try {
            setCurrentTimeEST(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second:'2-digit' }));
        } catch (e) {
            setCurrentTimeEST(new Date().toLocaleTimeString());
        }
    }, 1000);

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
            const statusInfo = marketStatuses[market.label] || { statusText: "Loading...", tooltipText: "Fetching status...", shadowClass: ""};
            
            let valueDisplay: React.ReactNode = "$0.00";
            let changeDisplay: React.ReactNode = "0.00%";
            
            if (apiResult?.loading) {
              valueDisplay = <span className="text-sm text-muted-foreground">Loading...</span>;
              changeDisplay = <span className="text-xs text-muted-foreground">Loading...</span>;
            } else if (apiResult?.error) {
                let displayError = apiResult.error;
                if (apiResult.error.includes("429")) {
                    displayError = "Rate Limit Exceeded";
                } else if (apiResult.error.includes("401") || apiResult.error.toLowerCase().includes("unknown api key")) {
                    displayError = "Auth Error";
                } else if (apiResult.error.includes("API Key Missing")) {
                    displayError = "Key Missing";
                } else if (apiResult.error.includes("No data")) {
                    displayError = "No Data";
                }
              valueDisplay = <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="text-sm text-red-400/80 flex items-center truncate"><AlertCircle className="w-4 h-4 mr-1 shrink-0" /> {displayError}</span></TooltipTrigger><TooltipContent><p>{apiResult.error}</p></TooltipContent></Tooltip></TooltipProvider>;
              changeDisplay = "";
            } else if (apiResult?.c !== undefined && apiResult?.o !== undefined) {
              valueDisplay = `$${apiResult.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const percentChange = calculateChangePercent(apiResult.c, apiResult.o);
              const pointsChange = apiResult.c - apiResult.o;

              if (percentChange !== null) {
                const changeType = percentChange >= 0 ? 'up' : 'down';
                changeDisplay = (
                  <span className={cn("text-sm font-semibold", changeType === 'up' ? 'text-green-400' : 'text-red-400')}>
                    {changeType === 'up' ? <TrendingUp className="inline-block w-4 h-4 mr-1" /> : <TrendingDown className="inline-block w-4 h-4 mr-1" />}
                    {pointsChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                  </span>
                );
              } else {
                changeDisplay = <span className="text-xs text-muted-foreground">N/A</span>;
              }
            }

            return (
              <PlaceholderCard
                key={market.polygonTicker}
                title={market.label}
                icon={market.icon || Landmark}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  statusInfo.shadowClass
                )}
              >
                <div className="text-2xl font-bold text-foreground mb-1 truncate" title={typeof valueDisplay === 'string' ? valueDisplay : undefined}>{valueDisplay}</div>
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
        <PlaceholderCard title="Why the Market Moved" icon={Cpu} className="lg:col-span-1 h-full">
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
         <PlaceholderCard title="Ticker Lookup Tool" icon={Search} className="lg:col-span-3">
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
          {isLoadingTicker && <div className="text-center py-4"><Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" /></div>}
          {tickerError && <p className="text-sm text-red-400 text-center p-2 bg-red-500/10 rounded-md">{tickerError}</p>}
          
          {tickerData && !isLoadingTicker && (
            <div className="w-full">
              <div className="w-full p-4 md:p-6 flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-3">
                  <Image src={tickerData.logo} alt={`${tickerData.companyName} logo`} width={48} height={48} className="rounded-md bg-muted p-1 object-contain" data-ai-hint={`${tickerData.symbol} logo`}/>
                  <h3 className="text-2xl font-bold text-foreground">{tickerData.companyName}</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  {tickerData.symbol} • {tickerData.exchange}
                </p>
                 <div className="flex flex-row items-end gap-3 mb-3 justify-center">
                  <p className="text-4xl font-bold text-foreground">${tickerData.currentPrice}</p>
                  {(tickerData.priceChangeAmount && tickerData.priceChangeAmount !== "N/A" && tickerData.priceChangePercent && tickerData.priceChangePercent !== "N/A") && (
                     <p className={cn(
                      "text-2xl font-semibold",
                      parseFloat(tickerData.priceChangeAmount) >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {parseFloat(tickerData.priceChangeAmount) >= 0 ? <ArrowUpRight className="inline h-5 w-5 mb-1" /> : <ArrowDownRight className="inline h-5 w-5 mb-1" />}
                      {tickerData.priceChangeAmount} ({tickerData.priceChangePercent}%)
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Prev. Close: ${tickerData.previousClose} &nbsp;|&nbsp; Open: ${tickerData.openPrice}
                </div>
              </div>

              <div className="w-full pt-4 mt-4 border-t border-border/30">
                 <h4 className="text-md font-semibold text-foreground mb-2 text-center">Valuation Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs text-center md:text-left">
                  <div><strong className="text-muted-foreground block">Market Cap:</strong> {tickerData.marketCap}</div>
                  <div><strong className="text-muted-foreground block">Day's Range:</strong> {tickerData.daysRange}</div>
                  <div><strong className="text-muted-foreground block">52W Range:</strong> {tickerData.fiftyTwoWeekRange}</div>
                  <div><strong className="text-muted-foreground block">Volume:</strong> {tickerData.volume}</div>
                  <div><strong className="text-muted-foreground block">Avg. Volume:</strong> {tickerData.avgVolume}</div>
                  <div><strong className="text-muted-foreground block">P/E Ratio (TTM):</strong> {tickerData.peRatio}</div>
                  <div><strong className="text-muted-foreground block">EPS (TTM):</strong> {tickerData.epsTTM}</div>
                  <div><strong className="text-muted-foreground block">Div. Yield:</strong> {tickerData.dividendYield}</div>
                  <div><strong className="text-muted-foreground block">Beta:</strong> {tickerData.beta}</div>
                </div>
              </div>

              <div className="w-full pt-4 mt-4 border-t border-border/30">
                <h4 className="text-md font-semibold text-foreground mb-2 text-center">Key Dates</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-center md:text-left">
                  <div><strong className="text-muted-foreground block">Next Earnings:</strong> {tickerData.nextEarningsDate}</div>
                  <div><strong className="text-muted-foreground block">Dividend Date:</strong> {tickerData.dividendDate}</div>
                </div>
              </div>
              
              <div className="w-full pt-4 mt-4 border-t border-border/30">
                <h4 className="text-md font-semibold text-foreground mb-2 text-center">Price History (1 Year)</h4>
                {tickerData.priceHistory && tickerData.priceHistory.length > 0 ? (
                  <div className="h-[400px] w-full bg-muted/10 rounded-md p-2" data-ai-hint="stock line chart">
                     <TickerPriceChart data={tickerData.priceHistory} />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">Price history not available.</p>
                )}
              </div>

              <div className="w-full pt-4 mt-4 border-t border-border/30">
                <h4 className="text-md font-semibold text-foreground mb-2 text-center">Recent News</h4>
                {tickerData.recentNews && tickerData.recentNews.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {tickerData.recentNews.map((newsItem: any, index: number) => (
                      <li key={index} className="pb-1 border-b border-border/20 last:border-b-0">
                        <a href={newsItem.article_url || '#'} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary cursor-pointer">
                          {newsItem.title || 'Untitled News'}
                        </a>
                        <p className={cn(
                          "text-xs",
                           newsItem.sentiment === 'positive' ? 'text-green-400' :
                           newsItem.sentiment === 'negative' ? 'text-red-400' :
                           'text-muted-foreground'
                        )}>
                          {newsItem.publisher?.name || 'Unknown Source'} - {newsItem.sentiment || 'Neutral'}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                   <p className="text-xs text-muted-foreground text-center py-4">No recent news available for this ticker.</p>
                )}
              </div>
            </div>
          )}
        </PlaceholderCard>
      </div>
    </main>
  );
}


    