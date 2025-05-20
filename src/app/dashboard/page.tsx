
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { PlaceholderChart } from '@/components/dashboard/placeholder-chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart4, 
  Cpu, 
  Newspaper, 
  CalendarDays, 
  Sparkles, 
  Send,
  Landmark, // Fallback for index icons
  Clock,
  AlertCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const POLYGON_API_KEY = "4eIDg99n4FM2EKLkA8voxgJBrzIwQHkV"; // IMPORTANT: Move to .env.local for production!

interface MarketData {
  name: string;
  polygonTicker: string;
  openTime: string; // HH:MM in EST
  closeTime: string; // HH:MM in EST
  timezone: string; // e.g., 'America/New_York'
  icon?: React.ElementType;
}

const initialMarketOverviewData: MarketData[] = [
  { name: 'S&P 500', polygonTicker: 'I:SPX', openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York', icon: Landmark },
  { name: 'NASDAQ', polygonTicker: 'I:NDX', openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York', icon: Landmark },
  { name: 'Dow Jones', polygonTicker: 'I:DJI', openTime: '09:30', closeTime: '16:00', timezone: 'America/New_York', icon: Landmark },
  { name: 'VIX', polygonTicker: 'I:VIX', openTime: '09:15', closeTime: '16:15', timezone: 'America/New_York', icon: Landmark }, // VIX has slightly different hours often
];

const topGainers = [ { ticker: 'AMZN', change: '+2.3%' }, { ticker: 'NVDA', change: '+1.9%' }, { ticker: 'MSFT', change: '+1.5%' } ];
const topLosers = [ { ticker: 'TSLA', change: '-1.8%' }, { ticker: 'AAPL', change: '-0.9%' }, { ticker: 'GOOG', change: '-0.5%' } ];

const latestNews = [
  { headline: 'Tech stocks surge on AI optimism as new chipsets announced.', time: '2h ago', sentiment: 'positive' },
  { headline: 'Inflation fears ease as CPI data comes in slightly lower than expected.', time: '5h ago', sentiment: 'positive' },
  { headline: 'Global markets show mixed reactions to new international trade policies.', time: '1d ago', sentiment: 'neutral' },
  { headline: 'Oil prices dip amid concerns of slowing global demand.', time: '2d ago', sentiment: 'negative' },
];

const economicCalendar = [
  { event: 'CPI Report', date: 'Oct 12', tagColor: 'orange' },
  { event: 'Fed Meeting', date: 'Oct 25-26', tagColor: 'purple' },
  { event: 'Jobs Report', date: 'Nov 3', tagColor: 'yellow' },
];

const getEventBadgeColor = (colorName: string) => {
  switch (colorName.toLowerCase()) {
    case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'purple': return 'bg-primary/20 text-primary border-primary/50';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getNewsSentimentBadgeColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive': return 'bg-green-500/20 text-green-400';
    case 'negative': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

interface MarketStatus {
  status: 'LOADING' | 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'ERROR';
  statusText: string;
  tooltipText: string;
  shadowClass: string;
}

interface FetchedIndexData {
  c?: number; // Close price
  o?: number; // Open price
  error?: string;
  loading?: boolean;
}

export default function DashboardPage() {
  const [marketStatuses, setMarketStatuses] = React.useState<Record<string, MarketStatus>>({});
  const [currentTimeEST, setCurrentTimeEST] = React.useState<string>('Loading...');
  const [marketApiData, setMarketApiData] = React.useState<Record<string, FetchedIndexData>>({});

  const fetchIndexData = async (symbol: string): Promise<FetchedIndexData> => {
    try {
      const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching ${symbol}: ${response.status} ${errorData.message || response.statusText}`);
        return { error: `API Error: ${response.status}` };
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { c, o } = data.results[0];
        return { c, o };
      }
      return { error: 'No data found' };
    } catch (error) {
      console.error(`Network error fetching ${symbol}:`, error);
      return { error: 'Network error' };
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
          // For any failed promise, we might not have result.value.symbol directly.
          // This part may need adjustment if we want to map errors back to symbols
          // from the original promises array if the error object doesn't contain the symbol.
          // For now, unfulfilled promises mean their entries won't be in newApiData.
          console.error("A fetch promise was rejected:", result.reason);
        }
      });
      setMarketApiData(prevData => ({...prevData, ...newApiData}));
    };
    loadMarketData();
  }, []);


  const updateMarketStatuses = React.useCallback(() => {
    const newStatuses: Record<string, MarketStatus> = {};
    const now = new Date();

    initialMarketOverviewData.forEach(market => {
      const [openHour, openMinute] = market.openTime.split(':').map(Number);
      const [closeHour, closeMinute] = market.closeTime.split(':').map(Number);

      // Get current time in market's timezone (EST for these examples)
      const nowInMarketTimezone = new Date(now.toLocaleString('en-US', { timeZone: market.timezone }));
      
      const marketOpenTime = new Date(nowInMarketTimezone);
      marketOpenTime.setHours(openHour, openMinute, 0, 0);

      const marketCloseTime = new Date(nowInMarketTimezone);
      marketCloseTime.setHours(closeHour, closeMinute, 0, 0);

      const oneHourBeforeClose = new Date(marketCloseTime);
      oneHourBeforeClose.setHours(oneHourBeforeClose.getHours() - 1);
      
      let status: MarketStatus['status'];
      let statusText: string;
      let shadowClass: string;

      if (nowInMarketTimezone >= marketOpenTime && nowInMarketTimezone < oneHourBeforeClose) {
        status = 'OPEN';
        statusText = `🟢 Market Open`;
        shadowClass = 'shadow-market-open';
      } else if (nowInMarketTimezone >= oneHourBeforeClose && nowInMarketTimezone < marketCloseTime) {
        status = 'CLOSING_SOON';
        statusText = `🟡 Closing Soon`;
        shadowClass = 'shadow-market-closing';
      } else {
        status = 'CLOSED';
        statusText = `🔴 Market Closed`;
        shadowClass = 'shadow-market-closed';
      }
      
      newStatuses[market.name] = {
        status,
        statusText,
        tooltipText: `Market Hours: ${market.openTime} - ${market.closeTime} ${market.timezone.split('/')[1].replace('_', ' ')} Time`,
        shadowClass,
      };
    });
    setMarketStatuses(newStatuses);
  }, []);

  React.useEffect(() => {
    updateMarketStatuses();
    const liveTimeInterval = setInterval(() => {
      setCurrentTimeEST(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    const statusUpdateInterval = setInterval(updateMarketStatuses, 60000); // Update statuses every minute

    return () => {
      clearInterval(liveTimeInterval);
      clearInterval(statusUpdateInterval);
    };
  }, [updateMarketStatuses]);

  const calculateChangePercent = (currentPrice?: number, openPrice?: number) => {
    if (typeof currentPrice !== 'number' || typeof openPrice !== 'number' || openPrice === 0) {
      return null;
    }
    return ((currentPrice - openPrice) / openPrice) * 100;
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Welcome Josh!
      </h1>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialMarketOverviewData.map((market) => {
            const data = marketApiData[market.polygonTicker];
            const statusInfo = marketStatuses[market.name] || { statusText: 'Loading status...', tooltipText: 'Fetching market status...', shadowClass: 'shadow-white-glow-soft' };
            
            let valueDisplay = "$0.00";
            let changeDisplay: React.ReactNode = "0.00%";
            let changeType: 'up' | 'down' | 'neutral' = 'neutral';

            if (data?.loading) {
              valueDisplay = "Loading...";
              changeDisplay = "Loading...";
            } else if (data?.error) {
              valueDisplay = "N/A";
              changeDisplay = <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {data.error}</span>;
            } else if (data?.c !== undefined && data?.o !== undefined) {
              valueDisplay = `$${data.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const percentChange = calculateChangePercent(data.c, data.o);
              if (percentChange !== null) {
                changeType = percentChange >= 0 ? 'up' : 'down';
                changeDisplay = (
                  <span className={changeType === 'up' ? 'text-green-400' : 'text-red-400'}>
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
                className={`flex flex-col justify-between ${statusInfo.shadowClass} transition-shadow duration-300 ease-in-out`}
                icon={market.icon || Landmark}
              >
                <div>
                  <p className="text-2xl font-bold text-foreground">{valueDisplay}</p>
                  <div className="text-sm">{changeDisplay}</div>
                  <div className="h-10 w-full my-3 bg-black/30 rounded-md flex items-center justify-center backdrop-blur-sm" data-ai-hint="mini trendline chart">
                     <span className="text-xs text-muted-foreground/50">Mini Trendline</span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/20 flex justify-between items-center">
                        <span>{statusInfo.statusText}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{currentTimeEST}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>{statusInfo.tooltipText}</p>
                       {data?.c !== undefined && <p>Last Close: ${data.c.toLocaleString()}</p>}
                       {data?.o !== undefined && <p>Prev. Open: ${data.o.toLocaleString()}</p>}
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
          <PlaceholderCard title="Sector Performance" icon={BarChart4}>
            <div className="h-[300px] md:h-[350px]">
              <PlaceholderChart dataAiHint="sector performance vertical bar" />
            </div>
          </PlaceholderCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <PlaceholderCard title="AI" icon={Cpu}>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why the Market Moved</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Today's market session saw mixed signals as investors digested the latest inflation data and upcoming earnings reports from key tech giants. While the energy sector continued its upward trend due to geopolitical tensions, technology stocks experienced some profit-taking after a strong rally last week. The financial sector showed resilience, buoyed by positive stress test results.
            </p>
          </PlaceholderCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <PlaceholderCard title="Top Movers">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-green-400">Top Gainers</h4>
              {topGainers.map(g => (
                <div key={`g-${g.ticker}`} className="flex justify-between text-xs">
                  <span>{g.ticker}</span>
                  <span className="text-green-400">{g.change}</span>
                </div>
              ))}
              <h4 className="text-sm font-semibold text-red-400 mt-3 pt-2 border-t border-border/20">Top Losers</h4>
              {topLosers.map(l => (
                <div key={`l-${l.ticker}`} className="flex justify-between text-xs">
                  <span>{l.ticker}</span>
                  <span className="text-red-400">{l.change}</span>
                </div>
              ))}
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Latest News" icon={Newspaper}>
            <ul className="space-y-3">
              {latestNews.map((news, index) => (
                <li key={index} className="text-xs border-b border-border/20 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-1">
                    <span className={`mr-2 px-1.5 py-0.5 rounded-full text-xs font-semibold ${getNewsSentimentBadgeColor(news.sentiment)}`}>
                      {news.sentiment.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground/70">{news.time}</span>
                  </div>
                  <p className="text-foreground/90">{news.headline}</p>
                </li>
              ))}
            </ul>
          </PlaceholderCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceholderCard title="Watchlist Movers">
          <ul className="space-y-1 text-sm">
            {topGainers.slice(0,2).map(g => <li key={`watchlist-g-${g.ticker}`} className="flex justify-between py-1 border-b border-border/20 last:border-b-0"><span>{g.ticker}</span> <span className="text-green-400">{g.change}</span></li>)}
            {topLosers.slice(0,2).map(l => <li key={`watchlist-l-${l.ticker}`} className="flex justify-between py-1 border-b border-border/20 last:border-b-0"><span>{l.ticker}</span> <span className="text-red-400">{l.change}</span></li>)}
             <li key="watchlist-new" className="flex justify-between py-1"><span>TSM</span> <span className="text-green-400">+1.2%</span></li>
          </ul>
        </PlaceholderCard>

        <PlaceholderCard title="Economic Calendar" icon={CalendarDays}>
          <ul className="space-y-3">
            {economicCalendar.map(event => (
              <li key={event.event} className="flex items-center text-sm">
                <Badge variant="outline" className={`mr-3 ${getEventBadgeColor(event.tagColor)}`}>{event.event}</Badge>
                <span className="text-muted-foreground">{event.date}</span>
              </li>
            ))}
          </ul>
        </PlaceholderCard>

        <PlaceholderCard title="Ask Sanctuary AI" icon={Sparkles}>
          <div className="space-y-3">
            <Input 
              type="text" 
              placeholder="Type a question..." 
              className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" 
            />
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </PlaceholderCard>
      </div>
    </main>
  );
}

    