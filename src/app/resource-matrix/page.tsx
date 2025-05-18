"use client";

import * as React from "react";
import Image from "next/image";
import { UserCircle2, Send, Download, Loader2 } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ResourceMatrixPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoadingAiResponse, setIsLoadingAiResponse] = React.useState(false);
  const [currentAiResponseForPdf, setCurrentAiResponseForPdf] = React.useState<string | null>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Attempt to find the viewport element more robustly
      const scrollViewport = scrollAreaRef.current.querySelector('div[style*="overflow: scroll"]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      } else {
        // Fallback if the specific style selector doesn't work (e.g. Radix changes internal structure)
        const directChildViewport = scrollAreaRef.current.children[0] as HTMLElement;
        if(directChildViewport && typeof directChildViewport.scrollTop !== 'undefined') {
             directChildViewport.scrollTop = directChildViewport.scrollHeight;
        }
      }
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoadingAiResponse(true);
    setCurrentAiResponseForPdf(null); // Clear previous PDF-able response

    // Simulate AI response
    setTimeout(() => {
      const aiResponseText = `This is a mock AI response to your query about: "${newUserMessage.text}". 
      
Here are some detailed steps or information:
1. First, you need to verify the account details.
2. Then, navigate to the 'Account Actions' section.
3. Select 'Procedure X' and follow the on-screen prompts.
      
For more information, refer to document #REF123 or contact support.`;
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newAiMessage]);
      setCurrentAiResponseForPdf(aiResponseText); 
      setIsLoadingAiResponse(false);
    }, 1500);
  };

  const handleGeneratePdf = () => {
    if (!currentAiResponseForPdf) {
      toast({
        title: "No AI response available",
        description: "Please ask a question first to get instructions.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "PDF Generation Started",
      description: `Sanctuary_Procedure_Instructions.pdf is being generated with the latest AI response.`,
    });
    // Actual PDF generation logic would go here
    // For example:
    // const { jsPDF } = await import('jspdf');
    // const doc = new jsPDF();
    // doc.text(currentAiResponseForPdf, 10, 10);
    // doc.save('Sanctuary_Procedure_Instructions.pdf');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 md:p-8 flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">
        AI Resource Assistant
      </h1>
      <div className="flex-grow flex flex-col items-center justify-center">
        <PlaceholderCard
          title="Chat with Sanctuary AI"
          className="w-full max-w-3xl h-[70vh] flex flex-col bg-black/60 backdrop-blur-sm !shadow-card-float !border-none"
        >
          <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 space-y-4 rounded-t-lg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 max-w-[85%] md:max-w-[75%]",
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden animate-pulse-glow self-start">
                    <Image src="/icons/brain_icon.png" alt="AI Avatar" width={32} height={32} />
                  </div>
                )}
                {msg.sender === 'user' && (
                  <UserCircle2 className="w-8 h-8 text-muted-foreground shrink-0 self-start" />
                )}
                <div
                  className={cn(
                    "p-3 text-sm shadow-md break-words",
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-lg rounded-br-none'
                      : 'bg-muted text-foreground rounded-lg rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-60 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoadingAiResponse && (
              <div className="flex items-center gap-2 mr-auto max-w-[85%] md:max-w-[75%]">
                 <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden animate-pulse-glow self-start">
                    <Image src="/icons/brain_icon.png" alt="AI Avatar" width={32} height={32} />
                  </div>
                <div className="p-3 text-sm shadow-md bg-muted text-foreground rounded-lg rounded-bl-none">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border/30">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask anything about procedures, account actions, or platform workflows…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                disabled={isLoadingAiResponse}
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                aria-label="Send Message"
                disabled={isLoadingAiResponse || !inputValue.trim()}
              >
                {isLoadingAiResponse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </PlaceholderCard>

        {currentAiResponseForPdf && (
          <div className="mt-6 w-full max-w-3xl flex justify-center">
            <Button onClick={handleGeneratePdf} variant="outline" className="bg-black/60 backdrop-blur-sm border-primary/50 hover:bg-primary/20 text-foreground hover:text-primary-foreground shadow-white-glow-soft hover:shadow-white-glow-hover">
              <Download className="mr-2 h-4 w-4" /> Download Instructions as PDF
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
