
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ListChecks, Filter as FilterIcon, UserCircle, Tag } from 'lucide-react'; // Added FilterIcon, UserCircle, Tag for dropdowns

export default function ClientPortalTasksPage() {
  // Mock data for filter counts, can be dynamic later
  const taskCount = 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <span className="text-muted-foreground">({taskCount} tasks)</span>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Manage Task Types</DropdownMenuItem>
              <DropdownMenuItem>Archived Tasks</DropdownMenuItem>
              <DropdownMenuItem>Export Tasks</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <ListChecks className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Select defaultValue="upcoming">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all_tasks">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_tasks">All Tasks</SelectItem>
            <SelectItem value="calls">Calls</SelectItem>
            <SelectItem value="emails">Emails</SelectItem>
            <SelectItem value="meetings">Meetings</SelectItem>
            <SelectItem value="follow_ups">Follow-ups</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="current_user">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
             <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Assigned to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_user">Josh Bajorek (Me)</SelectItem>
            <SelectItem value="user_a">User A</SelectItem>
            <SelectItem value="user_b">User B</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all_categories">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="In category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_categories">All Categories</SelectItem>
            <SelectItem value="category_1">Client Review</SelectItem>
            <SelectItem value="category_2">Prospecting</SelectItem>
            <SelectItem value="category_3">Compliance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Card - Task List Area */}
      <PlaceholderCard title="" className="flex-grow p-0"> {/* No card title for the main content area, similar to contacts */}
         <div className="flex flex-col items-center justify-center h-[40vh] text-center p-6">
            <ListChecks className="w-20 h-20 text-muted-foreground/50 mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No tasks match the selected criteria.</h3>
            <p className="text-muted-foreground">Try adjusting your filters or adding a new task.</p>
        </div>
      </PlaceholderCard>
    </main>
  );
}
