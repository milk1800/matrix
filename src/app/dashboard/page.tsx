
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
import { format, subYears, formatDistanceToNowStrict, parseISO, startOfYear, isSameDay, isValid, addMonths, startOfMonth, isToday as dateFnsIsToday } from 'date-fns';
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
    label: 'Apple Inc. (AAPL)',
    polygonTicker: 'AAPL',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Microsoft Corporation (MSFT)',
    polygonTicker: 'MSFT',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Alphabet Inc. (GOOGL)',
    polygonTicker: 'GOOGL',
    icon: PieChart,
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'America/New_York',
  },
  {
    label: 'Tesla, Inc. (TSLA)',
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

const mockStaticNewsData = [
  {
    id: 'news1',
    title: "Tech Stocks Continue Upward Trend",
    description: "Major technology companies reported strong earnings, leading to a sector-wide rally.",
    publisher: { name: "Market Watchers Daily" },
    article_url: "#",
    published_utc: subYears(new Date(), 0).toISOString(), // Example: Today
    sentiment: "positive",
  },
  {
    id: 'news2',
    title: "Federal Reserve Signals Steady Interest Rates",
    description: "The central bank indicated no immediate changes to interest rates, citing stable economic indicators.",
    publisher: { name: "Economic Times" },
    article_url: "#",
    published_utc: subYears(new Date(), 0).toISOString(),
    sentiment: "neutral",
  },
  {
    id: 'news3',
    title: "Oil Prices Dip on Increased Supply News",
    description: "Unexpected announcements of increased global oil production led to a slight decrease in crude oil prices.",
    publisher: { name: "Global Energy Report" },
    article_url: "#",
    published_utc: subYears(new Date(), 0).toISOString(),
    sentiment: "negative",
  },
  {
    id: 'news4',
    title: "Retail Sector Shows Mixed Results",
    description: "Some retailers exceed expectations while others struggle, painting a complex picture of consumer spending.",
    publisher: { name: "Commerce Today" },
    article_url: "#",
    published_utc: subYears(new Date(), 0).toISOString(),
    sentiment: "neutral",
  },
  {
    id: 'news5',
    title: "Green Energy Investments Surge",
    description: "Significant capital flows into renewable energy projects highlight growing investor interest in sustainability.",
    publisher: { name: "Future Finance News" },
    article_url: "#",
    published_utc: subYears(new Date(), 0).toISOString(),
    sentiment: "positive",
  },
];

const mockStaticEvents: CombinedEvent[] = [
    { id: 'ipo-mock1', date: format(addMonths(new Date(), 1), 'yyyy-MM-dd'), type: 'IPO', title: 'FutureTech Inc. IPO', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'div-mock-aapl', date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'), type: 'Dividend', title: 'AAPL Ex-Div: $0.25', icon: DividendIcon, color: 'bg-green-500' },
    { id: 'hol-mock1', date: format(addMonths(new Date(), 2), 'yyyy-MM-dd'), type: 'Holiday', title: 'Market Holiday: Independence Day', icon: CalendarOff, color: 'bg-red-500' },
];


// Function to fetch index data for Market Overview - NOW STATIC
const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  const staticData: Record<string, {c: number, o: number}> = {
    'AAPL': { c: 195.16, o: 194.50 },
    'MSFT': { c: 420.72, o: 418.50 },
    'GOOGL': { c: 175.60, o: 176.00 },
    'TSLA': { c: 180.01, o: 182.50 },
  };

  if (staticData[symbol]) {
    return { ...staticData[symbol], loading: false };
  }
  return { error: `No static data for ${symbol}`, loading: false };
};


export default function DashboardPage() {
  const [marketApiData, setMarketApiData] = React.useState<Record<string, FetchedIndexData>>({});
  const [tickerQuery, setTickerQuery] = React.useState('');
  const [tickerData, setTickerData] = React.useState<TickerFullData | null>(null);
  const [isLoadingTicker, setIsLoadingTicker] = React.useState(false);
  const [tickerError, setTickerError] = React.useState<string | null>(null);
  const [marketStatuses, setMarketStatuses] = React.useState<Record<string, MarketStatusInfo>>({});
  const [currentTimeEST, setCurrentTimeEST] = React.useState<string>('Loading...');
  
  const [newsData, setNewsData] = React.useState<any[]>(mockStaticNewsData); 
  const [isLoadingNews, setIsLoadingNews] = React.useState(false); 
  const [newsError, setNewsError] = React.useState<string | null>(null);

  const [selectedRange, setSelectedRange] = React.useState<string>('1Y');
  const [chartData, setChartData] = React.useState<PriceHistoryPoint[]>([]);

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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);


  const fetchPolygonData = React.useCallback(async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
    console.log(`[STATIC MODE] Mock fetchPolygonData called for ${endpoint} with params:`, params);
    await new Promise(resolve => setTimeout(resolve, 50));

    if (endpoint.includes('/v3/reference/ipos')) {
      return { results: [{ name: 'Mock IPO Inc.', expected_pricing_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd') }] };
    }
    if (endpoint.includes('/v1/marketstatus/upcoming')) {
      return [{ exchange: 'NASDAQ', name: 'Mock Market Holiday', date: format(addMonths(new Date(), 2), 'yyyy-MM-dd'), status: 'closed' }];
    }
    if (endpoint.includes('/v3/reference/dividends') && params.ticker) {
      return { results: [{ ticker: params.ticker, ex_dividend_date: format(new Date(), 'yyyy-MM-dd'), cash_amount: 0.25 }] };
    }
    if (endpoint.includes('/v2/reference/news')) {
        return { results: mockStaticNewsData.slice(0,5) };
    }
    if (endpoint.includes('/v3/reference/tickers/')) { 
        const ticker = endpoint.split('/').pop() || "MOCK";
        return { 
            results: { 
                name: `${ticker} Company (Static)`, 
                ticker: ticker, 
                primary_exchange: 'STATICX', 
                sic_description: 'Static Industry',
                branding: { logo_url: '' },
                market_cap: Math.random() * 1e12,
            }
        };
    }
    if (endpoint.includes('/v2/aggs/ticker/') && endpoint.includes('/prev')) { 
        return { results: [{ c: 100 + Math.random()*10, o: 98 + Math.random()*10, l: 95 + Math.random()*5, h: 102 + Math.random()*5, v: 1000000 + Math.random()*500000 }] };
    }
    if (endpoint.includes('/v2/aggs/ticker/') && endpoint.includes('/range/')) { 
        const history: PriceHistoryPoint[] = [];
        let currentDate = subYears(new Date(), 1);
        for(let i=0; i<252; i++){ 
            history.push({ date: format(currentDate, 'yyyy-MM-dd'), close: 100 + Math.sin(i/20) * 10 + Math.random()*5 });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return { results: history.map(p => ({ t: parseISO(p.date).getTime(), c: p.close})) };
    }

    return { results: [], error: `Static mode: No mock data for ${endpoint}` };
  }, []);


  const fetchIPOs = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, ipos: true }));
    setIpoError(null);
    const data = await fetchPolygonData('/v3/reference/ipos'); 
    if (data.error) setIpoError(data.error); else setIpoEvents(data.results || []);
    setIsLoadingEvents(prev => ({ ...prev, ipos: false }));
  }, [fetchPolygonData]);

  const fetchMarketHolidays = React.useCallback(async () => {
    setIsLoadingEvents(prev => ({ ...prev, holidays: true }));
    setHolidayError(null);
    const data = await fetchPolygonData('/v1/marketstatus/upcoming'); 
    if (data.error) setHolidayError(data.error); else setMarketHolidays(data || []);
    setIsLoadingEvents(prev => ({ ...prev, holidays: false }));
  }, [fetchPolygonData]);

  const fetchDividends = React.useCallback(async (ticker: string) => {
    if (!ticker) { setDividendEvents([]); setDividendError(null); return; }
    setIsLoadingEvents(prev => ({ ...prev, dividends: true }));
    setDividendError(null);
    const data = await fetchPolygonData('/v3/reference/dividends', { ticker }); 
    if (data.error) setDividendError(data.error); else setDividendEvents(data.results || []);
    setIsLoadingEvents(prev => ({ ...prev, dividends: false }));
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
    return mockStaticEvents;
  }, []); 

  const handleEventDayClick = (day: Date) => {
    setSelectedEventDate(day);
    const dayEvents = allEventsForCalendar.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && isSameDay(eventDate, day);
      } catch (e) {
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
        <span className={cn(dateFnsIsToday(props.date) && "font-bold text-primary")}>{format(props.date, "d")}</span>
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
    await new Promise(resolve => setTimeout(resolve, 200));
    setNewsData(mockStaticNewsData.slice(0, 5)); 
    setIsLoadingNews(false);
  }, []);

  React.useEffect(() => {
    const loadMarketData = async () => {
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
    if (range === '1D' && fullHistory.length > 0) return [fullHistory[fullHistory.length -1]]; 
    if (range === '1W' && fullHistory.length > 5) return fullHistory.slice(-5);
    if (range === '1M' && fullHistory.length > 20) return fullHistory.slice(-20);
    return fullHistory; 
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

    const symbol = tickerQuery.toUpperCase();
    await new Promise(resolve => setTimeout(resolve, 500));

    const staticTickerDetails: Record<string, Partial<TickerFullData>> = {
        'AAPL': {
            companyName: 'Apple Inc.',
            symbol: 'AAPL', exchange: 'NASDAQ', sector: 'Technology', industry: 'Consumer Electronics', logo: `https://placehold.co/48x48.png?text=AAPL`, marketCap: "2.8T", currentPrice: "195.16", priceChangeAmount: "+0.88", priceChangePercent: "+0.45", previousClose: "194.28", openPrice: "194.50", daysRange: "193.90 - 195.50", volume: "45M", avgVolume: "55M", peRatio: "30.5", eps: "6.40", dividendYield: "0.5%", beta: "1.2", nextEarningsDate: "Jul 25, 2024", dividendDate: "May 10, 2024",
            fullPriceHistory: Array.from({length: 252}, (_, i) => ({ date: format(subYears(new Date(), 1).setDate(new Date().getDate() - (251-i)), 'yyyy-MM-dd'), close: 170 + Math.sin(i/20)*20 + Math.random()*10})),
        },
        'MSFT': {
            companyName: 'Microsoft Corporation',
            symbol: 'MSFT', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software - Infrastructure', logo: `https://placehold.co/48x48.png?text=MSFT`, marketCap: "3.1T", currentPrice: "420.72", priceChangeAmount: "-1.20", priceChangePercent: "-0.28", previousClose: "421.92", openPrice: "421.00", daysRange: "419.50 - 422.00", volume: "18M", avgVolume: "22M", peRatio: "38.2", eps: "11.01", dividendYield: "0.7%", beta: "0.9", nextEarningsDate: "Jul 22, 2024", dividendDate: "Jun 05, 2024",
            fullPriceHistory: Array.from({length: 252}, (_, i) => ({ date: format(subYears(new Date(), 1).setDate(new Date().getDate() - (251-i)), 'yyyy-MM-dd'), close: 380 + Math.sin(i/25)*30 + Math.random()*15})),
        }
    };

    if (staticTickerDetails[symbol]) {
        setTickerData(staticTickerDetails[symbol] as TickerFullData);
    } else {
        setTickerError(`No static data found for ticker "${symbol}". Try AAPL or MSFT.`);
    }
    setIsLoadingTicker(false);
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
                    <span>
                      {isMounted && item.published_utc 
                        ? formatDistanceToNowStrict(parseISO(item.published_utc), { addSuffix: true }) 
                        : "Calculating..."
                      }
                    </span>
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
              <h3 className="text-2xl font-bold text-foreground mb-1">{`${tickerData.companyName} (${tickerData.symbol})`}</h3>
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
