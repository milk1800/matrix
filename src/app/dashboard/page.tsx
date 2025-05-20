
"use client"; // Required for potential client-side interactions in the future

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
  Landmark // Fallback icon for indexes if needed
} from 'lucide-react';

// Helper function to determine badge color for Economic Calendar
const getEventBadgeColor = (colorName: string) => {
  switch (colorName.toLowerCase()) {
    case 'orange':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'purple':
      return 'bg-primary/20 text-primary border-primary/50';
    case 'yellow':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

// Helper function to determine news sentiment badge color
const getNewsSentimentBadgeColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-green-500/20 text-green-400';
    case 'negative':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};


export default function DashboardPage() {
  // Mock data
  const marketOverviewData = [
    { name: 'S&P 500', value: '4,500.21', change: '+0.5%', changeValue: 22.50, changeType: 'up', hours: 'Market Open' },
    { name: 'NASDAQ', value: '14,000.75', change: '-0.2%', changeValue: -28.00, changeType: 'down', hours: 'Market Open' },
    { name: 'Dow Jones', value: '35,000.90', change: '+0.8%', changeValue: 280.00, changeType: 'up', hours: 'Market Open' },
    { name: 'VIX', value: '15.30', change: '+1.1%', changeValue: 0.17, changeType: 'up', hours: 'Market Closed' },
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

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Welcome Josh!
      </h1>

      {/* Market Overview */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketOverviewData.map((item) => (
            <PlaceholderCard key={item.name} title={item.name} className="flex flex-col justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className={`text-sm ${item.changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.changeType === 'up' ? <TrendingUp className="inline-block w-4 h-4 mr-1" /> : <TrendingDown className="inline-block w-4 h-4 mr-1" />}
                  {item.change} ({item.changeType === 'up' ? '+' : ''}{item.changeValue.toFixed(2)})
                </p>
                <div className="h-10 w-full my-3 bg-muted/20 rounded-md flex items-center justify-center" data-ai-hint="mini trendline chart">
                   <span className="text-xs text-muted-foreground/50">Mini Trendline</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border/20">{item.hours}</p>
            </PlaceholderCard>
          ))}
        </div>
      </section>

      {/* Main Content Grid (Left, Center, Right Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sector Performance */}
        <div className="lg:col-span-1 space-y-6">
          <PlaceholderCard title="Sector Performance" icon={BarChart4}>
            <div className="h-[300px] md:h-[350px]">
              <PlaceholderChart dataAiHint="sector performance vertical bar" />
            </div>
          </PlaceholderCard>
        </div>

        {/* Center Panel: AI Market Narrative */}
        <div className="lg:col-span-1 space-y-6">
          <PlaceholderCard title="AI" icon={Cpu}>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why the Market Moved</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Today's market session saw mixed signals as investors digested the latest inflation data and upcoming earnings reports from key tech giants. While the energy sector continued its upward trend due to geopolitical tensions, technology stocks experienced some profit-taking after a strong rally last week. The financial sector showed resilience, buoyed by positive stress test results.
            </p>
          </PlaceholderCard>
        </div>

        {/* Right Panel: Top Gainers/Losers & Latest News */}
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

      {/* Bottom Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceholderCard title="Watchlist Movers">
          <ul className="space-y-1 text-sm">
            {/* Combining some gainers and losers for variety */}
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

