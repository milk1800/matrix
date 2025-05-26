
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { 
  Filter, 
  UserCircle, 
  PlayCircle, 
  PlusCircle, 
  Cog,
  Bold,
  Italic,
  Underline,
  ListChecks,
  ListOrdered,
  Link2,
  Table as TableIcon,
  Smile,
  Mic
} from 'lucide-react';

export default function ClientPortalWorkflowsPage() {
  const [isAddTemplateDialogOpen, setIsAddTemplateDialogOpen] = React.useState(false);

  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Workflows</h1>
          <div className="flex items-center gap-2">
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
              <Cog className="mr-2 h-4 w-4" /> Manage Templates
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlayCircle className="mr-2 h-4 w-4" /> Start Workflow
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
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              onClick={() => setIsAddTemplateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </div>
        </PlaceholderCard>
      </main>

      <Dialog open={isAddTemplateDialogOpen} onOpenChange={setIsAddTemplateDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col bg-card/95 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Add a Workflow Template</DialogTitle>
            {/* The "X" (cancel) button is automatically added by DialogContent */}
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2 py-4 space-y-6">
            <div>
              <Label htmlFor="workflowName-dialog">Workflow Name <span className="text-destructive">*</span></Label>
              <Input id="workflowName-dialog" placeholder="Enter workflow name..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            
            <div>
              <Label htmlFor="sequential-dialog">Sequential?</Label>
              <RadioGroup defaultValue="yes" id="sequential-dialog" className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="seq-yes" />
                  <Label htmlFor="seq-yes" className="font-normal text-muted-foreground">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="seq-no" />
                  <Label htmlFor="seq-no" className="font-normal text-muted-foreground">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="workflowFor-dialog">Workflow For</Label>
              <Select defaultValue="contact">
                <SelectTrigger id="workflowFor-dialog" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="service_request">Service Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workflowDescription-dialog">Description</Label>
              <Textarea id="workflowDescription-dialog" rows={4} placeholder="Add a description for this workflow..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary resize-none" />
              <div className="flex items-center space-x-1 text-muted-foreground mt-2">
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bold"><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Italic"><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Underline"><Underline className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bulleted List"><ListChecks className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Numbered List"><ListOrdered className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Link"><Link2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Emoji"><Smile className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <Label className="text-base font-semibold text-foreground">STEPS</Label>
              <div className="mt-2">
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                </Button>
                {/* Placeholder for where steps would be listed */}
                <p className="text-sm text-muted-foreground mt-2 italic">No steps added yet.</p>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-border/30 flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <Checkbox id="published-dialog" defaultChecked />
              <Label htmlFor="published-dialog" className="font-normal text-muted-foreground">Published?</Label>
            </div>
            <div className="space-x-2">
              <DialogClose asChild>
                 {/* The "X" in DialogContent handles cancel/close. Can add an explicit cancel button here if preferred */}
                 <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Template</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
