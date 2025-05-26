
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, UserCircle, PlayCircle, PlusCircle, Cog } from 'lucide-react';

export default function ClientPortalWorkflowsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workflows</h1>
        <div className="flex items-center gap-2">
          <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
            <Cog className="mr-2 h-4 w-4" /> Manage Templates
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Start Workflow
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Select defaultValue="active">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filtering by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="all_statuses">All Statuses</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all_workflows">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <PlayCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="For workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_workflows">All Workflows</SelectItem>
            <SelectItem value="onboarding">Client Onboarding</SelectItem>
            <SelectItem value="review_prep">Annual Review Prep</SelectItem>
            <SelectItem value="rmd_processing">RMD Processing</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all_users">
          <SelectTrigger className="w-full bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
            <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Assigned to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_users">All Users</SelectItem>
            <SelectItem value="josh_b">Josh Bajorek</SelectItem>
            <SelectItem value="user_b">User B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Card Area */}
      <PlaceholderCard title="" className="flex-grow p-0">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
          <PlayCircle className="w-20 h-20 text-primary/70 mb-6" strokeWidth={1.5} />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            To get started with workflows, add a template.
          </h3>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Template
          </Button>
        </div>
      </PlaceholderCard>
    </main>
  );
}
