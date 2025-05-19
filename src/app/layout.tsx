
"use client"; // Keep client for chatbot state for now

import { Geist, Geist_Mono } from 'next/font/google';
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
import { Send, X } from 'lucide-react';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
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
      text: `Maven echoes: "${currentMessage}"`, // Placeholder response
      sender: 'bot',
    };

    setChatMessages(prevMessages => [...prevMessages, newUserMessage, botResponse]);
    setCurrentMessage('');
  };

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="w-full overflow-hidden bg-black/90 border-b border-gray-700 py-2 fixed top-0 z-50">
          <div className="animate-marquee whitespace-nowrap text-sm text-white">
            <span className="mx-4">AAPL: $189.45 ▲1.2%</span>
            <span className="mx-4">MSFT: $324.12 ▼0.4%</span>
            <span className="mx-4">NVDA: $1,122.33 ▲2.1%</span>
            <span className="mx-4">GOOGL: $132.99 ▲0.6%</span>
            <span className="mx-4">TSLA: $172.43 ▼1.0%</span>
            <span className="mx-4">AMZN: $123.55 ▲0.9%</span>
            <span className="mx-4">META: $309.70 ▲1.7%</span>
            <span className="mx-4">NFLX: $402.20 ▼0.6%</span>
            <span className="mx-4">AMD: $132.44 ▲2.4%</span>
            <span className="mx-4">CRM: $220.11 ▲0.3%</span>
            <span className="mx-4">INTC: $37.15 ▼0.2%</span>
            <span className="mx-4">ORCL: $116.50 ▲1.1%</span>
            <span className="mx-4">UBER: $72.90 ▲1.8%</span>
            <span className="mx-4">LYFT: $15.44 ▼0.8%</span>
            <span className="mx-4">SPOT: $308.20 ▲2.9%</span>
            <span className="mx-4">SNOW: $178.40 ▼1.2%</span>
            <span className="mx-4">SHOP: $68.90 ▲1.5%</span>
            <span className="mx-4">COIN: $142.70 ▲3.6%</span>
            <span className="mx-4">BABA: $85.10 ▼0.9%</span>
            <span className="mx-4">ROKU: $62.22 ▲2.0%</span>
            {/* Duplicate for seamless scroll */}
            <span className="mx-4">AAPL: $189.45 ▲1.2%</span>
            <span className="mx-4">MSFT: $324.12 ▼0.4%</span>
            <span className="mx-4">NVDA: $1,122.33 ▲2.1%</span>
            <span className="mx-4">GOOGL: $132.99 ▲0.6%</span>
            <span className="mx-4">TSLA: $172.43 ▼1.0%</span>
            <span className="mx-4">AMZN: $123.55 ▲0.9%</span>
            <span className="mx-4">META: $309.70 ▲1.7%</span>
            <span className="mx-4">NFLX: $402.20 ▼0.6%</span>
            <span className="mx-4">AMD: $132.44 ▲2.4%</span>
            <span className="mx-4">CRM: $220.11 ▲0.3%</span>
            <span className="mx-4">INTC: $37.15 ▼0.2%</span>
            <span className="mx-4">ORCL: $116.50 ▲1.1%</span>
            <span className="mx-4">UBER: $72.90 ▲1.8%</span>
            <span className="mx-4">LYFT: $15.44 ▼0.8%</span>
            <span className="mx-4">SPOT: $308.20 ▲2.9%</span>
            <span className="mx-4">SNOW: $178.40 ▼1.2%</span>
            <span className="mx-4">SHOP: $68.90 ▲1.5%</span>
            <span className="mx-4">COIN: $142.70 ▲3.6%</span>
            <span className="mx-4">BABA: $85.10 ▼0.9%</span>
            <span className="mx-4">ROKU: $62.22 ▲2.0%</span>
          </div>
        </div>
        {/* Adjust pt-10 or similar on the main content wrapper if needed to account for ticker height */}
        <SidebarProvider defaultOpen={true}>
          <Sidebar
            collapsible="none"
            className="shadow-sidebar-glow pt-10" // Added pt-10 to push sidebar content below ticker
          >
            <SidebarHeader className="p-4 px-5 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Image
                    src="/icons/brain-logo.png"
                    alt="Sanctuary Matrix Logo"
                    fill
                    className="object-contain" 
                  />
                </div>
                <div className="text-xl font-bold text-white leading-tight">
                  <div>Sanctuary</div>
                  <div>Matrix</div>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavItems />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="pt-10"> {/* Added pt-10 to push main content below ticker */}
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />

        {/* Chatbot FAB */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 flex items-center justify-center animate-pulse-glow"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Chat with Maven AI"
        >
          <Image src="/icons/brain-logo.png" alt="Chat with Maven AI" width={32} height={32} />
        </Button>

        {/* Chatbot Dialog */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[40%] h-[70vh] flex flex-col bg-card/90 backdrop-blur-md border-none shadow-xl">
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
