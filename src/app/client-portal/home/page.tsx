
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  UserPlus,
  ListChecks,
  CalendarPlus,
  DollarSign,
  Bold,
  Italic,
  Underline,
  Link2,
  Table,
  Smile,
  Mic
} from "lucide-react";

export default function ClientPortalHomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Portal - Home</h1>
      
      <PlaceholderCard title="Create New" className="w-full max-w-2xl mx-auto">
        <Tabs defaultValue="update" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/30">
            <TabsTrigger value="update" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <MessageSquare className="mr-2 h-4 w-4" /> Update
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <UserPlus className="mr-2 h-4 w-4" /> Contact
            </TabsTrigger>
            <TabsTrigger value="task" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <ListChecks className="mr-2 h-4 w-4" /> Task
            </TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <CalendarPlus className="mr-2 h-4 w-4" /> Event
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <DollarSign className="mr-2 h-4 w-4" /> Opportunity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="update" className="mt-6">
            <div className="flex space-x-4">
              <div>
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="profile avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Share an update..."
                  rows={6}
                  className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bulleted List">
                      <ListChecks className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Link">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Table">
                      <Table className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Emoji">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Voice Note">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">Post</Button>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Tag contacts... (e.g., @Client Name or type to search)"
                    className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary text-sm h-9"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="contact" className="mt-6">
            <p className="text-muted-foreground p-4 text-center">Contact creation form will go here.</p>
          </TabsContent>
          <TabsContent value="task" className="mt-6">
            <p className="text-muted-foreground p-4 text-center">Task creation form will go here.</p>
          </TabsContent>
          <TabsContent value="event" className="mt-6">
            <p className="text-muted-foreground p-4 text-center">Event creation form will go here.</p>
          </TabsContent>
          <TabsContent value="opportunity" className="mt-6">
            <p className="text-muted-foreground p-4 text-center">Opportunity creation form will go here.</p>
          </TabsContent>
        </Tabs>
      </PlaceholderCard>
      <p className="text-muted-foreground mt-8">More content for client home page can go here.</p>
    </main>
  );
}
