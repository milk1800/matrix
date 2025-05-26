
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  FileSearch2, 
  Users, 
  StickyNote, 
  ListChecks, 
  DollarSign as OpportunityIcon, // Renamed to avoid conflict
  Workflow, 
  KanbanSquare, 
  StepForward, 
  FileText, 
  CalendarDays, 
  Landmark 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SampleReport {
  id: string;
  name: string;
}

const sampleReportsData: SampleReport[] = [
  { id: 'sr1', name: 'Q3 Performance Overview' },
  { id: 'sr2', name: 'Client Activity Log - Last 30 Days' },
  { id: 'sr3', name: 'Top Traded Securities YTD' },
  { id: 'sr4', name: 'Household AUM Summary' },
  { id: 'sr5', name: 'Fee Billing Statement - August' },
  { id: 'sr6', name: 'Compliance Alert Summary' },
  { id: 'sr7', name: 'Upcoming RMD Report' },
];

interface ReportCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  iconClassName: string;
}

const reportCategories: ReportCategory[] = [
  { id: 'contact', title: 'Contact Reports', icon: Users, iconClassName: 'text-blue-400' },
  { id: 'note', title: 'Note Reports', icon: StickyNote, iconClassName: 'text-yellow-400' },
  { id: 'task', title: 'Task Reports', icon: ListChecks, iconClassName: 'text-orange-400' },
  { id: 'opportunity', title: 'Opportunity Reports', icon: OpportunityIcon, iconClassName: 'text-green-400' },
  { id: 'workflow', title: 'Workflow Reports', icon: Workflow, iconClassName: 'text-orange-400' },
  { id: 'project', title: 'Project Reports', icon: KanbanSquare, iconClassName: 'text-lime-400' },
  { id: 'workflow_step', title: 'Workflow Step Reports', icon: StepForward, iconClassName: 'text-blue-600' },
  { id: 'file', title: 'File Reports', icon: FileText, iconClassName: 'text-gray-400' },
  { id: 'event', title: 'Event Reports', icon: CalendarDays, iconClassName: 'text-red-400' },
  { id: 'investment_account', title: 'Investment Account Reports', icon: Landmark, iconClassName: 'text-purple-400' },
];

export default function ClientPortalReportsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaceholderCard 
          title="Sample Reports" 
          icon={FileSearch2} 
          iconClassName="text-purple-400"
          className="md:col-span-1 lg:col-span-1"
        >
          <ul className="space-y-3 mt-2">
            {sampleReportsData.map((report) => (
              <li key={report.id} className="flex justify-between items-center text-sm py-1.5 border-b border-border/20 last:border-b-0">
                <span className="text-foreground truncate">{report.name}</span>
                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 text-xs">View</Button>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 text-xs">Customize</Button>
                </div>
              </li>
            ))}
          </ul>
        </PlaceholderCard>

        {reportCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <PlaceholderCard 
              key={category.id} 
              title={category.title}
              icon={() => <IconComponent className={cn("h-5 w-5 shrink-0", category.iconClassName)} />}
            >
              <div className="flex flex-col items-center justify-center h-full text-center p-4 min-h-[100px]">
                <p className="text-sm italic text-muted-foreground">No Reports Found</p>
              </div>
            </PlaceholderCard>
          );
        })}
      </div>
    </main>
  );
}
