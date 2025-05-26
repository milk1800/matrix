
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table as TableIcon, // Renamed to avoid conflict with Table component
  Smile,
  Mic,
  Trash2
} from "lucide-react";

export default function ClientPortalHomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Portal - Home</h1>
      
      <PlaceholderCard title="Create New" className="w-full max-w-4xl mx-auto"> {/* Increased max-width for contact form */}
        <Tabs defaultValue="contact" className="w-full">
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
                      <TableIcon className="h-4 w-4" />
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
            <div className="mb-6 text-center">
              <p className="text-foreground">
                Add a new Person – or – add a new 
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 mx-1">Household</Button> | 
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 mx-1">Company</Button> | 
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 ml-1">Trust</Button>
              </p>
            </div>
            <div className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label htmlFor="prefix">Prefix</Label>
                  <Select>
                    <SelectTrigger id="prefix" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary">
                      <SelectValue placeholder="Prefix" />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="mr">Mr.</SelectItem><SelectItem value="ms">Ms.</SelectItem><SelectItem value="mrs">Mrs.</SelectItem><SelectItem value="dr">Dr.</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle</Label>
                  <Input id="middleName" placeholder="Middle" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div>
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input id="suffix" placeholder="Suffix" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
              </div>

              {/* Nickname & Marital Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input id="nickname" placeholder="Nickname" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select>
                    <SelectTrigger id="maritalStatus" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Company Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="Job Title" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div>
                  <Label htmlFor="companyName">Company</Label>
                  <Input id="companyName" placeholder="Company Name" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
              </div>

              {/* Household Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="householdSelect">Household</Label>
                  <Select>
                    <SelectTrigger id="householdSelect" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary">
                      <SelectValue placeholder="Select or Create Household" />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="existing">Existing Household A</SelectItem><SelectItem value="new">Create New Household</SelectItem></SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="householdName">Household Name</Label>
                  <Input id="householdName" placeholder="Household Name (if new)" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
              </div>

              {/* Email Address Row */}
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Input type="email" placeholder="Email" className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                  <Select>
                    <SelectTrigger className="w-[120px] bg-input border-border/50 text-foreground focus:ring-primary">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="home">Home</SelectItem><SelectItem value="work">Work</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="emailPrimary" />
                    <Label htmlFor="emailPrimary" className="text-sm text-muted-foreground font-normal">Primary?</Label>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Phone Number Row */}
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Input type="tel" placeholder="Phone Number" className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                  <Input placeholder="Ext." className="w-[70px] bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                  <Select>
                    <SelectTrigger className="w-[120px] bg-input border-border/50 text-foreground focus:ring-primary">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent><SelectItem value="mobile">Mobile</SelectItem><SelectItem value="home">Home</SelectItem><SelectItem value="work">Work</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="phonePrimary" />
                    <Label htmlFor="phonePrimary" className="text-sm text-muted-foreground font-normal">Primary?</Label>
                  </div>
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="Add tags (e.g., Prospect, CPA Referral)" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
              </div>

              <div>
                <Label htmlFor="backgroundInfo">Background Information</Label>
                <Textarea id="backgroundInfo" rows={4} placeholder="Enter background details..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/20 mt-8">
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">Show Additional Fields</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Person</Button>
              </div>
            </div>
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
      
      <p className="text-muted-foreground mt-8 text-center">More content for client home page can go here.</p>
    </main>
  );
}

