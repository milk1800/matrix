
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { MoreHorizontal, PlusCircle, KanbanSquare as ProjectsIcon } from 'lucide-react'; // Using KanbanSquare for Projects

export default function ClientPortalProjectsPage() {
  const [activeSort, setActiveSort] = React.useState("Recent");

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Manage Project Types</DropdownMenuItem>
              <DropdownMenuItem>Import Projects</DropdownMenuItem>
              <DropdownMenuItem>Export Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      {/* Tabs and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Tabs defaultValue="active" className="w-full sm:w-auto">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Active
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-blue-400 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Order:</span>
          {["Recent", "A-Z", "Z-A"].map((sort) => (
            <Button
              key={sort}
              variant={activeSort === sort ? "default" : "ghost"}
              size="sm"
              className={`px-2 py-1 h-auto text-xs ${activeSort === sort ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/50'}`}
              onClick={() => setActiveSort(sort)}
            >
              {sort}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area - Active Tab */}
      <Tabs defaultValue="active" className="w-full">
        <TabsContent value="active">
           <PlaceholderCard title="" className="flex-grow p-0 min-h-[40vh] md:min-h-[50vh]">
             <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ProjectsIcon className="w-20 h-20 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-foreground mb-2">To get started, add a project.</h3>
             </div>
           </PlaceholderCard>
        </TabsContent>
        <TabsContent value="archived">
           <PlaceholderCard title="" className="flex-grow p-0 min-h-[40vh] md:min-h-[50vh]">
             <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ProjectsIcon className="w-20 h-20 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No archived projects found.</h3>
             </div>
           </PlaceholderCard>
        </TabsContent>
      </Tabs>
    </main>
  );
}
