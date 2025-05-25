// src/app/layout.tsx
"use client";

import { Inter, Roboto_Mono } from 'next/font/google';
import * as React from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Image from 'next/image'; // Added for brain icon in chatbot FAB if used

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased flex flex-col`}>
        {/* Stock Ticker - remains fixed at the top */}
        <div className="w-full overflow-hidden bg-black/90 border-b border-gray-700 py-2 fixed top-0 z-50">
          <div className="animate-ticker whitespace-nowrap flex space-x-6 text-sm font-mono">
            {/* Stock items - repeated for seamless scroll */}
            <span className="text-white">AAPL: <span className="text-green-400">$189.45 ▲1.2%</span></span>
            <span className="text-white">MSFT: <span className="text-red-400">$324.12 ▼0.4%</span></span>
            <span className="text-white">NVDA: <span className="text-green-400">$1122.33 ▲2.1%</span></span>
            <span className="text-white">GOOGL: <span className="text-green-400">$132.99 ▲0.6%</span></span>
            <span className="text-white">TSLA: <span className="text-red-400">$172.43 ▼1.0%</span></span>
            <span className="text-white">AMZN: <span className="text-green-400">$123.55 ▲0.9%</span></span>
            <span className="text-white">META: <span className="text-green-400">$309.70 ▲1.7%</span></span>
            <span className="text-white">NFLX: <span className="text-red-400">$402.20 ▼0.6%</span></span>
            <span className="text-white">AMD: <span className="text-green-400">$132.44 ▲2.4%</span></span>
            <span className="text-white">INTC: <span className="text-red-400">$37.15 ▼0.2%</span></span>
            <span className="text-white">SNOW: <span className="text-red-400">$178.40 ▼1.2%</span></span>
            <span className="text-white">SHOP: <span className="text-green-400">$68.90 ▲1.5%</span></span>
            <span className="text-white">COIN: <span className="text-green-400">$142.70 ▲3.6%</span></span>
            <span className="text-white">BABA: <span className="text-red-400">$85.10 ▼0.9%</span></span>
            <span className="text-white">ROKU: <span className="text-green-400">$62.22 ▲2.0%</span></span>
            {/* Duplicate set for seamless scroll */}
            <span className="text-white">AAPL: <span className="text-green-400">$189.45 ▲1.2%</span></span>
            <span className="text-white">MSFT: <span className="text-red-400">$324.12 ▼0.4%</span></span>
            <span className="text-white">NVDA: <span className="text-green-400">$1122.33 ▲2.1%</span></span>
            <span className="text-white">GOOGL: <span className="text-green-400">$132.99 ▲0.6%</span></span>
            <span className="text-white">TSLA: <span className="text-red-400">$172.43 ▼1.0%</span></span>
            <span className="text-white">AMZN: <span className="text-green-400">$123.55 ▲0.9%</span></span>
            <span className="text-white">META: <span className="text-green-400">$309.70 ▲1.7%</span></span>
            <span className="text-white">NFLX: <span className="text-red-400">$402.20 ▼0.6%</span></span>
            <span className="text-white">AMD: <span className="text-green-400">$132.44 ▲2.4%</span></span>
            <span className="text-white">INTC: <span className="text-red-400">$37.15 ▼0.2%</span></span>
            <span className="text-white">SNOW: <span className="text-red-400">$178.40 ▼1.2%</span></span>
            <span className="text-white">SHOP: <span className="text-green-400">$68.90 ▲1.5%</span></span>
            <span className="text-white">COIN: <span className="text-green-400">$142.70 ▲3.6%</span></span>
            <span className="text-white">BABA: <span className="text-red-400">$85.10 ▼0.9%</span></span>
            <span className="text-white">ROKU: <span className="text-green-400">$62.22 ▲2.0%</span></span>
          </div>
        </div>

        <div className="flex flex-1 h-screen pt-10"> {/* Added wrapper with pt-10 */}
          <TooltipProvider delayDuration={0}>
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-transparent"> {/* Removed pt-10 from main */}
              {children}
            </main>
          </TooltipProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}