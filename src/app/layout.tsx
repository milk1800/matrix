
"use client";

import { Inter, Roboto_Mono } from 'next/font/google'; // Changed to valid Google Fonts
import * as React from 'react';
import Image from "next/image";
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNavItems } from '@/components/layout/sidebar-nav-items';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Brain } from 'lucide-react';

const mainFont = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const monoFont = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [chatMessages]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: `Maven echoes: "${currentMessage}"`,
      sender: 'bot',
    };

    setChatMessages(prevMessages => [...prevMessages, newUserMessage, botResponse]);
    setCurrentMessage('');
  };

  return (
    <html lang="en" className="dark">
      <body className={`${mainFont.variable} ${monoFont.variable} antialiased`}>
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

        <SidebarProvider defaultOpen={true}>
          <Sidebar
            collapsible="none"
            className="shadow-sidebar-glow pt-10"
          >
            <SidebarHeader className="p-4 px-5 border-b border-sidebar-border">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-500 mr-2" />
                <span className="text-xl font-bold text-white">Sanctuary Matrix</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavItems />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="pt-10">
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />

        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 flex items-center justify-center animate-pulse-glow"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Chat with Maven AI"
        >
          <Image src="/assets/brain-logo.png" alt="Chat with Maven AI" width={36} height={36} />
        </Button>

        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[40%] h-[70vh] flex flex-col bg-card/60 backdrop-blur-md border-none shadow-xl">
            <DialogHeader className="p-4 border-b border-border/50">
              <DialogTitle className="text-lg font-semibold text-foreground">Chat with Maven AI</DialogTitle>
               <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </DialogHeader>
            <ScrollArea className="flex-grow p-4 space-y-3 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[75%] text-sm shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <DialogFooter className="p-4 border-t border-border/50">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                />
                <Button
                  type="submit"
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  aria-label="Send Message"
                  disabled={!currentMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </body>
    </html>
  );
}
