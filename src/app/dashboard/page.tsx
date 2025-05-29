
"use client";

import * as React from "react";
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
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subYears, formatDistanceToNowStrict, parseISO } from 'date-fns';
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
    polygonTicker: 'I:SPX', // Correct Polygon.io ticker for S&P 500 Index
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Dow 30 (I:DJI)',
    polygonTicker: 'I:DJI', // Correct Polygon.io ticker for Dow Jones Industrial Average
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Nasdaq (I:IXIC)',
    polygonTicker: 'I:IXIC', // Correct Polygon.io ticker for Nasdaq Composite
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Russell 2000 (I:RUT)',
    polygonTicker: 'I:RUT', // Correct Polygon.io ticker for Russell 2000 Index
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
];

const getNewsSentimentBadgeClass = (sentiment?: string) => {
  switch (sentiment?.toLowerCase()) {
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

const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  console.log(`[Polygon API] Attempting to use API key ending with: ...${apiKey ? apiKey.slice(-4) : 'UNDEFINED'} for symbol: ${symbol}`);

  if (!apiKey) {
    console.error("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. Please ensure it's in .env.local and the dev server was restarted.");
    return { error: 'API Key Missing. Configure in .env.local & restart server.' };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    let errorMessage = `API Error: ${response.status}`;

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log(`[Polygon API Debug] Raw error response for ${symbol}:`, errorData); 
        if (Object.keys(errorData).length === 0 && errorData.constructor === Object) {
           console.warn(`[Polygon API Warn] Received empty JSON error object from Polygon for ${symbol}. Status: ${response.status}. This often means the API key is invalid or lacks permissions for ${symbol}.`);
           errorMessage = `API Error: ${response.status} - Polygon returned an empty error response for ${symbol}. Check API key, permissions, or ticker availability.`;
           if (response.status === 429) { 
              errorMessage = `API Error: 429 - You've exceeded the maximum requests per minute for ${symbol}, please wait or upgrade your subscription to continue. https://polygon.io/pricing`;
           }
        } else if (errorData && errorData.message) {
          errorMessage = `API Error: ${response.status} - ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `API Error: ${response.status} - ${errorData.error}`;
        } else if (errorData && errorData.request_id) {
          errorMessage = `API Error: ${response.status} (Request ID: ${errorData.request_id})`;
        } else {
            const responseText = await response.text();
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}, but got text. Status: ${response.status}. Response text snippet:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw response snippet: ${responseText.substring(0,50)}...`;
        }
      } catch (e: any) { 
          try {
            const responseText = await response.text();
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}. Status: ${response.status}. Response text snippet:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw response snippet: ${responseText.substring(0,50)}...`;
          } catch (textErr: any) {
            console.warn(`[Polygon API Warn] Could not parse JSON or text error response for ${symbol}. Status: ${response.status}. Also failed to read response as text: ${textErr.message}`);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Unknown error structure and failed to read response text.'}`;
          }
      }
      console.error(`Error fetching ${symbol}: ${errorMessage}`);
      return { error: errorMessage };
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

// Function to fetch news data
const fetchNewsData = async (): Promise<any[]> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  if (!apiKey) {
    console.error("[Polygon API] News: API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. News will not be fetched.");
    throw new Error("API Key for news missing. Configure in .env.local.");
  }
  const url = `https://api.polygon.io/v2/reference/news?order=desc&limit=5&sort=published_utc&apiKey=${apiKey}`;
  console.log(`[Polygon API] Fetching news from: ${url.replace(apiKey, '******' + apiKey.slice(-4))}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorMessage = `News API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (Object.keys(errorData).length === 0 && errorData.constructor === Object) {
          errorMessage = `News API Error: ${response.status} - Polygon returned an empty error response. Check API key/permissions.`;
        } else if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        } else if (errorData.error) {
          errorMessage += ` - ${errorData.error}`;
        } else {
          errorMessage += ` - ${response.statusText}`;
        }
      } catch (e) {
         errorMessage += ` - ${response.statusText || 'Failed to parse error JSON.'}`;
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch news data:", error.message);
    throw error; 
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
  
  const [newsData, setNewsData] = React.useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = React.useState(true);
  const [newsError, setNewsError] = React.useState<string | null>(null);


  React.useEffect(() => {
    const loadMarketData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("[Polygon API] CRITICAL: NEXT_PUBLIC_POLYGON_API_KEY is not defined in the environment. Market data will not be fetched. Ensure .env.local is set and the dev server was restarted.");
        const errorState: Record<string, FetchedIndexData> = {};
        initialMarketOverviewData.forEach(market => {
          errorState[market.polygonTicker] = { error: 'API Key Missing. Check .env.local & restart server.' };
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
        }
      });
      setMarketApiData(prevData => ({ ...prevData, ...newApiData }));
    };

    const loadNews = async () => {
      setIsLoadingNews(true);
      setNewsError(null);
      try {
        const fetchedNews = await fetchNewsData();
        setNewsData(fetchedNews);
      } catch (error: any) {
        setNewsError(error.message || "Failed to load news.");
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadMarketData();
    loadNews();
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
        const errorText = await detailsRes.text();
        detailsError = `Details: ${detailsRes.statusText || detailsRes.status} - ${errorText.substring(0,100)}`;
        console.warn(`[Ticker Lookup] Failed to fetch details for ${symbol}: ${detailsRes.status} - ${errorText}`);
      }

      let ohlcvData: any = {};
      let prevDayError: string | null = null;
      if (prevDayRes.ok) {
        const prevDayData = await prevDayRes.json();
        ohlcvData = (prevDayData.results && prevDayData.results.length > 0) ? prevDayData.results[0] : {};
      } else {
        const errorText = await prevDayRes.text();
        prevDayError = `Prev. Day: ${prevDayRes.statusText || prevDayRes.status} - ${errorText.substring(0,100)}`;
        console.warn(`[Ticker Lookup] Failed to fetch previous day OHLCV for ${symbol}: ${prevDayRes.status} - ${errorText}`);
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
        const errorText = await historyRes.text();
        historyError = `History: ${historyRes.statusText || historyRes.status} - ${errorText.substring(0,100)}`;
        console.warn(`[Ticker Lookup] Failed to fetch price history for ${symbol}: ${historyRes.status} - ${errorText}`);
      }

      if (!detailsRes.ok && !prevDayRes.ok && !historyRes.ok) {
        let combinedError = `No data found for ticker ${symbol}. `;
        if (detailsRes.status === 404 && prevDayRes.status === 404) {
          combinedError = `Ticker symbol "${symbol}" not found. Please check the symbol and try again.`;
        } else if (detailsRes.status === 401 || prevDayRes.status === 401 || historyRes.status === 401) {
          combinedError = `API Error: 401 - Unauthorized. Please check your Polygon API key and plan permissions for ticker ${symbol}.`;
        } else {
            const apiErrors = [detailsError, prevDayError, historyError].filter(Boolean).join('; ');
            if (apiErrors) combinedError += ` API Issues: ${apiErrors}`;
        }
        setTickerError(combinedError);
        setIsLoadingTicker(false);
        return;
      }
      
      if (Object.keys(companyDetails).length === 0 && Object.keys(ohlcvData).length === 0) {
         setTickerError(`No detailed data or price data found for ticker ${symbol}. It might be an invalid symbol or not covered by the API.`);
         setIsLoadingTicker(false);
         return;
      }

      const currentPrice = ohlcvData.c;
      const openPrice = ohlcvData.o; // Previous day's open for daily change calc
      const priceChangeAmount = typeof currentPrice === 'number' && typeof openPrice === 'number' ? (currentPrice - openPrice) : null;
      const priceChangePercent = calculateChangePercent(currentPrice, openPrice);

      setTickerData({
        companyName: companyDetails.name || `${symbol} (Name N/A)`,
        symbol: companyDetails.ticker || symbol,
        exchange: companyDetails.primary_exchange || "N/A",
        sector: companyDetails.sic_description || "N/A", 
        industry: companyDetails.sic_description || "N/A", 
        logo: companyDetails.branding?.logo_url ? `${companyDetails.branding.logo_url}?apiKey=${apiKey}` : `https://placehold.co/48x48.png?text=${symbol.substring(0,3)}`,
        marketCap: companyDetails.market_cap ? (companyDetails.market_cap / 1_000_000_000).toFixed(2) + "B" : "N/A",
        currentPrice: typeof currentPrice === 'number' ? currentPrice.toFixed(2) : "N/A",
        priceChangeAmount: typeof priceChangeAmount === 'number' ? priceChangeAmount.toFixed(2) : "N/A",
        priceChangePercent: typeof priceChangePercent === 'number' ? priceChangePercent.toFixed(2) : "N/A",
        previousClose: typeof ohlcvData.c === 'number' ? ohlcvData.c.toFixed(2) : "N/A", // Prev close is the 'c' from /prev
        openPrice: typeof ohlcvData.o === 'number' ? ohlcvData.o.toFixed(2) : "N/A", // Prev open is 'o' from /prev
        daysRange: (typeof ohlcvData.l === 'number' && typeof ohlcvData.h === 'number') ? `${ohlcvData.l.toFixed(2)} - ${ohlcvData.h.toFixed(2)}` : "N/A", // This is prev day's range
        fiftyTwoWeekRange: "N/A", // Requires different endpoint or calculation
        volume: typeof ohlcvData.v === 'number' ? ohlcvData.v.toLocaleString() : "N/A", // Prev day's volume
        avgVolume: "N/A", // Requires different endpoint
        peRatio: "N/A", // Requires different endpoint
        epsTTM: "N/A", // Requires different endpoint
        dividendYield: "N/A", // Requires different endpoint
        beta: "N/A", // Requires different endpoint
        nextEarningsDate: "N/A", // Requires different endpoint
        dividendDate: "N/A", // Requires different endpoint
        priceHistory: priceHistoryPoints,
        recentNews: [], // Placeholder, news fetch not integrated here
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
    <main className="min-h-screen flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
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
        <PlaceholderCard title="Why the Market Moved" icon={Brain} className="lg:col-span-1 h-full">
          <p className="text-sm text-muted-foreground leading-relaxed font-serif mt-2">
            Market sentiment turned positive following the release of favorable inflation data, suggesting that price pressures may be easing. This led to a broad rally across major indices, particularly in growth-oriented sectors like technology and consumer discretionary. Investors are now keenly awaiting upcoming corporate earnings reports for further direction.
          </p>
        </PlaceholderCard>
        <PlaceholderCard title="Top News Stories" icon={Newspaper} className="lg:col-span-2 h-full">
          {isLoadingNews && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {newsError && (
            <div className="flex flex-col items-center justify-center h-32 text-red-400">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">{newsError}</p>
            </div>
          )}
          {!isLoadingNews && !newsError && newsData.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No news available.</p>
          )}
          {!isLoadingNews && !newsError && newsData.length > 0 && (
            <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {newsData.map((item) => (
                <li key={item.id || item.article_url} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <a 
                      href={item.article_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate"
                      title={item.title}
                    >
                      {item.title}
                    </a>
                    {item.sentiment && (
                      <Badge variant="outline" className={cn("text-xs whitespace-nowrap ml-2", getNewsSentimentBadgeClass(item.sentiment))}>
                        {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2" title={item.description}>{item.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/70">
                    <span>{item.publisher?.name || 'Unknown Source'}</span>
                    <span>{formatDistanceToNowStrict(parseISO(item.published_utc), { addSuffix: true })}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PlaceholderCard>
      </div>
      
      <PlaceholderCard title="Ticker Lookup Tool" icon={Search} className="lg:col-span-3">
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Enter stock ticker (e.g., AAPL)"
            className="flex-1 bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
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
          <div className="w-full p-4 md:p-0 space-y-6">
            {/* Simplified Header */}
            <div className="text-left mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-1">{tickerData.companyName}</h3>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-foreground">${tickerData.currentPrice}</span>
                {(tickerData.priceChangeAmount && tickerData.priceChangeAmount !== "N/A" && tickerData.priceChangePercent && tickerData.priceChangePercent !== "N/A") && (
                  <span className={cn(
                    "text-xl font-semibold",
                    parseFloat(tickerData.priceChangeAmount) >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {parseFloat(tickerData.priceChangeAmount) >= 0 ? <ArrowUpRight className="inline h-5 w-5 mb-0.5" /> : <ArrowDownRight className="inline h-5 w-5 mb-0.5" />}
                    {tickerData.priceChangeAmount} ({tickerData.priceChangePercent}%)
                  </span>
                )}
                 <span className="text-lg text-muted-foreground">Change</span> 
              </div>
            </div>

            {/* Price History Chart (Full Width) */}
            <div className="w-full">
              <h4 className="text-lg font-semibold text-foreground mb-3 text-left">Price History (1 Year)</h4>
              {tickerData.priceHistory && tickerData.priceHistory.length > 0 ? (
                <div className="h-[400px] w-full bg-muted/10 rounded-md p-2" data-ai-hint="stock line chart">
                   <TickerPriceChart data={tickerData.priceHistory} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Price history not available.</p>
              )}
            </div>
            
          </div>
        )}
      </PlaceholderCard>
    </main>
  );
}

