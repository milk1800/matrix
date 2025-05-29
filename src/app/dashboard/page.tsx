
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
  AlertCircle,
  Clock,
  Cpu,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subYears, formatDistanceToNowStrict, parseISO, startOfYear, isWithinInterval, subDays, subMonths, endOfDay, startOfDay } from 'date-fns';
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
    label: 'S&P 500 (SPX)',
    polygonTicker: 'I:SPX',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Dow 30 (DJI)',
    polygonTicker: 'I:DJI',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Nasdaq (IXIC)',
    polygonTicker: 'I:IXIC',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Russell 2000 (RUT)',
    polygonTicker: 'I:RUT',
    icon: Landmark,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
];

interface FetchedIndexData {
  c?: number; // Close price
  o?: number; // Open price
  error?: string;
  loading?: boolean;
}

interface TickerCompanyDetails {
  name?: string;
  ticker?: string;
  primary_exchange?: string;
  // sic_description?: string; 
  // branding?: { logo_url?: string };
  // market_cap?: number;
}

interface TickerPrevDayData {
  c?: number; // Close
  o?: number; // Open
  // h?: number; // High
  // l?: number; // Low
  // v?: number; // Volume
}
interface TickerFullData {
  companyName: string;
  // symbol: string;
  // exchange: string;
  // sector: string;
  // industry: string;
  // logo: string;
  // marketCap: string;
  currentPrice: string;
  priceChangeAmount: string | null;
  priceChangePercent: string | null;
  // previousClose: string;
  // openPrice: string;
  // daysRange: string;
  fullPriceHistory: PriceHistoryPoint[]; 
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
    console.warn("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. UI will show API Key Missing error.");
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
           const specificMessage = `Polygon returned an empty error response for ${symbol}. Check API key, permissions, or ticker availability. Status: ${response.status}.`;
           console.warn(`[Polygon API Warn] ${specificMessage}`);
           errorMessage = `API Error: ${response.status} - ${specificMessage}`;
        } else if (errorData && errorData.message) {
          errorMessage = `API Error: ${response.status} - ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `API Error: ${response.status} - ${errorData.error}`;
        } else if (errorData && errorData.request_id) {
           errorMessage = `API Error: ${response.status} (Request ID: ${errorData.request_id})`;
        } else {
            const responseText = await response.text();
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}, but got text. Status: ${response.status}. Response text snippet:`, snippet);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw response snippet: ${snippet.substring(0,50)}...`;
        }
      } catch (e: any) { 
          try {
            const responseText = await response.text();
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}. Status: ${response.status}. Response text snippet:`, snippet);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw response snippet: ${snippet.substring(0,50)}...`;
          } catch (textErr: any) {
            console.warn(`[Polygon API Warn] Could not parse JSON or text error response for ${symbol}. Status: ${response.status}. Also failed to read response as text: ${textErr.message}`);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Unknown error structure and failed to read response text.'}`;
          }
      }
      if (response.status === 429) {
        errorMessage = `API Error: 429 - You've exceeded the maximum requests per minute for ${symbol}, please wait or upgrade your subscription to continue. https://polygon.io/pricing`;
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

const fetchNewsData = async (): Promise<any[]> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  if (!apiKey) {
    console.error("[Polygon API] News: API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set. News will not be fetched.");
    throw new Error("API Key for news missing. Configure in .env.local.");
  }
  const url = `https://api.polygon.io/v2/reference/news?order=desc&limit=5&sort=published_utc&apiKey=${apiKey}`;

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
        } else if (errorData.request_id) {
          errorMessage += ` (Request ID: ${errorData.request_id})`;
        }
         else {
          const responseText = await response.text();
          errorMessage += ` - ${responseText.substring(0, 100) || response.statusText}`;
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

  const [selectedRange, setSelectedRange] = React.useState<string>('1Y');
  const [chartData, setChartData] = React.useState<PriceHistoryPoint[]>([]);


  React.useEffect(() => {
    const loadMarketData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("[Polygon API] CRITICAL: NEXT_PUBLIC_POLYGON_API_KEY is not defined. Market data will not be fetched. Ensure .env.local is set & server restarted.");
        const errorState: Record<string, FetchedIndexData> = {};
        initialMarketOverviewData.forEach(market => {
          errorState[market.polygonTicker] = { error: 'API Key Missing. Check .env.local & restart server.' };
        });
        setMarketApiData(errorState);
        return;
      }

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

  const getChartDataForRange = (fullHistory: PriceHistoryPoint[], range: string): PriceHistoryPoint[] => {
    if (!fullHistory || fullHistory.length === 0) return [];
    const today = endOfDay(new Date()); // Use end of today for YTD consistency

    switch (range) {
      case '1D':
        // For 1D, we might want the last 2 data points to draw a line.
        // If data is daily, this might just be the last point, or last two if available.
        // This logic might need refinement based on actual data granularity.
        return fullHistory.slice(-2); 
      case '1W':
        // For 1W, take the last 7 calendar days worth of data points.
        const oneWeekAgo = startOfDay(subDays(today, 6)); // 7 days including today
        return fullHistory.filter(point => parseISO(point.date) >= oneWeekAgo);
      case '1M':
        const oneMonthAgo = startOfDay(subMonths(today, 1));
        return fullHistory.filter(point => parseISO(point.date) >= oneMonthAgo);
      case '3M':
        const threeMonthsAgo = startOfDay(subMonths(today, 3));
        return fullHistory.filter(point => parseISO(point.date) >= threeMonthsAgo);
      case 'YTD':
        const startOfTheYear = startOfYear(today);
        return fullHistory.filter(point => parseISO(point.date) >= startOfTheYear);
      case '1Y':
      default:
        return fullHistory; // Already fetched for 1 year
    }
  };


  React.useEffect(() => {
    if (tickerData?.fullPriceHistory) {
      setChartData(getChartDataForRange(tickerData.fullPriceHistory, selectedRange));
    }
  }, [tickerData?.fullPriceHistory, selectedRange]);


  const handleTickerLookup = async () => {
    if (!tickerQuery.trim()) return;
    setIsLoadingTicker(true);
    setTickerData(null);
    setTickerError(null);
    setSelectedRange('1Y'); 

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
      console.log(`[Polygon API] Ticker Lookup: Fetching details for ${symbol} using API key: ******${apiKey.slice(-4)}`);
      
      const [detailsRes, prevDayRes, historyRes] = await Promise.all([
        fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`),
        fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`),
        fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`)
      ]);

      let companyDetails: TickerCompanyDetails = {};
      let prevDayData: TickerPrevDayData = {};
      let priceHistoryPoints: PriceHistoryPoint[] = [];
      let fetchErrors: string[] = [];

      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        companyDetails = detailsData.results || {};
      } else {
        const errorText = await detailsRes.text();
        fetchErrors.push(`Details: ${detailsRes.status} - ${errorText.substring(0,100)}`);
        console.warn(`[Polygon API Ticker Lookup] Failed to fetch details for ${symbol}: ${detailsRes.status} - ${errorText}`);
      }

      if (prevDayRes.ok) {
        const prevDayJson = await prevDayRes.json();
        prevDayData = (prevDayJson.results && prevDayJson.results.length > 0) ? prevDayJson.results[0] : {};
      } else {
         const errorText = await prevDayRes.text();
        fetchErrors.push(`Prev. Day: ${prevDayRes.status} - ${errorText.substring(0,100)}`);
        console.warn(`[Polygon API Ticker Lookup] Failed to fetch previous day OHLCV for ${symbol}: ${prevDayRes.status} - ${errorText}`);
      }
      
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
        fetchErrors.push(`History: ${historyRes.status} - ${errorText.substring(0,100)}`);
        console.warn(`[Polygon API Ticker Lookup] Failed to fetch price history for ${symbol}: ${historyRes.status} - ${errorText}`);
      }

      if (Object.keys(companyDetails).length === 0 && Object.keys(prevDayData).length === 0) {
        let combinedError = `No primary data found for ticker ${symbol}.`;
         if (fetchErrors.some(e => e.includes("404"))) {
          combinedError = `Ticker symbol "${symbol}" not found. Please check the symbol and try again.`;
        } else if (fetchErrors.some(e => e.includes("401"))) {
            combinedError = `API Error: 401 - Unauthorized. Please check your Polygon API key and plan permissions for ticker ${symbol}.`;
        } else if (fetchErrors.length > 0) {
            combinedError += ` API Issues: ${fetchErrors.join('; ')}`;
        }
        setTickerError(combinedError);
        setIsLoadingTicker(false);
        return;
      }
      
      const currentPrice = prevDayData.c;
      const openPriceForDailyChange = prevDayData.o; 
      const priceChangeNum = typeof currentPrice === 'number' && typeof openPriceForDailyChange === 'number' ? (currentPrice - openPriceForDailyChange) : null;
      const priceChangePercentNum = calculateChangePercent(currentPrice, openPriceForDailyChange);

      setTickerData({
        companyName: companyDetails.name || `${symbol} (Name N/A)`,
        currentPrice: typeof currentPrice === 'number' ? currentPrice.toFixed(2) : "N/A",
        priceChangeAmount: typeof priceChangeNum === 'number' ? priceChangeNum.toFixed(2) : "N/A",
        priceChangePercent: typeof priceChangePercentNum === 'number' ? priceChangePercentNum.toFixed(2) : "N/A",
        fullPriceHistory: priceHistoryPoints,
        // The following fields are removed as per the new minimal header requirement
        symbol: companyDetails.ticker || symbol, // Kept for internal use if needed
        exchange: companyDetails.primary_exchange || "N/A", // Kept for internal use
        sector: companyDetails.sic_description || "N/A", // Kept for internal use
        industry: companyDetails.sic_description || "N/A", // Kept for internal use
        logo: companyDetails.branding?.logo_url ? `${companyDetails.branding.logo_url}?apiKey=${apiKey}` : `https://placehold.co/48x48.png?text=${symbol.substring(0,3)}`, // Kept for internal use
        marketCap: companyDetails.market_cap ? (companyDetails.market_cap / 1_000_000_000).toFixed(2) + "B" : "N/A", // Kept for internal use
        previousClose: typeof prevDayData.c === 'number' ? prevDayData.c.toFixed(2) : "N/A", // Kept for internal use
        openPrice: typeof prevDayData.o === 'number' ? prevDayData.o.toFixed(2) : "N/A", // Kept for internal use
        daysRange: (typeof prevDayData.l === 'number' && typeof prevDayData.h === 'number') ? `${prevDayData.l.toFixed(2)} - ${prevDayData.h.toFixed(2)}` : "N/A", // Kept for internal use
      });

    } catch (error: any) {
      console.error("[Polygon API Ticker Lookup] Error in handleTickerLookup:", error);
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

  const chartTimeRanges = ['1D', '1W', '1M', '3M', 'YTD', '1Y'];


  return (
    <main className="min-h-screen flex-1 p-6 space-y-8 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
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
        <PlaceholderCard title="Why the Market Moved" icon={Cpu} className="lg:col-span-1 h-full">
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
            <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-visual-scrollbar">
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
           <div className="w-full space-y-6">
            {/* Minimal Header Section */}
            <div className="w-full text-left mb-4"> {/* Reduced bottom margin */}
              <h3 className="text-2xl font-bold text-foreground mb-1">{tickerData.companyName}</h3>
              <div className="flex items-end gap-2 mb-1"> {/* Reduced bottom margin */}
                <span className="text-4xl font-bold text-foreground">${tickerData.currentPrice}</span>
                {(tickerData.priceChangeAmount && tickerData.priceChangeAmount !== "N/A" && tickerData.priceChangePercent && tickerData.priceChangePercent !== "N/A") && (
                  <span className={cn(
                    "text-xl font-semibold", // Reduced font size for change
                    parseFloat(tickerData.priceChangeAmount) >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {parseFloat(tickerData.priceChangeAmount) >= 0 ? <ArrowUpRight className="inline h-5 w-5 mb-0.5" /> : <ArrowDownRight className="inline h-5 w-5 mb-0.5" />}
                    {tickerData.priceChangeAmount} ({tickerData.priceChangePercent}%)
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Today</p> {/* Placeholder, to be dynamic later */}
            </div>

            {/* Price History Chart */}
            <div className="w-full"> {/* Removed pt-4 for tighter spacing */}
              {chartData && chartData.length > 0 ? (
                <div className="h-[400px] w-full bg-muted/10 rounded-md p-2" data-ai-hint="stock line chart">
                   <TickerPriceChart data={chartData} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Price history not available.</p>
              )}
               <div className="flex justify-center space-x-1 mt-2">
                {chartTimeRanges.map(range => (
                  <Button
                    key={range}
                    variant={selectedRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRange(range)}
                    className={cn(
                        "text-xs h-7 px-2 py-1", // Adjusted padding for slightly smaller buttons
                        selectedRange === range 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "text-muted-foreground border-border/50 hover:bg-muted/30 hover:border-border/70"
                    )}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </PlaceholderCard>
    </main>
  );
}

