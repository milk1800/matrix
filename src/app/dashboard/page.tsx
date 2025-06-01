
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
  Briefcase,
  DollarSign as DividendIcon,
  CalendarOff,
  PieChart,
  FileText as FileTextIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subYears, formatDistanceToNowStrict, parseISO, startOfYear, isSameDay, isValid, addMonths, startOfMonth, isToday } from 'date-fns';
import { TickerPriceChart, type PriceHistoryPoint } from '@/components/charts/TickerPriceChart';
import { Calendar } from "@/components/ui/calendar";
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
    label: 'Apple (AAPL)',
    polygonTicker: 'AAPL',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Microsoft (MSFT)',
    polygonTicker: 'MSFT',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Google (GOOGL)',
    polygonTicker: 'GOOGL',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Tesla (TSLA)',
    polygonTicker: 'TSLA',
    icon: PieChart,
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
  c?: number; // close
  o?: number; // open
  l?: number; // low
  h?: number; // high
  v?: number; // volume
}

export interface TickerFullData {
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
  volume: string;
  avgVolume: string; 
  peRatio: string;   
  eps: string;       
  dividendYield: string; 
  beta: string;          
  nextEarningsDate: string; 
  dividendDate: string;   
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
  filing_date?: string; 
  expected_pricing_date?: string; 
}

interface PolygonDividend {
  ticker?: string;
  declaration_date?: string;
  ex_dividend_date?: string; 
  pay_date?: string; 
  cash_amount?: number;
  frequency?: number; 
}

interface PolygonMarketHoliday {
  exchange?: string;
  name?: string;
  date?: string; 
  status?: string; 
}

interface CombinedEvent {
  id: string;
  date: string; 
  type: 'IPO' | 'Dividend' | 'Holiday';
  title: string;
  details?: string;
  icon: React.ElementType;
  color: string; 
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

// Function to fetch index data for Market Overview
const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  // console.log(`[Polygon API] Attempting to use API key for Market Overview ${symbol}: ${apiKey ? '******' + apiKey.slice(-4) : 'UNDEFINED'}`);

  if (!apiKey || apiKey.startsWith("YOUR_") || apiKey.includes("PLACEHOLDER") || apiKey.length < 20) {
    const errorMsg = `[Polygon API Error] Invalid or placeholder API Key for ${symbol}. Configure NEXT_PUBLIC_POLYGON_API_KEY in .env.local & restart server.`;
    console.error(errorMsg);
    return { error: errorMsg };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    let errorMessage = `API Error: ${response.status}`;

    if (!response.ok) {
      try {
        const errorData = await response.json();
        // console.log(`[Polygon API Error] Full error response for ${symbol}:`, errorData); 
        if (errorData && Object.keys(errorData).length === 0 && errorData.constructor === Object) {
          //  console.warn(`[Polygon API Warn] Polygon returned an empty error object for ${symbol} with status ${response.status}.`);
           errorMessage += ` - Polygon returned an empty error response. Check API key, permissions, or endpoint validity.`;
        } else if (errorData && errorData.message) {
          errorMessage = `API Error: ${response.status} - ${errorData.message}`;
        } else if (errorData && errorData.error) {
          errorMessage = `API Error: ${response.status} - ${errorData.error}`;
        } else if (errorData && errorData.request_id) {
           errorMessage = `API Error: ${response.status} (Request ID: ${errorData.request_id}) - Often indicates an issue with the key or subscription.`;
        } else if (response.status === 429) {
          errorMessage = `API Error: 429 - You've exceeded the maximum requests per minute for ${symbol}, please wait or upgrade your subscription. https://polygon.io/pricing`;
        } else {
            const responseText = await response.text().catch(() => "Failed to read error response text.");
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            // console.warn(`[Polygon API Warn] Could not parse JSON error for ${symbol}, but got text. Status: ${response.status}. Snippet:`, snippet);
            errorMessage += ` - ${response.statusText || 'Failed to parse error response.'} Raw text snippet: ${snippet.substring(0,50)}...`;
        }
        
        if (response.status === 401) { 
            errorMessage = `API Error: 401 - Unknown API Key. Please verify your Polygon.io API key and plan for ${symbol}.`;
        }
      } catch (e) { 
          // console.warn(`[Polygon API Warn] Failed to parse JSON error response for ${symbol}. Status: ${response.status}. Error:`, e);
          errorMessage += ` - ${response.statusText || 'Failed to parse error JSON body.'}`;
      }
      console.error(`Error fetching ${symbol}: ${errorMessage}`);
      return { error: errorMessage };
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { c, o } = data.results[0];
      return { c, o, loading: false };
    }
    // console.warn(`[Polygon API Warn] No data results found for ${symbol} in Polygon response.`);
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
  const [ipoError, setIpoError] = React.useState<string | null>(null);
  const [dividendEvents, setDividendEvents] = React.useState<PolygonDividend[]>([]);
  const [dividendError, setDividendError] = React.useState<string | null>(null);
  const [marketHolidays, setMarketHolidays] = React.useState<PolygonMarketHoliday[]>([]);
  const [holidayError, setHolidayError] = React.useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
  const [selectedEventDate, setSelectedEventDate] = React.useState<Date | undefined>();
  const [eventsForSelectedDay, setEventsForSelectedDay] = React.useState<CombinedEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = React.useState({ ipos: false, holidays: false, dividends: false });

  const fetchPolygonData = React.useCallback(async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    // console.log(`[Polygon Events API] Attempting to use API key for ${endpoint}: ${apiKey ? '******' + apiKey.slice(-4) : 'UNDEFINED'}`);

    if (!apiKey || apiKey.startsWith("YOUR_") || apiKey.includes("PLACEHOLDER") || apiKey.length < 20) {
      const errorMsg = `[Polygon Events API] Invalid or placeholder API Key (NEXT_PUBLIC_POLYGON_API_KEY). Please configure it. Endpoint: ${endpoint}.`;
      console.error(errorMsg);
      return { error: errorMsg, results: [] }; 
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.polygon.io${endpoint}?apiKey=${apiKey}${queryString ? `&${queryString}` : ''}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errorMsg = `Failed to fetch ${endpoint}. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          // console.log(`[Polygon API Error - Events] Full error response for ${endpoint}:`, errorData); 
          if (errorData && Object.keys(errorData).length === 0 && errorData.constructor === Object) {
            //  console.warn(`[Polygon API Warn - Events] Polygon returned an empty error object for ${endpoint} with status ${response.status}.`);
             errorMsg += ` - Polygon returned an empty error response.`;
          } else if (errorData && errorData.message) {
            errorMsg += ` - ${errorData.message}`;
          } else if (errorData && errorData.error) {
            errorMsg += ` - ${errorData.error}`;
          } else if (errorData && errorData.request_id) {
             errorMsg += ` (Request ID: ${errorData.request_id})`;
          } else if (response.status === 429) {
            errorMsg = `API Error: 429 - Rate limit exceeded for ${endpoint}. Please wait or upgrade your subscription.`;
          } else {
            const responseText = await response.text().catch(() => "Failed to read error response text.");
            const snippet = responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
            // console.warn(`[Polygon API Warn - Events] Could not parse JSON error for ${endpoint}, but got text. Status: ${response.status}. Snippet:`, snippet);
            errorMsg += ` - ${response.statusText || 'Failed to parse error response.'} Raw text snippet: ${snippet.substring(0,50)}...`;
          }
        } catch (e) { 
            // console.warn(`[Polygon API Warn - Events] Failed to parse JSON error response for ${endpoint}. Status: ${response.status}. Error:`, e);
            errorMsg += ` - ${response.statusText || 'Failed to parse error JSON body.'}`; 
        }
        console.error(errorMsg); 
        return { error: errorMsg, results: [] };
      }
      return response.json();
    } catch (error: any) {
        const networkErrorMsg = `Network/Fetch error for ${endpoint}: ${error.message || 'Unknown network error'}`;
        console.error(`[Polygon Events API Error] ${networkErrorMsg}`);
        return { error: networkErrorMsg, results: [] };
    }
  }, []);


  const fetchIPOs = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, ipos: true }));
    setIpoError(null);
    try {
      const toDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd'); 
      const fromDate = format(new Date(), 'yyyy-MM-dd');
      const data = await fetchPolygonData('/v3/reference/ipos', { 'expected_pricing_date.gte': fromDate, 'expected_pricing_date.lte': toDate, limit: '50' });
      if (data.error) {
        // console.error("Error in fetchIPOs:", data.error); // Already logged by fetchPolygonData
        setIpoEvents([]);
        setIpoError(data.error);
      } else {
        setIpoEvents(data.results || []);
      }
    } catch (error: any) { 
      const msg = error.message || "Unknown error fetching IPOs";
      console.error("Failed to fetch IPOs (catch block):", msg);
      setIpoEvents([]);
      setIpoError(msg);
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, ipos: false }));
    }
  }, [fetchPolygonData]);

  const fetchMarketHolidays = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, holidays: true }));
    setHolidayError(null);
    try {
      const data = await fetchPolygonData('/v1/marketstatus/upcoming');
      if (data.error) {
        // console.error("Error in fetchMarketHolidays:", data.error); // Already logged
        setMarketHolidays([]);
        setHolidayError(data.error);
      } else {
        setMarketHolidays(data || []); 
      }
    } catch (error: any) {
      const msg = error.message || "Unknown error fetching market holidays";
      console.error("Failed to fetch market holidays (catch block):", msg);
      setMarketHolidays([]);
      setHolidayError(msg);
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, holidays: false }));
    }
  }, [fetchPolygonData]);

  const fetchDividends = React.useCallback(async (ticker: string) => {
    if (!ticker) {
      setDividendEvents([]);
      setDividendError(null);
      return;
    }
    setIsLoadingEvents(prev => ({ ...prev, dividends: true }));
    setDividendError(null);
    try {
      const data = await fetchPolygonData(`/v3/reference/dividends`, { ticker: ticker, limit: '50', order: 'desc' });
      if (data.error) {
        // console.error(`Error in fetchDividends for ${ticker}:`, data.error); // Already logged
        setDividendEvents([]);
        setDividendError(data.error);
      } else {
        setDividendEvents(data.results || []);
      }
    } catch (error: any) { 
      const msg = error.message || `Unknown error fetching dividends for ${ticker}`;
      console.error(`Failed to fetch dividends for ${ticker} (catch block):`, msg);
      setDividendEvents([]); 
      setDividendError(msg);
    } finally {
      setIsLoadingEvents(prev => ({ ...prev, dividends: false }));
    }
  }, [fetchPolygonData]);

  React.useEffect(() => {
    fetchIPOs();
    fetchMarketHolidays();
  }, [fetchIPOs, fetchMarketHolidays]);

  React.useEffect(() => {
    if (tickerData?.symbol) {
      fetchDividends(tickerData.symbol);
    } else {
      setDividendEvents([]); 
      setDividendError(null);
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
          color: 'bg-emerald-500', 
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
    const dayEvents = allEventsForCalendar.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && isSameDay(eventDate, day);
      } catch (e) {
        // console.warn("Invalid date encountered in event data:", event.date, e);
        return false;
      }
    });
    setEventsForSelectedDay(dayEvents);
  };

  const CustomDayContent = (props: DayContentProps) => {
    const dayEvents = allEventsForCalendar.filter(event =>{
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) &&
               isSameDay(eventDate, props.date) && 
               props.displayMonth && 
               isSameDay(startOfMonth(props.date), startOfMonth(props.displayMonth));
      } catch (e) {
        return false;
      }
    });

    return (
      <div className="relative h-full w-full flex flex-col items-center justify-start">
        <span className={cn(isToday(props.date) && "font-bold text-primary")}>{format(props.date, "d")}</span>
        {dayEvents.length > 0 && (
          <div className="flex space-x-0.5 mt-0.5 justify-center absolute bottom-1">
            {dayEvents.slice(0, 3).map(event => ( 
              <span key={event.id} className={cn("h-1.5 w-1.5 rounded-full", event.color)}></span>
            ))}
          </div>
        )}
      </div>
    );
  };


 const fetchNewsData = React.useCallback(async () => {
    setIsLoadingNews(true);
    setNewsError(null);
    try {
      const data = await fetchPolygonData('/v2/reference/news', { order: 'desc', limit: '5', sort: 'published_utc' });
      if (data.error) {
        // console.error("Error fetching news data:", data.error); // Already logged
        setNewsData([]);
        setNewsError(data.error);
      } else {
        setNewsData(data.results || []);
      }
    } catch (error: any) {
      const msg = error.message || "Failed to load news.";
      console.error("Failed to fetch news data (catch block):", msg);
      setNewsError(msg);
      setNewsData([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, [fetchPolygonData]);

  React.useEffect(() => {
    const loadMarketData = async () => {
      // ... (API key check already handled by fetchIndexData) ...
      
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
          // console.error(`[Polygon API] Promise rejected for ${result.reason?.symbol || 'unknown symbol'} in Market Overview:`, result.reason);
        }
      });
      setMarketApiData(prevData => ({ ...prevData, ...newApiData }));
    };

    loadMarketData();
    fetchNewsData();
  }, [fetchNewsData]);

  const calculateChangePercent = (currentPrice?: number, openPrice?: number) => {
    if (typeof currentPrice !== 'number' || typeof openPrice !== 'number' || openPrice === 0 || isNaN(currentPrice) || isNaN(openPrice)) {
      return null;
    }
    return ((currentPrice - openPrice) / openPrice) * 100;
  };

  const getChartDataForRange = React.useCallback((fullHistory: PriceHistoryPoint[], range: string): PriceHistoryPoint[] => {
    if (!fullHistory || fullHistory.length === 0) return [];
    const today = new Date();
    let startDate: Date;

    switch (range) {
      case '1D':
         const lastTradingDayPoint = fullHistory[fullHistory.length -1];
         if (!lastTradingDayPoint || !lastTradingDayPoint.date) return [];
         const lastTradingDay = parseISO(lastTradingDayPoint.date);
         if (!isValid(lastTradingDay)) return [];
         return fullHistory.filter(point => {
            if (!point.date) return false;
            const pointDate = parseISO(point.date);
            return isValid(pointDate) && isSameDay(pointDate, lastTradingDay);
         });
      case '1W':
        startDate = subYears(today, 1); 
        const oneWeekAgo = subYears(new Date(),1); oneWeekAgo.setDate(oneWeekAgo.getDate() -7);
        return fullHistory.filter(point => {
            if(!point.date) return false;
            const pointDate = parseISO(point.date);
            return isValid(pointDate) && pointDate >= oneWeekAgo;
        });
      case '1M':
        startDate = subYears(today, 1); 
        const oneMonthAgo = subYears(new Date(),1); oneMonthAgo.setMonth(oneMonthAgo.getMonth() -1);
        return fullHistory.filter(point => {
           if(!point.date) return false;
           const pointDate = parseISO(point.date);
           return isValid(pointDate) && pointDate >= oneMonthAgo;
        });
      case '3M':
        startDate = subYears(today, 1); 
        const threeMonthsAgo = subYears(new Date(),1); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() -3);
        return fullHistory.filter(point => {
            if(!point.date) return false;
            const pointDate = parseISO(point.date);
            return isValid(pointDate) && pointDate >= threeMonthsAgo;
        });
      case 'YTD':
        startDate = startOfYear(today);
        break;
      case '1Y':
      default:
        return fullHistory; 
    }
    return fullHistory.filter(point => {
        if (!point.date) return false;
        const pointDate = parseISO(point.date);
        return isValid(pointDate) && pointDate >= startDate && pointDate <= today;
    });
  }, []);


  React.useEffect(() => {
    if (tickerData?.fullPriceHistory) {
      setChartData(getChartDataForRange(tickerData.fullPriceHistory, selectedRange));
    } else {
      setChartData([]); 
    }
  }, [tickerData?.fullPriceHistory, selectedRange, getChartDataForRange]);


  const handleTickerLookup = async () => {
    if (!tickerQuery.trim()) return;
    setIsLoadingTicker(true);
    setTickerData(null);
    setTickerError(null);
    setChartData([]);
    setDividendEvents([]); 
    setDividendError(null);

    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey || apiKey.startsWith("YOUR_") || apiKey.includes("PLACEHOLDER") || apiKey.length < 20) {
        const errorMsg = "[Polygon Ticker API] Invalid or placeholder API Key. Configure NEXT_PUBLIC_POLYGON_API_KEY in .env.local & restart server.";
        console.error(errorMsg);
        setTickerError(errorMsg);
        setIsLoadingTicker(false);
        return;
    }

    const symbol = tickerQuery.toUpperCase();
    const toDate = format(new Date(), 'yyyy-MM-dd');
    const fromDateOneYear = format(subYears(new Date(), 1), 'yyyy-MM-dd');

    try {
      // console.log(`[Polygon API Ticker Lookup] Fetching data for ${symbol} using API key ending with: ...${apiKey.slice(-4)}`);
      
      const [detailsResponse, prevDayResponse, historyResponse] = await Promise.all([
        fetchPolygonData(`/v3/reference/tickers/${symbol}`),
        fetchPolygonData(`/v2/aggs/ticker/${symbol}/prev`, { adjusted: 'true' }),
        fetchPolygonData(`/v2/aggs/ticker/${symbol}/range/1/day/${fromDateOneYear}/${toDate}`, { adjusted: 'true', sort: 'asc', limit: '5000' })
      ]);

      let companyDetails: TickerCompanyDetails = {};
      let prevDayData: TickerPrevDayData = {};
      let priceHistoryPoints: PriceHistoryPoint[] = [];
      let fetchErrors: string[] = [];

      if (detailsResponse.error) fetchErrors.push(`Details: ${detailsResponse.error}`);
      else companyDetails = detailsResponse.results || {};

      if (prevDayResponse.error) fetchErrors.push(`Prev. Day: ${prevDayResponse.error}`);
      else prevDayData = (prevDayResponse.results && prevDayResponse.results.length > 0) ? prevDayResponse.results[0] : {};
      
      if (historyResponse.error) fetchErrors.push(`History: ${historyResponse.error}`);
      else if (historyResponse.results) {
        priceHistoryPoints = historyResponse.results.map((r: any) => ({
          date: format(new Date(r.t), 'yyyy-MM-dd'), 
          close: r.c,
        }));
      }

      if (fetchErrors.length > 0 && Object.keys(companyDetails).length === 0 && Object.keys(prevDayData).length === 0 && priceHistoryPoints.length === 0){
             const combinedError = fetchErrors.join('; ');
            //  console.error(`[Polygon API Ticker Lookup] Errors for ${symbol}:`, combinedError);
             setTickerError(`No data found for ticker "${symbol}". It might be invalid or API calls failed: ${combinedError.substring(0,100)}...`);
             setIsLoadingTicker(false);
             return;
      }
      if (Object.keys(companyDetails).length === 0 && Object.keys(prevDayData).length === 0) {
        setTickerError(`No primary data found for ticker "${symbol}". It might be invalid or not supported.`);
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
        sector: companyDetails.sic_description || "N/A",
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
        volume: typeof prevDayData.v === 'number' ? prevDayData.v.toLocaleString() : "N/A",
        avgVolume: "N/A", 
        peRatio: "N/A",   
        eps: "N/A",       
        dividendYield: "N/A", 
        beta: "N/A",          
        nextEarningsDate: "N/A", 
        dividendDate: "N/A",   
      });

    } catch (error: any) {
      // console.error("[Polygon API Ticker Lookup] Error in handleTickerLookup:", error);
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
        // console.warn("Error formatting EST time for market status, defaulting to local time for logic:", e);
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


  const getSentimentBadgeClass = (sentiment?: string) => {
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
                let displayError = apiResult.error.substring(0, 50) + (apiResult.error.length > 50 ? '...' : '');
                 if (apiResult.error.includes("429")) displayError = "Rate Limit";
                 else if (apiResult.error.toLowerCase().includes("unknown api key") || apiResult.error.includes("401")) displayError = "Auth Error";
                 else if (apiResult.error.includes("API Key Missing") || apiResult.error.includes("not set") || apiResult.error.includes("placeholder API Key")) displayError = "Key Issue";
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
          {newsError && (<div className="flex flex-col items-center justify-center h-32 text-red-400"><AlertCircle className="w-8 h-8 mb-2" /><p className="text-sm max-w-md truncate" title={newsError}>{newsError}</p></div>)}
          {!isLoadingNews && !newsError && newsData.length === 0 && (<p className="text-muted-foreground text-center py-4">No news available.</p>)}
          {!isLoadingNews && !newsError && newsData.length > 0 && (
            <ul className="space-y-4 max-h-[400px] overflow-y-auto no-visual-scrollbar">
              {newsData.map((item) => (
                <li key={item.id || item.article_url} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <a href={item.article_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate" title={item.title}> {item.title} </a>
                    {item.sentiment && ( <Badge variant="outline" className={cn("text-xs whitespace-nowrap ml-2", getSentimentBadgeClass(item.sentiment))}> {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} </Badge> )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2" title={item.description}>{item.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/70">
                    <span>{item.publisher?.name || 'Unknown Source'}</span>
                    <span>{item.published_utc ? formatDistanceToNowStrict(parseISO(item.published_utc), { addSuffix: true }) : 'N/A'}</span>
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

        {isLoadingTicker && <div className="text-center py-8"><Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" /></div>}
        {tickerError && <p className="text-center text-red-400 p-4 bg-red-500/10 rounded-md">{tickerError}</p>}
        
        {tickerData && !isLoadingTicker && (
           <div className="w-full space-y-6 p-4 md:p-6">
            {/* Minimal Header Section */}
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

            {/* Chart Section */}
            <div className="w-full">
              {chartData && chartData.length > 1 ? (
                <div className="h-[400px] w-full bg-muted/10 rounded-md p-2">
                   <TickerPriceChart data={chartData} />
                </div>
              ) : tickerData.fullPriceHistory && tickerData.fullPriceHistory.length <=1 && !isLoadingTicker ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Not enough data points for a chart for the selected range.</p>
              ): (
                <p className="text-sm text-muted-foreground text-center py-4">Price history not available or insufficient data for chart.</p>
              )}
               <div className="flex justify-center space-x-1 mt-4">
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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start min-h-[400px]"> 
          <div>
            <Calendar
              mode="single"
              selected={selectedEventDate}
              onSelect={setSelectedEventDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              onDayClick={handleEventDayClick}
              className="rounded-md border border-border/30 bg-card/50 p-0 w-full" 
              classNames={{
                caption_label: "text-lg",
                head_cell: "text-muted-foreground w-full sm:w-10", 
                cell: "h-10 w-full sm:w-10 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-10 w-full sm:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                day_today: "bg-accent text-accent-foreground rounded-md",
                day_disabled: "text-muted-foreground opacity-50",
                day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              }}
              components={{ DayContent: CustomDayContent }}
            />
          </div>
          <div className="mt-4 md:mt-0 md:w-80 lg:w-96"> 
            <h4 className="font-semibold text-foreground mb-3">
              Events for {selectedEventDate ? format(selectedEventDate, "MMMM d, yyyy") : "selected date"}:
            </h4>
            {(isLoadingEvents.ipos || isLoadingEvents.holidays || (isLoadingEvents.dividends && !!tickerData?.symbol)) && (
              <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading events...</div>
            )}
            {ipoError && <p className="text-xs text-red-400 max-w-xs truncate" title={ipoError}>IPOs: {ipoError}</p>}
            {holidayError && <p className="text-xs text-red-400 max-w-xs truncate" title={holidayError}>Holidays: {holidayError}</p>}
            {dividendError && !!tickerData?.symbol && <p className="text-xs text-red-400 max-w-xs truncate" title={dividendError}>Dividends for {tickerData.symbol}: {dividendError}</p>}
            
            {!isLoadingEvents.ipos && !isLoadingEvents.holidays && (!isLoadingEvents.dividends || !tickerData?.symbol) && eventsForSelectedDay.length > 0 ? (
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
            ) : !isLoadingEvents.ipos && !isLoadingEvents.holidays && (!isLoadingEvents.dividends || !tickerData?.symbol) && !ipoError && !holidayError && !(dividendError && !!tickerData?.symbol) && (
              <p className="text-sm text-muted-foreground italic">No events for this date.</p>
            )}
             {!tickerData?.symbol && !isLoadingEvents.dividends && !dividendError && <p className="text-xs text-yellow-400/80 mt-2">Search for a ticker to see its dividend events.</p>}
          </div>
        </div>
      </PlaceholderCard>

    </main>
  );
}

    

