
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
import { Brain, ChevronLeft, ChevronRight, MessageSquare, Send, X } from 'lucide-react'; 
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

interface StaticTickerItem {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  color: string;
}

const STATIC_TICKER_ITEMS: StaticTickerItem[] = [
  { symbol: 'AAPL', price: '$195.16', change: '▼', changePercent: '0.45%', color: 'text-red-400' },
  { symbol: 'MSFT', price: '$420.72', change: '▲', changePercent: '1.10%', color: 'text-green-400' },
  { symbol: 'TSLA', price: '$180.01', change: '▼', changePercent: '2.30%', color: 'text-red-400' },
  { symbol: 'AMZN', price: '$185.99', change: '▲', changePercent: '0.75%', color: 'text-green-400' },
  { symbol: 'META', price: '$498.50', change: '▲', changePercent: '1.50%', color: 'text-green-400' },
  { symbol: 'GOOGL', price: '$175.60', change: '▼', changePercent: '0.20%', color: 'text-red-400' },
  { symbol: 'NVDA', price: '$120.88', change: '▲', changePercent: '3.10%', color: 'text-green-400' }, // Note: NVDA had a stock split, price is illustrative
  { symbol: 'JPM', price: '$197.88', change: '▲', changePercent: '0.65%', color: 'text-green-400' },
  { symbol: 'JNJ', price: '$148.50', change: '▼', changePercent: '0.15%', color: 'text-red-400' },
  { symbol: 'V', price: '$275.30', change: '▲', changePercent: '0.80%', color: 'text-green-400' },
  { symbol: 'PG', price: '$167.90', change: '▲', changePercent: '0.40%', color: 'text-green-400' },
  { symbol: 'UNH', price: '$490.20', change: '▼', changePercent: '0.90%', color: 'text-red-400' },
  { symbol: 'DIS', price: '$101.75', change: '▲', changePercent: '1.25%', color: 'text-green-400' },
  { symbol: 'MA', price: '$450.60', change: '▲', changePercent: '0.95%', color: 'text-green-400' },
  { symbol: 'HD', price: '$330.10', change: '▼', changePercent: '0.55%', color: 'text-red-400' },
  { symbol: 'BAC', price: '$39.50', change: '▲', changePercent: '1.05%', color: 'text-green-400' },
  { symbol: 'NFLX', price: '$650.80', change: '▼', changePercent: '1.15%', color: 'text-red-400' },
  { symbol: 'XOM', price: '$110.25', change: '▲', changePercent: '0.70%', color: 'text-green-400' },
  { symbol: 'KO', price: '$63.40', change: '▲', changePercent: '0.30%', color: 'text-green-400' },
  { symbol: 'CSCO', price: '$46.80', change: '▼', changePercent: '0.50%', color: 'text-red-400' },
];

function TickerContent() {
  const { tickerMessage } = useTicker();

  if (tickerMessage) {
    const repeatedMessage = Array(15).fill(tickerMessage).join("  •••  ");
    return (
      <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
        <span className="text-white px-3">{repeatedMessage}</span>
        <span className="text-white px-3">{repeatedMessage}</span> 
      </div>
    );
  }
  
  // Duplicate the static items multiple times to ensure smooth scrolling
  const duplicatedTickerItems = Array(3).fill(STATIC_TICKER_ITEMS).flat();

  return (
    <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
      {duplicatedTickerItems.map((item, index) => (
        <span key={`${item.symbol}-${index}`} className="text-white px-4"> 
          {item.symbol}: <span className={item.color || 'text-white'}>{item.price} {item.change}{item.changePercent}</span>
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
