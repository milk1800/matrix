
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarDays,
  MoreHorizontal,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Bold,
  Italic,
  Underline,
  ListChecks,
  ListOrdered,
  Link2,
  Table as TableIcon,
  Smile,
  Mic,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Mock days for a 5-week month display
const getMonthDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  const firstDayOffset = date.getDay(); // 0 (Sun) to 6 (Sat)

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOffset; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Add empty cells to fill up the last week (total 35 cells for 5 weeks or 42 for 6 weeks)
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  while (days.length < totalCells) {
    days.push({ day: null, isCurrentMonth: false });
  }
  return days;
};

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth(); // 0 for January, 11 for December
const todayDate = new Date().getDate();

const monthDays = getMonthDays(currentYear, currentMonthIndex);
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


export default function ClientPortalCalendarPage() {
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = React.useState(false);
  const [activeView, setActiveView] = React.useState("month"); // 'month', 'week', 'day'

  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Import Calendar</DropdownMenuItem>
                <DropdownMenuItem>Export Calendar</DropdownMenuItem>
                <DropdownMenuItem>Calendar Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsAddEventDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Calendar Area */}
          <div className="flex-1 space-y-6">
            {/* Calendar Controls */}
            <PlaceholderCard title="" className="p-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">Today</Button>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {monthNames[currentMonthIndex]} {currentYear}
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
                  {["month", "week", "day"].map((view) => (
                    <Button
                      key={view}
                      variant={activeView === view ? "default" : "ghost"}
                      size="sm"
                      className={`px-3 py-1 h-auto text-xs capitalize ${activeView === view ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/80'}`}
                      onClick={() => setActiveView(view)}
                    >
                      {view}
                    </Button>
                  ))}
                </div>
              </div>
            </PlaceholderCard>

            {/* Calendar Grid */}
            <PlaceholderCard title="" className="p-0">
              <div className="grid grid-cols-7 gap-px border-l border-t border-border/30 bg-border/30">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2 px-1 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b border-border/30">
                    {day}
                  </div>
                ))}
                {monthDays.map((dayObj, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-24 sm:h-28 md:h-32 p-1.5 text-xs bg-card border-r border-b border-border/30 overflow-hidden relative",
                      dayObj.isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                      dayObj.isCurrentMonth && dayObj.day === todayDate && "bg-primary/10"
                    )}
                  >
                    {dayObj.day && (
                      <span className={cn(
                        "absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full",
                        dayObj.isCurrentMonth && dayObj.day === todayDate ? "bg-primary text-primary-foreground font-semibold" : ""
                      )}>
                        {dayObj.day}
                      </span>
                    )}
                    {/* Placeholder for events */}
                    {dayObj.isCurrentMonth && dayObj.day === 10 && (
                      <div className="mt-5 text-xs bg-purple-500/70 text-white p-1 rounded truncate">Client Meeting</div>
                    )}
                     {dayObj.isCurrentMonth && dayObj.day === 22 && (
                      <div className="mt-5 text-xs bg-green-500/70 text-white p-1 rounded truncate">Follow Up Call</div>
                    )}
                  </div>
                ))}
              </div>
            </PlaceholderCard>
          </div>

          {/* Right Sidebar Filters */}
          <aside className="lg:w-72 xl:w-80 space-y-6 shrink-0">
            <PlaceholderCard title="" className="p-0">
              <Tabs defaultValue="calendars" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                  <TabsTrigger value="calendars" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Calendars</TabsTrigger>
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="calendars" className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">USERS</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2"><Checkbox id="user-all" /><Label htmlFor="user-all" className="font-normal text-foreground">Select All</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="user-josh" defaultChecked /><Label htmlFor="user-josh" className="font-normal text-foreground">Josh Bajorek</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="user-team" /><Label htmlFor="user-team" className="font-normal text-foreground">Team Calendar</Label></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">EVENT CATEGORIES</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2"><Checkbox id="cat-all" /><Label htmlFor="cat-all" className="font-normal text-foreground">Select All</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-uncategorized" defaultChecked /><Label htmlFor="cat-uncategorized" className="font-normal text-foreground">Uncategorized</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-meeting" defaultChecked /><Label htmlFor="cat-meeting" className="font-normal text-foreground">Meeting</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-client-review" /><Label htmlFor="cat-client-review" className="font-normal text-foreground">Client Review</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-prospect" /><Label htmlFor="cat-prospect" className="font-normal text-foreground">Prospect Introduction</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-social" /><Label htmlFor="cat-social" className="font-normal text-foreground">Social Event</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="cat-conference" /><Label htmlFor="cat-conference" className="font-normal text-foreground">Conference</Label></div>
                    </div>
                  </div>
                   <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">OTHER CALENDARS</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2"><Checkbox id="other-special" defaultChecked /><Label htmlFor="other-special" className="font-normal text-foreground">Special Dates</Label></div>
                      <div className="flex items-center space-x-2"><Checkbox id="other-holidays" defaultChecked /><Label htmlFor="other-holidays" className="font-normal text-foreground">US Holidays</Label></div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tasks" className="p-4">
                  <p className="text-muted-foreground text-sm">Task filters will go here.</p>
                </TabsContent>
              </Tabs>
            </PlaceholderCard>
          </aside>
        </div>
      </main>

      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">New Event</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2 py-4 space-y-6">
            {/* Event Form Fields (Copied from Client Portal Home's Event Tab) */}
            <div>
              <Label htmlFor="eventName-dialog">Event Name</Label>
              <Input id="eventName-dialog" placeholder="Enter event name..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="eventCategory-dialog">Category</Label>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger id="eventCategory-dialog" className="bg-input border-border/50 text-foreground focus:ring-primary flex-grow">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client_meeting">Client Meeting</SelectItem>
                    <SelectItem value="internal_meeting">Internal Meeting</SelectItem>
                    <SelectItem value="conference_call">Conference Call</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 whitespace-nowrap">Edit Categories</Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Date & Time</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 items-center">
                <div className="md:col-span-2">
                  <Input type="text" placeholder="Start Date" aria-label="Start Date" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div className="sm:col-span-1">
                  <Input type="text" placeholder="Start Time" aria-label="Start Time" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div className="text-center text-muted-foreground hidden md:block">to</div>
                <div className="md:col-span-2">
                  <Input type="text" placeholder="End Date" aria-label="End Date" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
                <div className="sm:col-span-1">
                  <Input type="text" placeholder="End Time" aria-label="End Time" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-start space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="allDayEvent-dialog" />
                <Label htmlFor="allDayEvent-dialog" className="font-normal text-muted-foreground">All day?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="repeatsEvent-dialog" />
                <Label htmlFor="repeatsEvent-dialog" className="font-normal text-muted-foreground">Repeats?</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="eventStatus-dialog">Status</Label>
              <Select>
                <SelectTrigger id="eventStatus-dialog" className="bg-input border-border/50 text-foreground focus:ring-primary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="tentative">Tentative</SelectItem>
                  <SelectItem value="out_of_office">Out of Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventLocation-dialog">Location</Label>
              <Input id="eventLocation-dialog" placeholder="Enter location (e.g., Zoom, Office, Conference Room A)" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="eventDescription-dialog">Description</Label>
              <Textarea id="eventDescription-dialog" rows={5} placeholder="Add event details, agenda, notes..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary resize-none" />
              <div className="flex items-center space-x-1 text-muted-foreground mt-2">
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bold"><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Italic"><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Underline"><Underline className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bulleted List"><ListChecks className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Numbered List"><ListOrdered className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Table"><TableIcon className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Link"><Link2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Emoji"><Smile className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Voice Note"><Mic className="h-4 w-4" /></Button>
              </div>
            </div>
            <div>
              <Label htmlFor="eventRelatedTo-dialog">Related To</Label>
              <Input id="eventRelatedTo-dialog" placeholder="Contact, project, or opportunity..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="eventAttending-dialog">Attending</Label>
              <Input id="eventAttending-dialog" placeholder="Search users or resources..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="eventInvite-dialog">Invite</Label>
              <Input id="eventInvite-dialog" placeholder="Search contacts to invite..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="sendEventInvitations-dialog" />
                <Label htmlFor="sendEventInvitations-dialog" className="font-normal text-muted-foreground text-sm">
                  Send email invitations to new invitees and BCC the event creator
                </Label>
              </div>
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm whitespace-nowrap">Preview Invite</Button>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-border/30">
             <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


    