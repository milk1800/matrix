
"use client";

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  UserCircle2,
  Phone,
  Mail,
  PlusCircle,
  MessageSquare,
  ListChecks,
  CalendarPlus,
  Briefcase,
  Users,
  FileText,
  StickyNote,
  MoreHorizontal,
  Tag,
  Send
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { ActivityFeed, type ActivityCardProps } from "@/components/dashboard/ActivityFeed";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mock data - replace with actual data fetching
const mockContactData: Record<string, any> = {
  '1': { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '555-123-4567', relationship: 'Client', avatarUrl: 'https://placehold.co/100x100.png', tags: ['VIP', 'Referred by Jane'] },
  '2': { id: '2', name: 'Jane Doe', email: 'jane.doe@email.com', phone: '555-987-6543', relationship: 'Prospect', avatarUrl: 'https://placehold.co/100x100.png', tags: ['New Lead'] },
  // Add more mock contacts as needed
};

const mockActivityFeed: ActivityCardProps[] = [
  { id: 'act1', type: 'contact', summary: 'Contact created by Josh Bajorek.', user: 'Josh Bajorek', timestamp: '3 days ago', tags: ['System Event'] },
  { id: 'act2', type: 'note', summary: 'Discussed Q4 investment strategy and risk tolerance. Client is considering a more conservative approach for the next 6 months due to market volatility.', user: 'Sarah Miller', timestamp: '2 days ago', details: 'Follow-up task created.' },
  { id: 'act3', type: 'task', summary: 'Task "Prepare Q4 Performance Report" completed by Maven AI.', user: 'Maven AI', userAvatar: '/icons/brain-logo.png', timestamp: '1 day ago' },
  { id: 'act4', type: 'email', summary: 'Sent email: "Q4 Portfolio Update and Meeting Request"', user: 'Josh Bajorek', timestamp: '1 day ago', details: 'Opened by client.' },
  { id: 'act5', type: 'opportunity', summary: 'Opportunity "Retirement Planning - Phase 2" moved to "Proposal Sent".', user: 'Sarah Miller', timestamp: '5 hours ago', stageChange: 'Needs Analysis to Proposal Sent' },
];


export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.contactId as string;
  const [contact, setContact] = React.useState<any | null>(null);
  const [noteText, setNoteText] = React.useState('');

  React.useEffect(() => {
    // Simulate fetching contact data
    if (contactId) {
      const data = mockContactData[contactId] || { id: contactId, name: `Contact ${contactId}`, email: 'N/A', phone: 'N/A', relationship: 'Unknown', avatarUrl: 'https://placehold.co/100x100.png', tags: [] };
      setContact(data);
    }
  }, [contactId]);

  if (!contact) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading contact details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] p-6 md:p-8 space-y-6">
      {/* Contact Header */}
      <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person" />
              <AvatarFallback className="bg-muted text-xl">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contact.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{contact.relationship}</Badge>
                {contact.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-primary">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>{contact.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Tabs Row */}
      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/30">
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="note" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <MessageSquare className="mr-2 h-4 w-4" /> Note
            </TabsTrigger>
            <TabsTrigger value="task" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <ListChecks className="mr-2 h-4 w-4" /> Task
            </TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <CalendarPlus className="mr-2 h-4 w-4" /> Event
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
               <Briefcase className="mr-2 h-4 w-4" /> Opportunity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="note" className="mt-4">
            <div className="space-y-3">
              <Textarea
                placeholder={`Add a note for ${contact.name}...`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[100px] bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary rounded-md"
                rows={4}
              />
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" /> Post Note
                </Button>
              </div>
            </div>
          </TabsContent>
          {/* Other tab contents would go here */}
           <TabsContent value="task"><p className="text-muted-foreground text-center p-4">Task creation form will appear here.</p></TabsContent>
           <TabsContent value="event"><p className="text-muted-foreground text-center p-4">Event creation form will appear here.</p></TabsContent>
           <TabsContent value="opportunity"><p className="text-muted-foreground text-center p-4">Opportunity creation form will appear here.</p></TabsContent>
        </Tabs>
      </div>

      {/* Activity Feed Section */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/30 min-h-[400px]">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="border-b border-border/30 rounded-t-xl rounded-b-none px-4 bg-muted/30 justify-start">
            <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Activity</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Email</TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Accounts</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Files</TabsTrigger>
            <TabsTrigger value="additional_info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="p-0">
            <ActivityFeed activities={mockActivityFeed} />
          </TabsContent>
          <TabsContent value="email"><p className="text-muted-foreground text-center p-8">Email history will appear here.</p></TabsContent>
          <TabsContent value="accounts"><p className="text-muted-foreground text-center p-8">Related accounts will appear here.</p></TabsContent>
          <TabsContent value="files"><p className="text-muted-foreground text-center p-8">Files related to this contact will appear here.</p></TabsContent>
          <TabsContent value="additional_info"><p className="text-muted-foreground text-center p-8">Additional contact information will appear here.</p></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


    