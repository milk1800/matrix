
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  PlusCircle,
  DollarSign,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface OpportunityItem {
  id: string;
  title: string;
  contactName: string;
  amountDisplay: string; // e.g., "$500 (Fee)"
  probability: number; // e.g., 75 for 75%
  targetCloseDate: string; // e.g., "Jul 24, 2025"
  stage: string; // To match column id
}

interface PipelineColumn {
  id: string;
  title: string;
  opportunities: OpportunityItem[];
}

const initialPipelineData: PipelineColumn[] = [
  {
    id: 'evaluation',
    title: 'Evaluation',
    opportunities: [
      { id: 'opp1', title: 'Initial Consult - ACME Corp', contactName: 'John Smith', amountDisplay: '$1,500 (Project)', probability: 20, targetCloseDate: 'Aug 15, 2024', stage: 'evaluation' },
      { id: 'opp2', title: 'Wealth Management Review - Sarah Davis', contactName: 'Sarah Davis', amountDisplay: '$2M (AUM)', probability: 10, targetCloseDate: 'Sep 01, 2024', stage: 'evaluation' },
    ],
  },
  {
    id: 'decision_makers',
    title: 'Identify Decision Makers',
    opportunities: [
      { id: 'opp3', title: 'Follow-up - ACME Corp', contactName: 'John Smith', amountDisplay: '$1,500 (Project)', probability: 30, targetCloseDate: 'Aug 20, 2024', stage: 'decision_makers' },
    ],
  },
  {
    id: 'qualification',
    title: 'Qualification',
    opportunities: [
      { id: 'opp4', title: 'Needs Assessment - Beta LLC', contactName: 'Jane Roe', amountDisplay: '$750 (Retainer)', probability: 50, targetCloseDate: 'Aug 28, 2024', stage: 'qualification' },
    ],
  },
  {
    id: 'needs_analysis',
    title: 'Needs Analysis',
    opportunities: [
      { id: 'opp5', title: 'Proposal Sent - Beta LLC', contactName: 'Jane Roe', amountDisplay: '$750 (Retainer)', probability: 70, targetCloseDate: 'Sep 10, 2024', stage: 'needs_analysis' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    opportunities: [
       { id: 'opp6', title: 'Negotiation - Gamma Inc.', contactName: 'Peter Quill', amountDisplay: '$5,000 (Consulting)', probability: 85, targetCloseDate: 'Jul 30, 2024', stage: 'review' },
    ],
  },
];


export default function ClientPortalOpportunitiesPage() {
  const [isAddOpportunityDialogOpen, setIsAddOpportunityDialogOpen] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'board' | 'list'>('board');
  const [pipelineData, setPipelineData] = React.useState<PipelineColumn[]>(initialPipelineData);

  // State for Add Opportunity Dialog form fields
  const [opportunityName, setOpportunityName] = React.useState('');
  const [opportunityContact, setOpportunityContact] = React.useState('');
  const [opportunityPipeline, setOpportunityPipeline] = React.useState('default_pipeline'); // Default pipeline
  const [opportunityStage, setOpportunityStage] = React.useState('evaluation'); // Default stage
  const [opportunityNextStep, setOpportunityNextStep] = React.useState('');
  const [opportunityProbability, setOpportunityProbability] = React.useState(''); // Store as string for input
  const [opportunityAmount, setOpportunityAmount] = React.useState('');
  const [opportunityAmountType, setOpportunityAmountType] = React.useState('one_time');
  const [opportunityTargetClose, setOpportunityTargetClose] = React.useState('');
  const [opportunityDescription, setOpportunityDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();

  const opportunityCount = React.useMemo(() => 
    pipelineData.reduce((sum, col) => sum + col.opportunities.length, 0),
    [pipelineData]
  );

  const resetForm = () => {
    setOpportunityName('');
    setOpportunityContact('');
    setOpportunityPipeline('default_pipeline');
    setOpportunityStage('evaluation');
    setOpportunityNextStep('');
    setOpportunityProbability('');
    setOpportunityAmount('');
    setOpportunityAmountType('one_time');
    setOpportunityTargetClose('');
    setOpportunityDescription('');
  };

  const handleAddOpportunity = async () => {
    setIsLoading(true);
    // Basic Validation
    if (!opportunityName || !opportunityContact || !opportunityPipeline || !opportunityStage || !opportunityAmount || !opportunityTargetClose) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields (Name, Contact, Pipeline, Stage, Amount, Target Close).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const prob = parseInt(opportunityProbability, 10);
    if (isNaN(prob) || prob < 0 || prob > 100) {
      toast({
        title: "Validation Error",
        description: "Probability must be a number between 0 and 100.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call / DB save
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOpportunity: OpportunityItem = {
      id: `opp${Date.now()}`,
      title: opportunityName,
      contactName: opportunityContact,
      amountDisplay: `$${parseFloat(opportunityAmount).toLocaleString()} (${opportunityAmountType.replace('_', ' ')})`,
      probability: prob,
      targetCloseDate: opportunityTargetClose, // Assuming direct input format like "MMM dd, yyyy" or YYYY-MM-DD
      stage: opportunityStage,
    };

    setPipelineData(prevData => {
      return prevData.map(column => {
        if (column.id === newOpportunity.stage) {
          return {
            ...column,
            opportunities: [newOpportunity, ...column.opportunities], // Add to beginning of list
          };
        }
        return column;
      });
    });

    toast({
      title: "Opportunity Created",
      description: `"${newOpportunity.title}" has been added to the ${newOpportunity.stage} stage.`,
    });

    resetForm();
    setIsAddOpportunityDialogOpen(false);
    setIsLoading(false);
  };


  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
            <Select defaultValue="default_pipeline" value={opportunityPipeline} onValueChange={setOpportunityPipeline}>
              <SelectTrigger className="w-auto bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
                <ChevronDown className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default_pipeline">Default Pipeline</SelectItem>
                <SelectItem value="pipeline_b">Pipeline B</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">({opportunityCount} opportunities)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
              <Button variant={activeView === 'board' ? "default" : "ghost"} size="sm" className={`px-3 py-1 h-auto text-xs ${activeView === 'board' ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/80'}`} onClick={() => setActiveView('board')}>
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" /> Board
              </Button>
              <Button variant={activeView === 'list' ? "default" : "ghost"} size="sm" className={`px-3 py-1 h-auto text-xs ${activeView === 'list' ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/80'}`} onClick={() => setActiveView('list')}>
                <List className="mr-1.5 h-3.5 w-3.5" /> List
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                  <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Manage Pipelines</DropdownMenuItem>
                <DropdownMenuItem>Customize Stages</DropdownMenuItem>
                <DropdownMenuItem>Export Opportunities</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsAddOpportunityDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Opportunity
            </Button>
          </div>
        </div>

        {/* Pipeline Board Area */}
        {activeView === 'board' && (
          <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
            {pipelineData.map((column) => (
              <div key={column.id} className="bg-card/60 backdrop-blur-md rounded-lg p-4 w-80 md:w-96 shrink-0 shadow-lg border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-semibold text-foreground">{column.title}</h2>
                  <span className="text-sm text-muted-foreground">{column.opportunities.length}</span>
                </div>
                <div className="space-y-3 h-[calc(100vh-20rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent">
                  {column.opportunities.length > 0 ? (
                    column.opportunities.map((opp) => (
                      <div key={opp.id} className="bg-black/50 p-3 rounded-md shadow-md border border-border/30 cursor-grab active:cursor-grabbing">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-medium text-foreground">{opp.title}</h3>
                          <Badge variant="outline" className="text-xs bg-primary/20 border-primary/50 text-primary">
                            {opp.probability}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Re: {opp.contactName}</p>
                        <div className="flex justify-between items-end">
                          <p className="text-sm font-semibold text-foreground">{opp.amountDisplay}</p>
                          <p className="text-xs text-muted-foreground">{opp.targetCloseDate}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4 italic">No opportunities in this stage.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'list' && (
           <PlaceholderCard title="Opportunities List View">
            <p className="text-muted-foreground text-center py-10">List view for opportunities will be implemented here.</p>
          </PlaceholderCard>
        )}

      </main>

      {/* Add Opportunity Dialog */}
      <Dialog open={isAddOpportunityDialogOpen} onOpenChange={setIsAddOpportunityDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">New Opportunity</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2 py-4 space-y-6">
            <div>
              <Label htmlFor="opportunityName-dialog">Opportunity Name</Label>
              <Input id="opportunityName-dialog" placeholder="Enter opportunity name..." value={opportunityName} onChange={(e) => setOpportunityName(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="opportunityContact-dialog">Contact</Label>
              <Input id="opportunityContact-dialog" placeholder="Search for a contact..." value={opportunityContact} onChange={(e) => setOpportunityContact(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opportunityPipeline-dialog">Pipeline</Label>
                <Select value={opportunityPipeline} onValueChange={setOpportunityPipeline}>
                  <SelectTrigger id="opportunityPipeline-dialog" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default_pipeline">Default Pipeline</SelectItem>
                    <SelectItem value="pipeline_b">Pipeline B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="opportunityStage-dialog">Stage</Label>
                <Select value={opportunityStage} onValueChange={setOpportunityStage}>
                  <SelectTrigger id="opportunityStage-dialog" className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {pipelineData.map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                    ))}
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="opportunityNextStep-dialog">Next Step</Label>
              <Input id="opportunityNextStep-dialog" placeholder="Describe next action..." value={opportunityNextStep} onChange={(e) => setOpportunityNextStep(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="opportunityProbability-dialog">Probability (%)</Label>
              <Input type="number" id="opportunityProbability-dialog" placeholder="e.g., 75" value={opportunityProbability} onChange={(e) => setOpportunityProbability(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" min="0" max="100"/>
            </div>
            <div>
              <Label>Amount</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" placeholder="0.00" value={opportunityAmount} onChange={(e) => setOpportunityAmount(e.target.value)} className="flex-grow bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
                <Select value={opportunityAmountType} onValueChange={setOpportunityAmountType}>
                  <SelectTrigger className="w-[150px] bg-input border-border/50 text-foreground focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring_fee">Recurring Fee</SelectItem>
                    <SelectItem value="one_time">One-Time Project</SelectItem>
                    <SelectItem value="aum_based">AUM Based</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div>
              <Label htmlFor="opportunityTargetClose-dialog">Target Close Date</Label>
              <Input id="opportunityTargetClose-dialog" type="date" value={opportunityTargetClose} onChange={(e) => setOpportunityTargetClose(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" />
            </div>
            <div>
              <Label htmlFor="opportunityDescription-dialog">Description</Label>
              <Textarea id="opportunityDescription-dialog" rows={4} placeholder="Add details about the opportunity..." value={opportunityDescription} onChange={(e) => setOpportunityDescription(e.target.value)} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary resize-none" />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-border/30">
            <DialogClose asChild>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddOpportunity} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Opportunity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

