"use client"; // Required for state and event handlers

// import type { Metadata } from 'next'; // Client components cannot export metadata
import { Geist, Geist_Mono } from 'next/font/google';
import * as React from 'react';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNavItems } from '@/components/layout/sidebar-nav-items';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X } from 'lucide-react';

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
      text: `Maven echoes: "${currentMessage}"`,
      sender: 'bot',
    };

    setChatMessages(prevMessages => [...prevMessages, newUserMessage, botResponse]);
    setCurrentMessage('');
  };

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <Sidebar
            collapsible="none"
            className="shadow-sidebar-glow"
          >
            <SidebarHeader className="p-4 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 animate-pulse-glow">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor='#c5b3ff' stopOpacity={1} />
                        <stop offset="40%" stopColor='#a855f7' stopOpacity={1} />
                        <stop offset="100%" stopColor='#9333ea' stopOpacity={0.9} />
                      </radialGradient>
                    </defs>
                    <path
                      d="M12 3C8.686 3 6 5.686 6 9C6 10.481 6.444 11.844 7.209 12.949C7.073 13.3 7 13.638 7 14C7 16.209 8.791 18 11 18V21H13V18C15.209 18 17 16.209 17 14C17 13.638 16.927 13.3 16.791 12.949C17.556 11.844 18 10.481 18 9C18 5.686 15.314 3 12 3ZM8 9C8 6.791 9.791 5 12 5C14.209 5 16 6.791 16 9C16 10.813 14.908 12.347 13.349 12.861C13.131 13.483 13 14.251 13 15H11C11 14.251 10.869 13.483 10.651 12.861C9.092 12.347 8 10.813 8 9Z"
                      fill="url(#brainGradient)"
                    />
                    <path
                      d="M11.5 10.5A0.5 0.5 0 0011 11V12A0.5 0.5 0 0011.5 12.5H12.5A0.5 0.5 0 0013 12V11A0.5 0.5 0 0012.5 10.5H11.5Z"
                      fill="url(#brainGradient)"
                    />
                    <path
                      d="M9.5 7.5A0.5 0.5 0 009 8V9A0.5 0.5 0 009.5 9.5H10.5A0.5 0.5 0 0011 9V8A0.5 0.5 0 0010.5 7.5H9.5Z"
                      fill="url(#brainGradient)"
                    />
                    <path
                      d="M13.5 7.5A0.5 0.5 0 0013 8V9A0.5 0.5 0 0013.5 9.5H14.5A0.5 0.5 0 0015 9V8A0.5 0.5 0 0014.5 7.5H13.5Z"
                      fill="url(#brainGradient)"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-foreground">Sanctuary Matrix</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavItems />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />

        {/* Chatbot FAB */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 flex items-center justify-center animate-pulse-glow"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Chat"
        >
          <MessageSquare className="h-7 w-7 text-primary-foreground" />
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
