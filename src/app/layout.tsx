"use client";

import { Inter, Roboto_Mono } from 'next/font/google';
import * as React from 'react';
import Image from "next/image";
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { TickerProvider, useTicker } from "@/contexts/ticker-context";
import { cn } from '@/lib/utils';
import { Brain, ChevronLeft, ChevronRight, MessageSquare, Send, X } from 'lucide-react'; // Added Brain, Chevron icons
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

interface TickerItem {
  symbol: string;
  price?: string;
  change?: string;
  changePercent?: string;
  color?: string;
  error?: boolean;
  loading?: boolean;
}

// Reduced tickers and increased interval to avoid rate limits
const POLYGON_TICKERS_FOR_SCROLLING_TICKER = ['SPY', 'QQQ']; 

async function fetchPolygonTickerDataForScroll(symbol: string): Promise<TickerItem> {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  if (!apiKey) {
    // console.warn(`[Polygon API] Ticker: NEXT_PUBLIC_POLYGON_API_KEY is not defined. Cannot fetch ${symbol}.`);
    return { symbol, error: true, price: 'Key Missing', change: '', color: 'text-red-400' };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
       if (response.status === 429) {
        errorMessage = 'Rate Limit';
      } else {
        try {
          const errorData = await response.json();
          if (errorData && (errorData.message || errorData.error)) {
            errorMessage = errorData.message || errorData.error;
          }
        } catch (e) { /* ignore */ }
      }
      // console.warn(`[Polygon API] Ticker: Error fetching ${symbol}: ${errorMessage}`);
      return { symbol, error: true, price: `API Err: ${response.status}`, change: '', color: 'text-yellow-400' };
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const prevClose = data.results[0].c;
      const prevOpen = data.results[0].o;

      if (typeof prevClose !== 'number' || typeof prevOpen !== 'number') {
        // console.warn(`[Polygon API] Ticker: Invalid data for ${symbol}. Close: ${prevClose}, Open: ${prevOpen}`);
        return { symbol, error: true, price: 'Data N/A', change: '', color: 'text-yellow-400' };
      }

      const changeValue = prevClose - prevOpen;
      const changePercentNum = prevOpen !== 0 ? (changeValue / prevOpen) * 100 : 0;
      
      let color = 'text-white';
      let arrow = '';
      if (changePercentNum > 0.005) {
        color = 'text-green-400';
        arrow = '▲';
      } else if (changePercentNum < -0.005) {
        color = 'text-red-400';
        arrow = '▼';
      }

      return {
        symbol,
        price: `$${prevClose.toFixed(2)}`,
        change: `${arrow}${changeValue.toFixed(2)}`,
        changePercent: `(${arrow}${Math.abs(changePercentNum).toFixed(2)}%)`,
        color,
      };
    }
    // console.warn(`[Polygon API] Ticker: No data results for ${symbol}.`);
    return { symbol, error: true, price: 'No Data', change: '', color: 'text-yellow-400' };
  } catch (error: any) {
    // console.error(`[Polygon API] Ticker: Fetch error for ${symbol}:`, error.message || error);
    return { symbol, error: true, price: 'Fetch Err', change: '', color: 'text-red-400' };
  }
}

function TickerContent() {
  const { tickerMessage } = useTicker();
  const [tickerDataItems, setTickerDataItems] = React.useState<TickerItem[]>(
    POLYGON_TICKERS_FOR_SCROLLING_TICKER.map(symbol => ({ symbol, loading: true, price: 'Loading...', change: '', color: 'text-white' }))
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const loadAllTickerData = React.useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_POLYGON_API_KEY) {
      setTickerDataItems(POLYGON_TICKERS_FOR_SCROLLING_TICKER.map(symbol => ({ symbol, error: true, price: 'API Key Missing', change: '', color: 'text-red-400' })));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const results = await Promise.allSettled(POLYGON_TICKERS_FOR_SCROLLING_TICKER.map(fetchPolygonTickerDataForScroll));
    const newData = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // console.error(`[Polygon API] Ticker: Promise rejected for ${POLYGON_TICKERS_FOR_SCROLLING_TICKER[index]}:`, result.reason);
        return { symbol: POLYGON_TICKERS_FOR_SCROLLING_TICKER[index], error: true, price: 'Fetch Error', change: '', color: 'text-red-400' };
      }
    });
    setTickerDataItems(newData);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadAllTickerData();
    const intervalId = setInterval(loadAllTickerData, 900000); // Refresh every 15 minutes
    return () => clearInterval(intervalId);
  }, [loadAllTickerData]);

  if (tickerMessage) {
    const repeatedMessage = Array(15).fill(tickerMessage).join("  •••  ");
    return (
      <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
        <span className="text-white px-3">{repeatedMessage}</span>
        <span className="text-white px-3">{repeatedMessage}</span> 
      </div>
    );
  }

  if (isLoading && tickerDataItems.every(item => item.loading)) {
    return <div className="text-sm font-mono text-center text-muted-foreground py-0.5">Loading ticker data...</div>;
  }
  
  const itemsToRender = tickerDataItems.filter(item => !item.error || (item.error && item.price !== 'API Key Missing' && item.price !== 'Rate Limit'));
  if (itemsToRender.length === 0 && !isLoading) {
     return <div className="text-sm font-mono text-center text-muted-foreground py-0.5">Ticker data unavailable. Check API Key or Polygon.io subscription.</div>;
  }
  
  // Duplicate the items multiple times to ensure smooth scrolling, especially if the list is short
  const duplicatedTickerItems = Array(5).fill(itemsToRender).flat();


  return (
    <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
      {duplicatedTickerItems.map((item, index) => (
        <span key={`${item.symbol}-${index}`} className="text-white px-4"> 
          {item.symbol}: <span className={item.color || 'text-white'}>{item.price} {item.change} {item.changePercent}</span>
        </span>
      ))}
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased flex flex-col h-screen`}>
        <AuthProvider>
          <TickerProvider>
            <div className="w-full overflow-hidden bg-black/90 border-b border-gray-700 py-2 fixed top-0 z-50">
              <TickerContent />
            </div>
            <div className="flex flex-1 h-screen pt-10"> {/* pt-10 to offset for fixed ticker */}
              <TooltipProvider delayDuration={0}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-transparent no-visual-scrollbar">
                  {children}
                </main>
              </TooltipProvider>
            </div>
            <Toaster />
          </TickerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
