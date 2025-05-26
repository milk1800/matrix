
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { File as FileIcon, Paperclip, ChevronDown } from 'lucide-react';

export default function ClientPortalFilesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Files</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Paperclip className="mr-2 h-4 w-4" />
          Attach File
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Tabs and Main Content Area */}
      <Tabs defaultValue="cloud_services" className="w-full">
        <TabsList className="bg-muted/30 mb-6">
          <TabsTrigger value="cloud_services" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:underline">
            Cloud Services
          </TabsTrigger>
          <TabsTrigger value="wealthbox_cloud" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:underline">
            Wealthbox Cloud
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cloud_services">
           <PlaceholderCard title="Cloud Services" className="flex-grow p-0 min-h-[50vh] md:min-h-[60vh]">
             <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <FileIcon className="w-20 h-20 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-foreground mb-2">To get started, attach a file.</h3>
             </div>
           </PlaceholderCard>
        </TabsContent>
        <TabsContent value="wealthbox_cloud">
           <PlaceholderCard title="Wealthbox Cloud" className="flex-grow p-0 min-h-[50vh] md:min-h-[60vh]">
             <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <FileIcon className="w-20 h-20 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-foreground mb-2">Wealthbox Cloud storage appears here.</h3>
             </div>
           </PlaceholderCard>
        </TabsContent>
      </Tabs>
    </main>
  );
}
