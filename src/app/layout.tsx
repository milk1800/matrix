
"use client";

import { Inter, Roboto_Mono } from 'next/font/google';
import * as React from 'react';
import Image from "next/image";
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { TickerProvider, useTicker } from "@/contexts/ticker-context"; // Import TickerProvider

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

// Define a component to render the ticker content based on context
function TickerContent() {
  const { tickerMessage } = useTicker();

  if (tickerMessage) {
    // Repeat the message a few times to ensure scrolling for shorter messages
    const repeatedMessage = Array(5).fill(tickerMessage).join(" ••• ");
    return (
      <div className="animate-ticker whitespace-nowrap flex space-x-6 text-sm font-mono">
        <span className="text-white">{repeatedMessage}</span>
      </div>
    );
  }

  // Default stock ticker
  const stockItems = [
    { symbol: 'AAPL', price: '$189.45', change: '▲1.2%', color: 'text-green-400' },
    { symbol: 'MSFT', price: '$324.12', change: '▼0.4%', color: 'text-red-400' },
    { symbol: 'NVDA', price: '$1122.33', change: '▲2.1%', color: 'text-green-400' },
    { symbol: 'GOOGL', price: '$132.99', change: '▲0.6%', color: 'text-green-400' },
    { symbol: 'TSLA', price: '$172.43', change: '▼1.0%', color: 'text-red-400' },
    { symbol: 'AMZN', price: '$123.55', change: '▲0.9%', color: 'text-green-400' },
    { symbol: 'META', price: '$309.70', change: '▲1.7%', color: 'text-green-400' },
    { symbol: 'NFLX', price: '$402.20', change: '▼0.6%', color: 'text-red-400' },
    { symbol: 'AMD', price: '$132.44', change: '▲2.4%', color: 'text-green-400' },
    { symbol: 'INTC', price: '$37.15', change: '▼0.2%', color: 'text-red-400' },
    { symbol: 'SNOW', price: '$178.40', change: '▼1.2%', color: 'text-red-400' },
    { symbol: 'SHOP', price: '$68.90', change: '▲1.5%', color: 'text-green-400' },
    { symbol: 'COIN', price: '$142.70', change: '▲3.6%', color: 'text-green-400' },
    { symbol: 'BABA', price: '$85.10', change: '▼0.9%', color: 'text-red-400' },
    { symbol: 'ROKU', price: '$62.22', change: '▲2.0%', color: 'text-green-400' },
  ];
  const duplicatedStockItems = [...stockItems, ...stockItems]; // Duplicate for seamless scroll

  return (
    <div className="animate-ticker whitespace-nowrap flex space-x-6 text-sm font-mono">
      {duplicatedStockItems.map((stock, index) => (
        <span key={index} className="text-white">
          {stock.symbol}: <span className={stock.color}>{stock.price} {stock.change}</span>
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
          <TickerProvider> {/* Wrap with TickerProvider */}
            <div className="w-full overflow-hidden bg-black/90 border-b border-gray-700 py-2 fixed top-0 z-50">
              <TickerContent />
            </div>
            <div className="flex flex-1 pt-10"> {/* pt-10 to account for fixed ticker height */}
              <TooltipProvider delayDuration={0}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-transparent">
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
