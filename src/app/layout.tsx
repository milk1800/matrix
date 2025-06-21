
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
  
  const defaultMessage = "Note: APIs are currently disconnected. Static data is displayed for demo purposes only. This is a personal project.";
  const repeatedDefaultMessage = Array(5).fill(defaultMessage).join("  //  ");

  return (
    <div className="animate-ticker whitespace-nowrap flex items-center text-sm font-mono">
      <span className="text-orange-400 px-3">{repeatedDefaultMessage}</span>
      <span className="text-orange-400 px-3">{repeatedDefaultMessage}</span>
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
