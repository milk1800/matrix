
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
  ArrowDownRight,
  CalendarDays,
  Briefcase, // For IPOs
  DollarSign as DividendIcon, // For Dividends
  CalendarOff, // For Market Holidays
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subYears, formatDistanceToNowStrict, parseISO, startOfYear, isWithinInterval, subDays, subMonths, endOfDay, startOfDay, isSameDay, getMonth, getYear } from 'date-fns';
import { TickerPriceChart, type PriceHistoryPoint } from '@/components/charts/TickerPriceChart';
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar
import type { DayContentProps } from "react-day-picker";

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
  c?: number; 
  o?: number; 
  error?: string;
  loading?: boolean;
}

interface TickerCompanyDetails {
  name?: string;
  ticker?: string;
  primary_exchange?: string;
  sic_description?: string; 
  branding?: { logo_url?: string };
  market_cap?: number;
}

interface TickerPrevDayData {
  c?: number; // Close
  o?: number; // Open
  h?: number; // High
  l?: number; // Low
  v?: number; // Volume
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
  fullPriceHistory: PriceHistoryPoint[]; 
}

interface MarketStatusInfo {
  statusText: string;
  tooltipText: string;
  shadowClass: string;
}

// Interfaces for Polygon API Event Data
interface PolygonIPO {
  name?: string;
  filing_date?: string; // YYYY-MM-DD
  expected_pricing_date?: string; // YYYY-MM-DD
  // other fields as needed
}

interface PolygonDividend {
  ticker?: string;
  declaration_date?: string;
  ex_dividend_date?: string; // YYYY-MM-DD
  pay_date?: string; // YYYY-MM-DD
  cash_amount?: number;
  frequency?: number; // 1 for one-time, 2 for bi-annually, 4 for quarterly, 12 for monthly etc.
  // other fields as needed
}

interface PolygonMarketHoliday {
  exchange?: string;
  name?: string;
  date?: string; // YYYY-MM-DD
  status?: string; // "closed", "early-close", etc.
  // other fields as needed
}

interface CombinedEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'IPO' | 'Dividend' | 'Holiday';
  title: string;
  details?: string;
  icon: React.ElementType;
  color: string; // Tailwind color class for the dot
}


const chartTimeRanges = ['1D', '1W', '1M', '3M', 'YTD', '1Y'];

const timeRangeLabels: { [key: string]: string } = {
  '1D': 'Today',
  '1W': 'Past week',
  '1M': 'Past month',
  '3M': 'Past 3 months',
  'YTD': 'Year-to-date',
  '1Y': 'Past year'
};

const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  console.log(`[Polygon API] Attempting to use API key ending with: ...${apiKey ? apiKey.slice(-4) : 'UNDEFINED'} for symbol: ${symbol}`);

  if (!apiKey) {
    console.error("Polygon API key (NEXT_PUBLIC_POLYGON_API_KEY) is not set in .env.local. Ensure it's there and the dev server was restarted.");
    return { error: 'API Key Missing. Configure in .env.local & restart server.' };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    let errorMessage = `API Error: ${response.status}`;

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log(`[Polygon API Debug] Raw error response for ${symbol}:`, errorData); // More verbose logging

        if (Object.keys(errorData).length === 0 && errorData.constructor === Object) {
          errorMessage = `API Error: ${response.status} - Polygon returned an empty error response. Check API key, permissions, or ticker availability.`;
          console.warn(`[Polygon API Warn] Polygon returned an empty error response for ${symbol}. Status: ${response.status}.`);
        } else if (errorData && errorData.message) {
          errorMessage = `API Error: ${response.status} - ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `API Error: ${response.status} - ${errorData.error}`;
        } else if (errorData && errorData.request_id) {
           errorMessage = `API Error: ${response.status} (Request ID: ${errorData.request_id}) - Often indicates an issue with the key or subscription for this ticker.`;
        } else {
            const responseText = await response.text(); // Try to get text if JSON parsing failed or was empty
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}, but got text. Status: ${response.status}. Response text snippet:`, snippet);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Raw: ${snippet.substring(0,50)}...`;
        }
      } catch (e: any) { 
          // This catch is if response.json() itself fails or response.text() fails
          try {
            const responseText = await response.text(); // Attempt to read as text
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            console.warn(`[Polygon API Warn] Could not parse JSON error response for ${symbol}. Status: ${response.status}. Response text snippet:`, snippet);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Failed to parse error response.'} Snippet: ${snippet.substring(0,50)}...`;
          } catch (textErr: any) {
            console.warn(`[Polygon API Warn] Could not parse JSON or text error response for ${symbol}. Status: ${response.status}. Also failed to read response as text: ${textErr.message}`);
            errorMessage = `API Error: ${response.status} - ${response.statusText || 'Unknown error structure and failed to read response text.'}`;
          }
      }

      if (response.status === 401) { // Specifically for 401 errors
        errorMessage = `API Error: 401 - Unknown API Key or insufficient permissions for ${symbol}. Please verify your Polygon.io API key and plan.`;
      } else if (response.status === 429) {
        errorMessage = `API Error: 429 - You've exceeded the maximum requests per minute for ${symbol}, please wait or upgrade your subscription to continue. https://polygon.io/pricing`;
      }

      console.error(`Error fetching ${symbol}: ${errorMessage}`);
      return { error: errorMessage, loading: false };
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { c, o } = data.results[0];
      return { c, o, loading: false };
    }
    console.warn(`[Polygon API Warn] No data results found for ${symbol} in Polygon response.`);
    return { error: `No data results from Polygon for ${symbol}`, loading: false };
  } catch (error: any) {
    const networkErrorMsg = `Network/Fetch error for ${symbol}: ${error.message || 'Unknown network error'}`;
    console.error(`[Polygon API Error] ${networkErrorMsg}`);
    return { error: networkErrorMsg, loading: false };
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

  // State for Events Calendar
  const [ipoEvents, setIpoEvents] = React.useState<PolygonIPO[]>([]);
  const [dividendEvents, setDividendEvents] = React.useState<PolygonDividend[]>([]);
  const [marketHolidays, setMarketHolidays] = React.useState<PolygonMarketHoliday[]>([]);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
  const [selectedEventDate, setSelectedEventDate] = React.useState<Date | undefined>();
  const [eventsForSelectedDay, setEventsForSelectedDay] = React.useState<CombinedEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = React.useState({ ipos: false, holidays: false, dividends: false });


  const fetchPolygonData = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) {
      console.error("Polygon API key is not set for fetching events.");
      throw new Error('API Key Missing');
    }
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.polygon.io${endpoint}?apiKey=${apiKey}${queryString ? `&${queryString}` : ''}`;
    
    console.log(`[Polygon Events API] Fetching: ${url.replace(apiKey, '******' + apiKey.slice(-4))}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      console.error(`Error fetching ${endpoint}:`, errorData);
      throw new Error(errorData.message || `Failed to fetch ${endpoint}`);
    }
    return response.json();
  };

  const fetchIPOs = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, ipos: true }));
    try {
      const toDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd'); // Next 3 months
      const fromDate = format(new Date(), 'yyyy-MM-dd');
      const data = await fetchPolygonData('/v3/reference/ipos', { from: fromDate, to: toDate, limit: '50' });
      setIpoEvents(data.results || []);
    } catch (error) {
      console.error("Failed to fetch IPOs:", error);
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, ipos: false }));
    }
  }, []);

  const fetchMarketHolidays = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, holidays: true }));
    try {
      const data = await fetchPolygonData('/v1/marketstatus/upcoming'); // This endpoint returns an array directly
      setMarketHolidays(data || []);
    } catch (error) {
      console.error("Failed to fetch market holidays:", error);
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, holidays: false }));
    }
  }, []);

  const fetchDividends = React.useCallback(async (ticker: string) => {
    if (!ticker) {
      setDividendEvents([]);
      return;
    }
    setIsLoadingEvents(prev => ({ ...prev, dividends: true }));
    try {
      // Fetch dividends for a wide range to cover potential past and future
      const data = await fetchPolygonData(`/v3/reference/dividends`, { ticker: ticker, limit: '50', order: 'desc' });
      setDividendEvents(data.results || []);
    } catch (error) {
      console.error(`Failed to fetch dividends for ${ticker}:`, error);
      setDividendEvents([]); // Clear on error for specific ticker
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, dividends: false }));
    }
  }, []);

  React.useEffect(() => {
    fetchIPOs();
    fetchMarketHolidays();
  }, [fetchIPOs, fetchMarketHolidays]);

  React.useEffect(() => {
    if (tickerData?.symbol) {
      fetchDividends(tickerData.symbol);
    } else {
      setDividendEvents([]); // Clear dividends if no ticker is selected
    }
  }, [tickerData?.symbol, fetchDividends]);


  const allEventsForCalendar = React.useMemo((): CombinedEvent[] => {
    const combined: CombinedEvent[] = [];
    ipoEvents.forEach(ipo => {
      if (ipo.expected_pricing_date) {
        combined.push({
          id: `ipo-${ipo.name}-${ipo.expected_pricing_date}`,
          date: ipo.expected_pricing_date,
          type: 'IPO',
          title: ipo.name || 'Unnamed IPO',
          icon: Briefcase,
          color: 'bg-blue-500',
        });
      }
    });
    dividendEvents.forEach(div => {
      if (div.ex_dividend_date) {
        combined.push({
          id: `div-${div.ticker}-${div.ex_dividend_date}`,
          date: div.ex_dividend_date,
          type: 'Dividend',
          title: `${div.ticker} Ex-Div: $${div.cash_amount?.toFixed(2) || 'N/A'}`,
          icon: DividendIcon,
          color: 'bg-green-500',
        });
      }
      if (div.pay_date && div.pay_date !== div.ex_dividend_date) {
         combined.push({
          id: `pay-${div.ticker}-${div.pay_date}`,
          date: div.pay_date,
          type: 'Dividend',
          title: `${div.ticker} Pay Date: $${div.cash_amount?.toFixed(2) || 'N/A'}`,
          icon: DividendIcon,
          color: 'bg-emerald-500', // Different shade for pay date
        });
      }
    });
    marketHolidays.forEach(hol => {
      if (hol.date && hol.status === 'closed') {
        combined.push({
          id: `hol-${hol.name}-${hol.date}`,
          date: hol.date,
          type: 'Holiday',
          title: hol.name || 'Market Holiday',
          icon: CalendarOff,
          color: 'bg-red-500',
        });
      }
    });
    return combined;
  }, [ipoEvents, dividendEvents, marketHolidays]);

  const handleEventDayClick = (day: Date) => {
    setSelectedEventDate(day);
    const dayEvents = allEventsForCalendar.filter(event => 
      isSameDay(parseISO(event.date), day)
    );
    setEventsForSelectedDay(dayEvents);
  };

  const CustomDayContent = (props: DayContentProps) => {
    const dayEvents = allEventsForCalendar.filter(event =>
      isSameDay(parseISO(event.date), props.date) && 
      props.displayMonth && isSameDay(startOfMonth(props.date), startOfMonth(props.displayMonth))
    );
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-start">
        <span className={cn(isToday(props.date) && "font-bold text-primary")}>{format(props.date, "d")}</span>
        {dayEvents.length > 0 && (
          <div className="flex space-x-0.5 mt-0.5 justify-center absolute bottom-1">
            {dayEvents.slice(0, 3).map(event => ( // Show max 3 dots
              <span key={event.id} className={cn("h-1.5 w-1.5 rounded-full", event.color)}></span>
            ))}
          </div>
        )}
      </div>
    );
  };


  const fetchNewsData = async (): Promise<any[]> => {
    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) {
      console.error("[Polygon API] News: API key is not set.");
      throw new Error("API Key for news missing.");
    }
    const url = `https://api.polygon.io/v2/reference/news?order=desc&limit=5&sort=published_utc&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errorMessage = `News API Error: ${response.status}`;
         if (response.status === 429) {
          errorMessage = `News API Error: 429 - Rate limit.`;
        } else {
          try {
            const errorData = await response.json();
             if (Object.keys(errorData).length === 0 && errorData.constructor === Object) {
              errorMessage = `News API Error: ${response.status} - Empty error response.`;
            } else if (errorData.message) errorMessage += ` - ${errorData.message}`;
            else if (errorData.error) errorMessage += ` - ${errorData.error}`;
            else if (errorData.request_id) errorMessage += ` (Req ID: ${errorData.request_id})`;
            else errorMessage += ` - ${response.statusText || 'Unknown error.'}`;
          } catch (e) {
             errorMessage += ` - ${response.statusText || 'Failed to parse error JSON.'}`;
          }
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

  React.useEffect(() => {
    const loadMarketData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
      if (!apiKey) {
        console.warn("[Polygon API] CRITICAL: NEXT_PUBLIC_POLYGON_API_KEY is not defined.");
        const errorState: Record<string, FetchedIndexData> = {};
        initialMarketOverviewData.forEach(market => {
          errorState[market.polygonTicker] = { error: 'API Key Missing.' };
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
          console.error(`[Polygon API] Promise rejected for ${result.reason?.symbol || 'unknown symbol'} in Market Overview:`, result.reason);
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
    const today = endOfDay(new Date()); 
    let startDate: Date;

    switch (range) {
      case '1D':
        return fullHistory.slice(-2); // Show last 2 points for a line
      case '1W':
        startDate = startOfDay(subDays(today, 6)); // approx 7 days of data
        break;
      case '1M':
        startDate = startOfDay(subMonths(today, 1));
        break;
      case '3M':
        startDate = startOfDay(subMonths(today, 3));
        break;
      case 'YTD':
        startDate = startOfYear(today);
        break;
      case '1Y':
      default:
        return fullHistory; // Already 1 year
    }
    return fullHistory.filter(point => parseISO(point.date) >= startDate);
  };


  React.useEffect(() => {
    if (tickerData?.fullPriceHistory) {
      setChartData(getChartDataForRange(tickerData.fullPriceHistory, selectedRange));
    } else {
      setChartData([]); // Clear chart if no history
    }
  }, [tickerData?.fullPriceHistory, selectedRange]);


  const handleTickerLookup = async () => {
    if (!tickerQuery.trim()) return;
    setIsLoadingTicker(true);
    setTickerData(null);
    setTickerError(null);
    setChartData([]);
    setSelectedRange('1Y'); 

    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) {
      setTickerError("API Key Missing. Configure in .env.local & restart server.");
      setIsLoadingTicker(false);
      return;
    }

    const symbol = tickerQuery.toUpperCase();
    const toDate = format(new Date(), 'yyyy-MM-dd');
    const fromDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

    try {
      console.log(`[Polygon API Ticker Lookup] Fetching data for ${symbol} using API key ending with: ...${apiKey.slice(-4)}`);
      
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
        const errorText = await detailsRes.text().catch(() => "Failed to read error text");
        fetchErrors.push(`Details: ${detailsRes.status} - ${errorText.substring(0,100)}...`);
      }

      if (prevDayRes.ok) {
        const prevDayJson = await prevDayRes.json();
        prevDayData = (prevDayJson.results && prevDayJson.results.length > 0) ? prevDayJson.results[0] : {};
      } else {
        const errorText = await prevDayRes.text().catch(() => "Failed to read error text");
        fetchErrors.push(`Prev. Day: ${prevDayRes.status} - ${errorText.substring(0,100)}...`);
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
        const errorText = await historyRes.text().catch(() => "Failed to read error text");
        fetchErrors.push(`History: ${historyRes.status} - ${errorText.substring(0,100)}...`);
      }

      if (fetchErrors.length > 0) {
        console.error(`[Polygon API Ticker Lookup] Errors for ${symbol}:`, fetchErrors.join('; '));
      }

      if (Object.keys(companyDetails).length === 0 && Object.keys(prevDayData).length === 0 && priceHistoryPoints.length === 0) {
        setTickerError(`No data found for ticker "${symbol}". It might be invalid, not supported by your API plan, or API calls failed.`);
        setIsLoadingTicker(false);
        return;
      }
      
      const currentPrice = prevDayData.c;
      const openPriceForDailyChange = prevDayData.o; 
      const priceChangeNum = typeof currentPrice === 'number' && typeof openPriceForDailyChange === 'number' ? (currentPrice - openPriceForDailyChange) : null;
      const priceChangePercentNum = calculateChangePercent(currentPrice, openPriceForDailyChange);

      setTickerData({
        companyName: companyDetails.name || `${symbol} (Name N/A)`,
        symbol: companyDetails.ticker || symbol,
        exchange: companyDetails.primary_exchange || "N/A",
        sector: companyDetails.sic_description || "N/A", // Often sector/industry combined
        industry: companyDetails.sic_description || "N/A",
        logo: companyDetails.branding?.logo_url ? `${companyDetails.branding.logo_url}?apiKey=${apiKey}` : `https://placehold.co/48x48.png?text=${symbol.substring(0,3)}`,
        marketCap: companyDetails.market_cap ? (companyDetails.market_cap / 1_000_000_000).toFixed(2) + "B" : "N/A",
        currentPrice: typeof currentPrice === 'number' ? currentPrice.toFixed(2) : "N/A",
        priceChangeAmount: typeof priceChangeNum === 'number' ? priceChangeNum.toFixed(2) : null,
        priceChangePercent: typeof priceChangePercentNum === 'number' ? priceChangePercentNum.toFixed(2) : null,
        previousClose: typeof prevDayData.c === 'number' ? prevDayData.c.toFixed(2) : "N/A",
        openPrice: typeof prevDayData.o === 'number' ? prevDayData.o.toFixed(2) : "N/A",
        daysRange: (typeof prevDayData.l === 'number' && typeof prevDayData.h === 'number') ? `${prevDayData.l.toFixed(2)} - ${prevDayData.h.toFixed(2)}` : "N/A",
        fullPriceHistory: priceHistoryPoints,
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
          hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'America/New_York',
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

            const marketOpenTimeToday = new Date(todayForLogic); marketOpenTimeToday.setHours(openHour, openMinute, 0, 0);
            const marketCloseTimeToday = new Date(todayForLogic); marketCloseTimeToday.setHours(closeHour, closeMinute, 0, 0);
            const currentTimeWithEstHours = new Date(todayForLogic); currentTimeWithEstHours.setHours(currentHourEST, currentMinuteEST, 0, 0);

            const isCurrentlyOpen = currentTimeWithEstHours >= marketOpenTimeToday && currentTimeWithEstHours < marketCloseTimeToday;
            const timeToCloseMs = marketCloseTimeToday.getTime() - currentTimeWithEstHours.getTime();
            const isClosingSoon = isCurrentlyOpen && timeToCloseMs > 0 && timeToCloseMs <= 60 * 60 * 1000;

            let statusText = "🔴 Market Closed";
            let shadowClass = "shadow-market-closed";
            let tooltipText = `Market Hours: ${market.openTime} - ${market.closeTime} ET`;

            if (isClosingSoon) {
                statusText = "🟡 Closing Soon"; shadowClass = "shadow-market-closing"; tooltipText = `Market closes at ${market.closeTime} ET`;
            } else if (isCurrentlyOpen) {
                statusText = "🟢 Market Open"; shadowClass = "shadow-market-open"; tooltipText = `Market closes at ${market.closeTime} ET`;
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
        } catch (e) { setCurrentTimeEST(new Date().toLocaleTimeString()); }
    }, 1000);

    return () => { clearInterval(intervalId); clearInterval(clockIntervalId); };
  }, []);


  const getNewsSentimentBadgeClass = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "negative": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <main className="min-h-screen flex-1 p-6 space-y-8 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104]">
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
                 if (apiResult.error.includes("429")) displayError = "Rate Limit";
                 else if (apiResult.error.toLowerCase().includes("unknown api key") || apiResult.error.includes("401")) displayError = "Auth Error";
                 else if (apiResult.error.includes("API Key Missing")) displayError = "Key Missing";
                 else if (apiResult.error.includes("No data")) displayError = "No Data";
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
              } else { changeDisplay = <span className="text-xs text-muted-foreground">N/A</span>; }
            }

            return (
              <PlaceholderCard key={market.polygonTicker} title={market.label} icon={market.icon || Landmark} className={cn("transition-all duration-300 ease-in-out", statusInfo.shadowClass)}>
                <div className="text-2xl font-bold text-foreground mb-1 truncate" title={typeof valueDisplay === 'string' ? valueDisplay : undefined}>{valueDisplay}</div>
                <div className="text-sm mb-3">{changeDisplay}</div>
                <div className="h-10 w-full my-2 bg-black/30 rounded-md flex items-center justify-center backdrop-blur-sm" data-ai-hint="mini trendline chart"><span className="text-xs text-muted-foreground/50">Mini Trend</span></div>
                <TooltipProvider><Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/20 flex justify-between items-center">
                      <span>{statusInfo.statusText}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{currentTimeEST.replace(/\s(AM|PM)/, '')}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground"><p>{statusInfo.tooltipText}</p>
                     {apiResult?.c !== undefined && <p>Prev. Close: ${apiResult.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                     {apiResult?.o !== undefined && <p>Prev. Open: ${apiResult.o.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                  </TooltipContent>
                </Tooltip></TooltipProvider>
              </PlaceholderCard>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlaceholderCard title="Why the Market Moved" icon={Cpu} className="lg:col-span-1 h-full">
          <p className="text-sm text-muted-foreground leading-relaxed font-serif mt-2"> Market sentiment turned positive following the release of favorable inflation data, suggesting that price pressures may be easing. This led to a broad rally across major indices, particularly in growth-oriented sectors like technology and consumer discretionary. </p>
        </PlaceholderCard>
        <PlaceholderCard title="Top News Stories" icon={Newspaper} className="lg:col-span-2 h-full">
          {isLoadingNews && (<div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>)}
          {newsError && (<div className="flex flex-col items-center justify-center h-32 text-red-400"><AlertCircle className="w-8 h-8 mb-2" /><p className="text-sm">{newsError}</p></div>)}
          {!isLoadingNews && !newsError && newsData.length === 0 && (<p className="text-muted-foreground text-center py-4">No news available.</p>)}
          {!isLoadingNews && !newsError && newsData.length > 0 && (
            <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-visual-scrollbar">
              {newsData.map((item) => (
                <li key={item.id || item.article_url} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <a href={item.article_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate" title={item.title}> {item.title} </a>
                    {item.sentiment && ( <Badge variant="outline" className={cn("text-xs whitespace-nowrap ml-2", getNewsSentimentBadgeClass(item.sentiment))}> {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} </Badge> )}
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
          <Input type="text" placeholder="Enter stock ticker (e.g., AAPL)" className="flex-1 bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" value={tickerQuery} onChange={(e) => setTickerQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleTickerLookup()} />
          <Button onClick={handleTickerLookup} disabled={isLoadingTicker}> {isLoadingTicker ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />} </Button>
        </div>

        {isLoadingTicker && <div className="text-center py-4"><Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" /></div>}
        {tickerError && <p className="text-sm text-red-400 text-center p-2 bg-red-500/10 rounded-md">{tickerError}</p>}
        
        {tickerData && !isLoadingTicker && (
          <div className="w-full space-y-6 p-4 md:p-6">
            <div className="w-full text-left mb-4">
              <h3 className="text-2xl font-bold text-foreground mb-1">{tickerData.companyName}</h3>
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-bold text-foreground">${tickerData.currentPrice}</span>
                {(tickerData.priceChangeAmount && tickerData.priceChangePercent) && (
                  <span className={cn("text-xl font-semibold", parseFloat(tickerData.priceChangeAmount) >= 0 ? "text-green-400" : "text-red-400")}>
                    {parseFloat(tickerData.priceChangeAmount) >= 0 ? <ArrowUpRight className="inline h-5 w-5 mb-0.5" /> : <ArrowDownRight className="inline h-5 w-5 mb-0.5" />}
                    {tickerData.priceChangeAmount} ({tickerData.priceChangePercent}%)
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{timeRangeLabels[selectedRange]}</p>
            </div>

            <div className="w-full">
              {chartData && chartData.length > 1 ? ( // Ensure there are at least 2 points to draw a line
                <div className="h-[400px] w-full bg-muted/10 rounded-md p-2" data-ai-hint="stock line chart">
                   <TickerPriceChart data={chartData} />
                </div>
              ) : tickerData.fullPriceHistory && tickerData.fullPriceHistory.length <=1 && !isLoadingTicker ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Not enough data points for a chart for the selected range.</p>
              ): (
                <p className="text-sm text-muted-foreground text-center py-4">Price history not available or insufficient data for chart.</p>
              )}
               <div className="flex justify-center space-x-1 mt-2">
                {chartTimeRanges.map(range => (
                  <Button key={range} variant={selectedRange === range ? "default" : "outline"} size="sm" onClick={() => setSelectedRange(range)}
                    className={cn("text-xs h-7 px-2 py-1", selectedRange === range  ? "bg-primary text-primary-foreground hover:bg-primary/90"  : "text-muted-foreground border-border/50 hover:bg-muted/30 hover:border-border/70" )}>
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </PlaceholderCard>

      <PlaceholderCard title="Upcoming Market & Company Events" icon={CalendarDays} className="lg:col-span-3 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 items-start">
          <div>
            <Calendar
              mode="single"
              selected={selectedEventDate}
              onSelect={setSelectedEventDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              onDayClick={handleEventDayClick}
              className="rounded-md border border-border/30 bg-card/50 p-0"
              classNames={{
                caption_label: "text-lg",
                head_cell: "text-muted-foreground w-10",
                cell: "h-10 w-10 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                day_today: "bg-accent text-accent-foreground rounded-md",
                day_disabled: "text-muted-foreground opacity-50",
                day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              }}
              components={{ DayContent: CustomDayContent }}
            />
          </div>
          <div className="mt-4 md:mt-0">
            <h4 className="font-semibold text-foreground mb-3">
              Events for {selectedEventDate ? format(selectedEventDate, "MMMM d, yyyy") : "selected date"}:
            </h4>
            {isLoadingEvents.ipos || isLoadingEvents.holidays || isLoadingEvents.dividends && !tickerData?.symbol ? (
              <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading events...</div>
            ) : eventsForSelectedDay.length > 0 ? (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-visual-scrollbar">
                {eventsForSelectedDay.map(event => {
                  const Icon = event.icon;
                  return (
                    <li key={event.id} className="flex items-start gap-2 text-sm p-2 rounded-md bg-black/30 hover:bg-muted/20">
                      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", event.color.replace('bg-', 'text-'))} />
                      <div>
                        <span className="font-medium text-foreground">{event.title}</span>
                        {event.details && <p className="text-xs text-muted-foreground">{event.details}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No events for this date.</p>
            )}
             {!tickerData?.symbol && <p className="text-xs text-yellow-400 mt-2">Search for a ticker to see its dividend events.</p>}
          </div>
        </div>
      </PlaceholderCard>

    </main>
  );
}

    