
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
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
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
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 md:p-8 flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">
        AI Resource Assistant
      </h1>
      <div className="flex-grow flex flex-col items-center justify-center">
        <PlaceholderCard
          title="" // Title removed to give full space to chat UI
          className="w-full max-w-3xl h-[70vh] flex flex-col bg-black/50 backdrop-blur-md shadow-xl rounded-xl border border-white/10 p-0" // Customized styling
        >
          {/* CardHeader is not used here to allow ScrollArea to take full height minus footer */}
          <ScrollArea className="flex-grow rounded-t-xl" viewportRef={scrollViewportRef}>
            <div className="p-4 space-y-4">
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
                      <Image src="/icons/brain-logo.png" alt="AI Avatar" width={32} height={32} />
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
                        : 'bg-muted/80 text-foreground rounded-lg rounded-bl-none' // AI bubble with increased opacity
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
                      <Image src="/icons/brain-logo.png" alt="AI Avatar" width={32} height={32} />
                    </div>
                  <div className="p-3 text-sm shadow-md bg-muted/80 text-foreground rounded-lg rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-white/10"> {/* Input area */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask anything about procedures, account actions, or platform workflows…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-black/70 text-foreground placeholder:text-muted-foreground/80 focus:ring-primary border-transparent ring-1 ring-white/10 focus:ring-2"
                disabled={isLoadingAiResponse}
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/80 text-primary-foreground p-3 rounded-lg"
                aria-label="Send Message"
                disabled={isLoadingAiResponse || !inputValue.trim()}
              >
                {isLoadingAiResponse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </PlaceholderCard>

        {currentAiResponseForPdf && (
          <div className="mt-6 w-full max-w-3xl flex justify-center">
            <Button 
              onClick={handleGeneratePdf} 
              variant="outline" 
              className="bg-black/50 backdrop-blur-md border-white/10 hover:bg-white/20 text-foreground shadow-md hover:shadow-lg rounded-lg"
            >
              <Download className="mr-2 h-4 w-4" /> Download Instructions as PDF
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
