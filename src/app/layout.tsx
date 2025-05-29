
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
import { Brain } from 'lucide-react';

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
  color?: string;
  error?: boolean;
  loading?: boolean;
}

const POLYGON_TICKERS = [
  'IVV', 'AGG', 'IWM', 'EFA', 'EEM', 'LQD', 'IJR', 'IWF', 'IWD', 'TIP', 
  'HYG', 'QUAL', 'IEFA', 'IEMG', 'ITOT', 'IVW', 'IVE', 'IWB', 'IWN', 
  'IWO', 'IDV', 'ESGU', 'IJH', 'DVY', 'MBB', 'ICLN', 'TLT', 'SHV', 
  'SHY', 'IEI', 'IEF', 'USMV', 'ACWI', 'EWT', 'SCZ', 'IYR', 'EWC', 
  'EWA', 'EWH', 'MTUM', 'PFF', 'EPP', 'EPI', 'IAU', 'ICF', 'IJJ', 
  'IJT', 'IXN', 'IYF', 'IYT'
];

async function fetchPolygonTickerData(symbol: string): Promise<TickerItem> {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  if (!apiKey) {
    console.warn(`[Polygon Ticker] API Key Missing for ${symbol}`);
    return { symbol, error: true, price: 'N/A', change: '', color: 'text-white' };
  }

  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`);
    if (!response.ok) {
      console.error(`[Polygon Ticker] Error fetching ${symbol}: ${response.status}`);
      return { symbol, error: true, price: 'N/A', change: '', color: 'text-white' };
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const prevClose = data.results[0].c;
      const prevOpen = data.results[0].o;
      const changeValue = prevClose - prevOpen;
      const changePercent = prevOpen !== 0 ? (changeValue / prevOpen) * 100 : 0;
      
      let color = 'text-white';
      let arrow = '';
      if (changePercent > 0.005) { // Use a small threshold to avoid "▲0.00%"
        color = 'text-green-400';
        arrow = '▲';
      } else if (changePercent < -0.005) { // Use a small threshold
        color = 'text-red-400';
        arrow = '▼';
      }

      return {
        symbol,
        price: `$${prevClose.toFixed(2)}`,
        change: `${arrow}${Math.abs(changePercent).toFixed(2)}%`,
        color,
      };
    }
    return { symbol, error: true, price: 'N/A', change: '', color: 'text-white' };
  } catch (error) {
    console.error(`[Polygon Ticker] Fetch exception for ${symbol}:`, error);
    return { symbol, error: true, price: 'N/A', change: '', color: 'text-white' };
  }
}

function TickerContent() {
  const { tickerMessage } = useTicker();
  const [tickerDataItems, setTickerDataItems] = React.useState<TickerItem[]>(
    POLYGON_TICKERS.map(symbol => ({ symbol, loading: true, price: 'Loading...', change: '', color: 'text-white' }))
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const loadAllTickerData = React.useCallback(async () => {
    setIsLoading(true);
    const results = await Promise.allSettled(POLYGON_TICKERS.map(fetchPolygonTickerData));
    const newData = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`[Polygon Ticker] Failed to fetch ${POLYGON_TICKERS[index]}:`, result.reason);
        return { symbol: POLYGON_TICKERS[index], error: true, price: 'Error', change: '', color: 'text-red-400' };
      }
    });
    setTickerDataItems(newData);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadAllTickerData();
    const intervalId = setInterval(loadAllTickerData, 60000); // Refresh every 1 minute
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

  const itemsToRender = tickerDataItems.filter(item => !item.error || item.price !== 'N/A');
  if (itemsToRender.length === 0 && !isLoading) {
     return <div className="text-sm font-mono text-center text-muted-foreground py-0.5">Ticker data unavailable.</div>;
  }
  
  const duplicatedTickerItems = [...itemsToRender, ...itemsToRender, ...itemsToRender]; // Duplicate 3 times for very long ticker

  return (
    <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
      {duplicatedTickerItems.map((item, index) => (
        <span key={`${item.symbol}-${index}`} className="text-white px-3">
          {item.symbol}: <span className={item.color || 'text-white'}>{item.price} {item.change}</span>
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
