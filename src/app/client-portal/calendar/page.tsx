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
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, addDays, subMonths, addMonths, startOfWeek, endOfWeek, getDay, getDate, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, setHours, setMinutes, getHours, getMinutes, isSameDay, addWeeks, subWeeks, isValid } from 'date-fns';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hoursToDisplay = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 || i === 24 ? "AM" : "PM";
  if (i === 0) return "12 AM";
  if (i === 12) return "12 PM";
  return `${hour} ${ampm}`;
});

const getMonthDays = (year: number, month: number): { day: number | null; isCurrentMonth: boolean; fullDate: Date | null }[] => {
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(new Date(year, month));
  const daysInCurrentMonth = getDaysInMonth(new Date(year, month));
  const daysArray = [];

  const firstDayOfWeekOffset = getDay(firstDayOfMonth);
  for (let i = 0; i < firstDayOfWeekOffset; i++) {
    const prevMonthDay = subDays(firstDayOfMonth, firstDayOfWeekOffset - i);
    daysArray.push({ day: getDate(prevMonthDay), isCurrentMonth: false, fullDate: prevMonthDay });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    daysArray.push({ day: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
  }

  const totalCells = Math.ceil((firstDayOfWeekOffset + daysInCurrentMonth) / 7) * 7;
  let nextMonthDayCounter = 1;
  while (daysArray.length < totalCells) {
    const nextMonthDay = addDays(lastDayOfMonth, nextMonthDayCounter++);
    daysArray.push({ day: getDate(nextMonthDay), isCurrentMonth: false, fullDate: nextMonthDay });
  }
  return daysArray;
};

const getWeekDates = (currentDate: Date): { dayName: string; dateNumber: number; fullDate: Date }[] => {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i);
    return {
      dayName: format(day, 'EEE'),
      dateNumber: getDate(day),
      fullDate: day,
    };
  });
};

export default function ClientPortalCalendarPage() {
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = React.useState(false);
  const [isQuickAddEventDialogOpen, setIsQuickAddEventDialogOpen] = React.useState(false);
  const [quickAddEventSelectedDate, setQuickAddEventSelectedDate] = React.useState<Date | null>(null);
  const [quickAddEventTitle, setQuickAddEventTitle] = React.useState('');
  const [quickAddEventAllDay, setQuickAddEventAllDay] = React.useState(false);
  const [quickAddEventStartTime, setQuickAddEventStartTime] = React.useState('09:00 AM');
  const [quickAddEventEndTime, setQuickAddEventEndTime] = React.useState('10:00 AM');

  // States for the full event dialog (for pre-filling)
  const [fullEventTitle, setFullEventTitle] = React.useState('');
  const [fullEventAllDay, setFullEventAllDay] = React.useState(false);
  const [fullEventStartDate, setFullEventStartDate] = React.useState('');
  const [fullEventStartTime, setFullEventStartTime] = React.useState('');
  const [fullEventEndDate, setFullEventEndDate] = React.useState('');
  const [fullEventEndTime, setFullEventEndTime] = React.useState('');


  const [activeView, setActiveView] = React.useState("month");
  const [currentDateForCalendar, setCurrentDateForCalendar] = React.useState(new Date());
  const [currentTimePosition, setCurrentTimePosition] = React.useState<number | null>(null);

  const currentYearForMonthView = currentDateForCalendar.getFullYear();
  const currentMonthIndexForMonthView = currentDateForCalendar.getMonth();
  const monthDays = getMonthDays(currentYearForMonthView, currentMonthIndexForMonthView);
  const weekDates = getWeekDates(currentDateForCalendar);

  React.useEffect(() => {
    if (activeView === 'week' || activeView === 'day') {
      const updateLine = () => {
        const now = new Date();
        if (activeView === 'day' && !isSameDay(now, currentDateForCalendar)) {
          setCurrentTimePosition(null);
          return;
        }
        const currentHour = getHours(now);
        const currentMinute = getMinutes(now);
        const totalMinutesInDay = 24 * 60;
        const minutesPastMidnight = currentHour * 60 + currentMinute;
        const percentageOfDay = (minutesPastMidnight / totalMinutesInDay) * 100;
        setCurrentTimePosition(percentageOfDay);
      };
      updateLine();
      const interval = setInterval(updateLine, 60000);
      return () => clearInterval(interval);
    } else {
      setCurrentTimePosition(null);
    }
  }, [activeView, currentDateForCalendar]);

  const getFormattedHeaderDate = () => {
    if (activeView === 'month') return format(currentDateForCalendar, "MMMM yyyy");
    if (activeView === 'week') {
      const start = startOfWeek(currentDateForCalendar, { weekStartsOn: 0 });
      const end = endOfWeek(currentDateForCalendar, { weekStartsOn: 0 });
      if (format(start, 'MMMM') === format(end, 'MMMM')) return `${format(start, 'MMMM d')} – ${format(end, 'd, yyyy')}`;
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }
    return format(currentDateForCalendar, "MMMM d, yyyy");
  };
  const headerDateDisplay = getFormattedHeaderDate();

  const handlePrevious = () => {
    if (activeView === 'month') setCurrentDateForCalendar(prev => subMonths(prev, 1));
    else if (activeView === 'week') setCurrentDateForCalendar(prev => subWeeks(prev, 1));
    else setCurrentDateForCalendar(prev => subDays(prev, 1));
  };

  const handleNext = () => {
    if (activeView === 'month') setCurrentDateForCalendar(prev => addMonths(prev, 1));
    else if (activeView === 'week') setCurrentDateForCalendar(prev => addWeeks(prev, 1));
    else setCurrentDateForCalendar(prev => addDays(prev, 1));
  };

  const handleToday = () => setCurrentDateForCalendar(new Date());

  const handleDayClick = (dayDate: Date | null) => {
    if (dayDate && isValid(dayDate)) {
      setQuickAddEventSelectedDate(dayDate);
      setQuickAddEventTitle('');
      setQuickAddEventAllDay(false);
      // Set default times, e.g., next hour
      const nextHour = setMinutes(setHours(new Date(), getHours(new Date()) + 1), 0);
      setQuickAddEventStartTime(format(nextHour, 'hh:mm a'));
      setQuickAddEventEndTime(format(addDays(nextHour,1), 'hh:mm a')); // Example: 1 hour duration
      setIsQuickAddEventDialogOpen(true);
    }
  };
  
  const openFullEventFormFromQuickAdd = () => {
    if (quickAddEventSelectedDate) {
      setFullEventTitle(quickAddEventTitle);
      setFullEventAllDay(quickAddEventAllDay);
      setFullEventStartDate(format(quickAddEventSelectedDate, 'MM/dd/yyyy'));
      setFullEventStartTime(quickAddEventStartTime);
      setFullEventEndDate(format(quickAddEventSelectedDate, 'MM/dd/yyyy')); // Assuming same day for quick add end date
      setFullEventEndTime(quickAddEventEndTime);
      // Potentially reset other full form fields or carry them over
    }
    setIsQuickAddEventDialogOpen(false);
    setIsAddEventDialogOpen(true);
  };


  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                  <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Import Calendar</DropdownMenuItem><DropdownMenuItem>Export Calendar</DropdownMenuItem><DropdownMenuItem>Calendar Settings</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsAddEventDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 space-y-6">
            <PlaceholderCard title="" className="p-0 bg-card/80 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" aria-label="Previous period" onClick={handlePrevious}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" aria-label="Next period" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" onClick={handleToday}>Today</Button>
                </div>
                <div className="text-lg font-semibold text-foreground">{headerDateDisplay}</div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
                  {["month", "week", "day"].map((view) => (
                    <Button key={view} variant={activeView === view ? "default" : "ghost"} size="sm"
                      className={`px-3 py-1 h-auto text-xs capitalize ${activeView === view ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/80'}`}
                      onClick={() => setActiveView(view)}>{view}</Button>
                  ))}
                </div>
              </div>
            </PlaceholderCard>

            <PlaceholderCard title="" className="p-0 bg-card/80 backdrop-blur-sm">
              {activeView === 'month' && (
                <div className="grid grid-cols-7 gap-px border-l border-t border-border/30 bg-border/30">
                  {daysOfWeek.map((day) => ( <div key={day} className="py-2 px-1 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b border-border/30">{day}</div> ))}
                  {monthDays.map((dayObj, index) => (
                    <div key={index}
                      className={cn("h-24 sm:h-28 md:h-32 p-1.5 text-xs bg-card border-r border-b border-border/30 overflow-hidden relative cursor-pointer hover:bg-muted/20",
                        dayObj.isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                        dayObj.fullDate && isToday(dayObj.fullDate) && dayObj.isCurrentMonth && "bg-primary/10"
                      )}
                      onClick={() => dayObj.fullDate && dayObj.isCurrentMonth && handleDayClick(dayObj.fullDate)}
                    >
                      {dayObj.day && ( <span className={cn("absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full", dayObj.fullDate && isToday(dayObj.fullDate) && dayObj.isCurrentMonth ? "bg-primary text-primary-foreground font-semibold" : "")}>{dayObj.day}</span> )}
                      {dayObj.isCurrentMonth && dayObj.day === 10 && ( <div className="mt-5 text-[10px] bg-purple-500/70 text-white p-1 rounded truncate">Client Meeting</div> )}
                      {dayObj.isCurrentMonth && dayObj.day === 22 && ( <div className="mt-5 text-[10px] bg-green-500/70 text-white p-1 rounded truncate">Follow Up Call</div> )}
                    </div>
                  ))}
                </div>
              )}
              {activeView === 'week' && ( /* Week View JSX */ )}
              {activeView === 'day' && ( /* Day View JSX */ )}
            </PlaceholderCard>
          </div>
          <aside className="lg:w-72 xl:w-80 space-y-6 shrink-0">{/* Sidebar Filters JSX */}</aside>
        </div>
      </main>

      {/* Quick Add Event Dialog */}
      <Dialog open={isQuickAddEventDialogOpen} onOpenChange={setIsQuickAddEventDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Quick Add Event</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="quickEventTitle" className="text-right text-muted-foreground">Title</Label>
              <Input id="quickEventTitle" value={quickAddEventTitle} onChange={(e) => setQuickAddEventTitle(e.target.value)} className="col-span-2 bg-input border-border/50" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span /> {/* Spacer for alignment */}
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox id="quickAllDayEvent" checked={quickAddEventAllDay} onCheckedChange={(checked) => setQuickAddEventAllDay(!!checked)} />
                <Label htmlFor="quickAllDayEvent" className="font-normal text-muted-foreground">All day?</Label>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right text-muted-foreground">Date</Label>
              <p className="col-span-2 text-foreground">{quickAddEventSelectedDate ? format(quickAddEventSelectedDate, 'MMMM d, yyyy') : 'N/A'}</p>
            </div>
            {!quickAddEventAllDay && (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="quickStartTime" className="text-right text-muted-foreground">Start Time</Label>
                  <Input id="quickStartTime" type="text" placeholder="e.g., 09:00 AM" value={quickAddEventStartTime} onChange={(e) => setQuickAddEventStartTime(e.target.value)} className="col-span-2 bg-input border-border/50" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="quickEndTime" className="text-right text-muted-foreground">End Time</Label>
                  <Input id="quickEndTime" type="text" placeholder="e.g., 10:00 AM" value={quickAddEventEndTime} onChange={(e) => setQuickAddEventEndTime(e.target.value)} className="col-span-2 bg-input border-border/50" />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="justify-between sm:justify-between">
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80" onClick={openFullEventFormFromQuickAdd}>
              Include more details?
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => {/* Mock save */ setIsQuickAddEventDialogOpen(false); }}>Add Event</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Event Dialog (existing) */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col bg-card/95 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">New Event</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2 py-4 space-y-6">
            <div><Label htmlFor="eventName-dialog">Event Name</Label><Input id="eventName-dialog" value={fullEventTitle} onChange={(e) => setFullEventTitle(e.target.value)} placeholder="Enter event name..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            <div><Label htmlFor="eventCategory-dialog">Category</Label><div className="flex items-center gap-2"><Select><SelectTrigger id="eventCategory-dialog" className="bg-input border-border/50 text-foreground focus:ring-primary flex-grow"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="client_meeting">Client Meeting</SelectItem><SelectItem value="internal_meeting">Internal Meeting</SelectItem><SelectItem value="conference_call">Conference Call</SelectItem><SelectItem value="webinar">Webinar</SelectItem><SelectItem value="personal">Personal</SelectItem></SelectContent></Select><Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 whitespace-nowrap">Edit Categories</Button></div></div>
            <div className="space-y-3"><Label>Date & Time</Label><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2 items-center">
              <div className="md:col-span-2"><Input type="text" placeholder="Start Date" value={fullEventStartDate} onChange={(e) => setFullEventStartDate(e.target.value)} aria-label="Start Date" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
              <div className="sm:col-span-1"><Input type="text" placeholder="Start Time" value={fullEventStartTime} onChange={(e) => setFullEventStartTime(e.target.value)} aria-label="Start Time" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
              <div className="text-center text-muted-foreground hidden md:block">to</div>
              <div className="md:col-span-2"><Input type="text" placeholder="End Date" value={fullEventEndDate} onChange={(e) => setFullEventEndDate(e.target.value)} aria-label="End Date" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
              <div className="sm:col-span-1"><Input type="text" placeholder="End Time" value={fullEventEndTime} onChange={(e) => setFullEventEndTime(e.target.value)} aria-label="End Time" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            </div></div>
            <div className="flex items-center justify-between sm:justify-start space-x-6">
              <div className="flex items-center space-x-2"><Checkbox id="allDayEvent-dialog" checked={fullEventAllDay} onCheckedChange={(checked) => setFullEventAllDay(!!checked)} /><Label htmlFor="allDayEvent-dialog" className="font-normal text-muted-foreground">All day?</Label></div>
              <div className="flex items-center space-x-2"><Checkbox id="repeatsEvent-dialog" /><Label htmlFor="repeatsEvent-dialog" className="font-normal text-muted-foreground">Repeats?</Label></div>
            </div>
            <div><Label htmlFor="eventStatus-dialog">Status</Label><Select><SelectTrigger id="eventStatus-dialog" className="bg-input border-border/50 text-foreground focus:ring-primary"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="busy">Busy</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="tentative">Tentative</SelectItem><SelectItem value="out_of_office">Out of Office</SelectItem></SelectContent></Select></div>
            <div><Label htmlFor="eventLocation-dialog">Location</Label><Input id="eventLocation-dialog" placeholder="Enter location (e.g., Zoom, Office, Conference Room A)" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            <div><Label htmlFor="eventDescription-dialog">Description</Label><Textarea id="eventDescription-dialog" rows={5} placeholder="Add event details, agenda, notes..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary resize-none" /><div className="flex items-center space-x-1 text-muted-foreground mt-2"><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bold"><Bold className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Italic"><Italic className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Underline"><Underline className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Bulleted List"><ListChecks className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Numbered List"><ListOrdered className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Table"><TableIcon className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Link"><Link2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Insert Emoji"><Smile className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="hover:bg-muted/50 h-8 w-8" aria-label="Voice Note"><Mic className="h-4 w-4" /></Button></div></div>
            <div><Label htmlFor="eventRelatedTo-dialog">Related To</Label><Input id="eventRelatedTo-dialog" placeholder="Contact, project, or opportunity..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            <div><Label htmlFor="eventAttending-dialog">Attending</Label><Input id="eventAttending-dialog" placeholder="Search users or resources..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            <div><Label htmlFor="eventInvite-dialog">Invite</Label><Input id="eventInvite-dialog" placeholder="Search contacts to invite..." className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" /></div>
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center space-x-2"><Checkbox id="sendEventInvitations-dialog" /><Label htmlFor="sendEventInvitations-dialog" className="text-sm font-normal text-muted-foreground">Send email invitations to new invitees and BCC the event creator</Label></div><Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm whitespace-nowrap">Preview Invite</Button></div>
          </div>
          <DialogFooter className="pt-4 border-t border-border/30">
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
