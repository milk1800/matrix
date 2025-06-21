
"use client";

import * as React from "react";
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getCompanyNameFromTicker } from "@/lib/ticker-utils";
import {
  Brain,
  User,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  Goal,
  Leaf,
  PieChart as PieChartIcon,
  AlertTriangle,
  CheckCircle2,
  Edit,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  BarChartBig,
  Search,
  Contact2,
  Loader2,
} from 'lucide-react';
import { generateEtfPortfolio, type GenerateEtfPortfolioOutput, type GenerateEtfPortfolioInput } from "@/ai/flows/generate-etf-portfolio-flow";


interface QuestionnaireData {
  age?: number;
  investmentHorizon?: string;
  riskTolerance?: "Low" | "Medium" | "High" | "Very High";
  incomeNeeds?: "None" | "Low" | "Moderate" | "Significant";
  annualIncome?: string;
  investableAssets?: string;
  investmentGoals?: string[];
  esgConsiderations?: boolean;
}

interface PortfolioAsset {
  assetClass: string;
  percentage: number;
  color: string;
}

interface AiAlertItem {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  actionTaken?: "Accepted" | "Modified" | "Dismissed";
  source?: string;
  rationale?: string;
}

const mockPortfolio: PortfolioAsset[] = [
  { assetClass: "US Large Cap Equity", percentage: 30, color: "bg-[hsl(var(--chart-1))]" },
  { assetClass: "International Developed Equity", percentage: 20, color: "bg-[hsl(var(--chart-2))]" },
  { assetClass: "US Investment Grade Bonds", percentage: 25, color: "bg-[hsl(var(--chart-3))]" },
  { assetClass: "Real Estate (REITs)", percentage: 10, color: "bg-[hsl(var(--chart-4))]" },
  { assetClass: "Emerging Markets Equity", percentage: 10, color: "bg-[hsl(var(--chart-5))]" },
  { assetClass: "Cash", percentage: 5, color: "bg-muted" },
];

const initialAlerts: AiAlertItem[] = [
  { id: "alert1", title: "Review Tech Sector Exposure", description: "Increased volatility in FAANG stocks and broader tech sector detected. Consider reducing allocation from 20% to 15%.", severity: "Medium", source: "Market Volatility Index, News Sentiment Analysis", rationale: "Recent earnings reports and forward guidance from key tech companies suggest potential headwinds. Reducing exposure can mitigate short-term downside risk." },
  { id: "alert2", title: "Opportunity: Healthcare Innovation", description: "Positive clinical trial results and increased R&D spending in biotech. Suggest increasing allocation to Healthcare Innovation ETF by 3-5%.", severity: "Low", source: "Biotech FDA Tracker, R&D Filings", rationale: "Sector shows strong growth potential driven by innovation. A modest increase aligns with growth objectives if risk tolerance allows." },
  { id: "alert3", title: "Inflation Hedge Adjustment Needed", description: "CPI data indicates persistent inflation above target. Current TIPS holding may be insufficient. Consider adding commodities or inflation-linked equities.", severity: "High", source: "BLS CPI Report, Federal Reserve Statements", rationale: "Protect purchasing power against sustained inflation. Current fixed income may underperform." },
];

const TOTAL_STEPS = 3;

const investmentGoalOptions = [
  { id: "retirement", label: "Retirement Planning" },
  { id: "wealthGrowth", label: "Wealth Growth" },
  { id: "capitalPreservation", label: "Capital Preservation" },
  { id: "incomeGeneration", label: "Income Generation" },
  { id: "education", label: "Education Funding" },
];

const initialFormDataState: QuestionnaireData = {
  investmentGoals: [],
  age: undefined,
  investmentHorizon: undefined,
  riskTolerance: undefined,
  incomeNeeds: undefined,
  annualIncome: undefined,
  investableAssets: undefined,
  esgConsiderations: undefined,
};

const mockClientDatabase: Record<string, Partial<QuestionnaireData>> = {
  "John Smith": {
    age: 42,
    investmentHorizon: "7+",
    riskTolerance: "Medium",
    incomeNeeds: "Low",
    investmentGoals: ["retirement", "wealthGrowth"],
    esgConsiderations: true,
    annualIncome: "$150,000 - $200,000",
    investableAssets: "$750,000",
  },
  "Jane Doe": {
    age: 28,
    investmentHorizon: "7+",
    riskTolerance: "High",
    incomeNeeds: "None",
    investmentGoals: ["wealthGrowth"],
    esgConsiderations: false,
    annualIncome: "$75,000 - $100,000",
    investableAssets: "$150,000",
  },
  "Alex Johnson": {
    age: 55,
    investmentHorizon: "3-7",
    riskTolerance: "Low",
    incomeNeeds: "Moderate",
    investmentGoals: ["capitalPreservation", "incomeGeneration"],
    esgConsiderations: true,
    annualIncome: "$200,000+",
    investableAssets: "$1,200,000",
  }
};

const CLEAR_SELECTION_VALUE = "_clear_selection_";

export default function ProjectXPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<QuestionnaireData>(initialFormDataState);
  const [alerts, setAlerts] = React.useState<AiAlertItem[]>(initialAlerts);
  const [showPortfolio, setShowPortfolio] = React.useState(false); // Retained for UI flow
  const [loadedClientName, setLoadedClientName] = React.useState<string | null>(null);

  const [aiPortfolioRecommendation, setAiPortfolioRecommendation] = React.useState<GenerateEtfPortfolioOutput | null>(null);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = React.useState(false);
  const [portfolioGenerationError, setPortfolioGenerationError] = React.useState<string | null>(null);


  const handleInputChange = (field: keyof QuestionnaireData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (goalId: string, checked: boolean) => {
    setFormData(prev => {
      const currentGoals = prev.investmentGoals || [];
      if (checked) {
        return { ...prev, investmentGoals: [...currentGoals, goalId] };
      } else {
        return { ...prev, investmentGoals: currentGoals.filter(g => g !== goalId) };
      }
    });
  };

  const handleClientSelectionChange = (clientNameKey: string) => {
    if (clientNameKey === CLEAR_SELECTION_VALUE || !clientNameKey) {
      setFormData(initialFormDataState);
      setLoadedClientName(null);
      setAiPortfolioRecommendation(null); // Clear AI portfolio if form is reset
      setShowPortfolio(false);
      setCurrentStep(1);
      toast({ title: "Form Cleared", description: "Questionnaire has been reset." });
      return;
    }

    const clientData = mockClientDatabase[clientNameKey];
    if (clientData) {
      setFormData({ 
        ...initialFormDataState, 
        ...clientData,
        investmentGoals: clientData.investmentGoals ? [...clientData.investmentGoals] : [],
      });
      setLoadedClientName(clientNameKey);
      setAiPortfolioRecommendation(null); // Clear previous AI portfolio
      setShowPortfolio(false); // Reset portfolio view
      setCurrentStep(1); // Reset to first step
      toast({
        title: "Client Data Loaded",
        description: `Profile for ${clientNameKey} has been pre-filled.`,
      });
    } else {
      setLoadedClientName(null);
      setFormData(initialFormDataState);
      toast({
        title: "Client Not Found",
        description: `No profile found for "${clientNameKey}". Form reset.`,
        variant: "destructive",
      });
    }
  };

  const handleGeneratePortfolio = async () => {
    setIsGeneratingPortfolio(true);
    setPortfolioGenerationError(null);
    setAiPortfolioRecommendation(null);

    const flowInput: GenerateEtfPortfolioInput = {
      name: loadedClientName || undefined,
      age: formData.age,
      investmentHorizon: formData.investmentHorizon,
      riskTolerance: formData.riskTolerance,
      objective: formData.investmentGoals?.join(', ') || undefined,
      annualIncome: formData.annualIncome, // This field isn't in current QuestionnaireData, will be undefined
      netWorth: formData.investableAssets, // Using investableAssets for netWorth for now
      liquidityNeeds: formData.incomeNeeds,
      taxBracket: undefined, // This field isn't in current QuestionnaireData
      accountTypes: undefined, // This field isn't in current QuestionnaireData
      currentHoldings: undefined, // This field isn't in current QuestionnaireData
      esgConsiderations: formData.esgConsiderations,
    };

    try {
      const result = await generateEtfPortfolio(flowInput);
      setAiPortfolioRecommendation(result);
      setShowPortfolio(true); // Show the portfolio section
      toast({
        title: "Portfolio Generated!",
        description: `Maven AI has constructed a suggested ETF portfolio.`,
      });
    } catch (error: any) {
      console.error("Error generating portfolio:", error);
      setPortfolioGenerationError(error.message || "Failed to generate portfolio. Please try again.");
      toast({
        title: "Portfolio Generation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPortfolio(false);
    }
  };


  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step: trigger AI portfolio generation
      handleGeneratePortfolio();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAlertAction = (alertId: string, action: AiAlertItem["actionTaken"]) => {
    setAlerts(prevAlerts => prevAlerts.map(alert =>
      alert.id === alertId ? { ...alert, actionTaken: action, title: `${action}: ${alert.title}` } : alert
    ));
    toast({
      title: `Alert Action: ${action}`,
      description: `Recommendation for "${alerts.find(a=>a.id===alertId)?.title}" has been ${action?.toLowerCase()}.`,
    });
  };

  const getAlertBadgeClass = (severity: AiAlertItem["severity"]): string => {
    switch (severity) {
      case "High": return "bg-red-500/20 border-red-500/50 text-red-400";
      case "Medium": return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      case "Low": return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const resetFullForm = () => {
    setShowPortfolio(false);
    setAiPortfolioRecommendation(null);
    setPortfolioGenerationError(null);
    setCurrentStep(1);
    setFormData(initialFormDataState);
    setLoadedClientName(null);
    toast({title: "Form Reset", description: "Questionnaire and portfolio have been cleared."});
  };

  const renderQuestionnaireStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Personal & Horizon</h3>
            <div>
              <Label htmlFor="age" className="text-muted-foreground">Age</Label>
              <Input id="age" type="number" placeholder="e.g., 35" value={formData.age || ''} onChange={(e) => handleInputChange('age', parseInt(e.target.value))} className="bg-input border-border/50" />
            </div>
            <div>
              <Label htmlFor="investmentHorizon" className="text-muted-foreground">Investment Horizon</Label>
              <Select value={formData.investmentHorizon || ""} onValueChange={(value) => handleInputChange('investmentHorizon', value)}>
                <SelectTrigger id="investmentHorizon" className="bg-input border-border/50"><SelectValue placeholder="Select horizon" /></SelectTrigger>
                <SelectContent><SelectItem value="1-3">Short-term (1-3 years)</SelectItem><SelectItem value="3-7">Medium-term (3-7 years)</SelectItem><SelectItem value="7+">Long-term (7+ years)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" />Financial & Risk</h3>
            <div>
              <Label className="text-muted-foreground">Risk Tolerance</Label>
              <RadioGroup value={formData.riskTolerance} onValueChange={(value) => handleInputChange('riskTolerance', value as QuestionnaireData['riskTolerance'])} className="mt-2 space-y-1">
                {["Low", "Medium", "High", "Very High"].map(level => (
                  <div key={level} className="flex items-center space-x-2"><RadioGroupItem value={level} id={`risk-${level.toLowerCase()}`} /><Label htmlFor={`risk-${level.toLowerCase()}`} className="font-normal text-foreground">{level}</Label></div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="incomeNeeds" className="text-muted-foreground">Income Needs from Portfolio (Liquidity Needs)</Label>
              <Select value={formData.incomeNeeds || ""} onValueChange={(value) => handleInputChange('incomeNeeds', value)}>
                <SelectTrigger id="incomeNeeds" className="bg-input border-border/50"><SelectValue placeholder="Select income needs" /></SelectTrigger>
                <SelectContent><SelectItem value="None">None / Growth Focused</SelectItem><SelectItem value="Low">Low (e.g., occasional withdrawals)</SelectItem><SelectItem value="Moderate">Moderate (e.g., supplemental income)</SelectItem><SelectItem value="Significant">Significant (e.g., primary income source)</SelectItem></SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="investableAssets" className="text-muted-foreground">Investable Assets (Estimate for Net Worth)</Label>
              <Input id="investableAssets" type="text" placeholder="e.g., $500,000" value={formData.investableAssets || ''} onChange={(e) => handleInputChange('investableAssets', e.target.value)} className="bg-input border-border/50" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center"><Goal className="mr-2 h-5 w-5 text-primary" />Goals & Preferences</h3>
            <div>
              <Label className="text-muted-foreground">Primary Investment Goals (Objectives)</Label>
              <div className="mt-2 space-y-2">
                {investmentGoalOptions.map(goal => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox id={`goal-${goal.id}`} checked={(formData.investmentGoals || []).includes(goal.id)} onCheckedChange={(checked) => handleCheckboxChange(goal.id, !!checked)} />
                    <Label htmlFor={`goal-${goal.id}`} className="font-normal text-foreground">{goal.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="esgConsiderations" checked={!!formData.esgConsiderations} onCheckedChange={(checked) => handleInputChange('esgConsiderations', !!checked)} />
              <Label htmlFor="esgConsiderations" className="font-normal text-foreground flex items-center"><Leaf className="mr-1.5 h-4 w-4 text-green-400" />Include ESG Considerations?</Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 flex items-center">
        <Brain className="w-8 h-8 mr-3 text-primary brain-logo-static-glow" />
        Project X: AI Portfolio Architect
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {!showPortfolio ? (
            <>
              <PlaceholderCard title="Client Selection" icon={Contact2} className="min-h-0">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientNameSelect" className="text-muted-foreground">Select Client to Pre-fill Questionnaire</Label>
                    <Select value={loadedClientName || CLEAR_SELECTION_VALUE} onValueChange={handleClientSelectionChange}>
                      <SelectTrigger id="clientNameSelect" className="bg-input border-border/50 mt-1">
                        <SelectValue placeholder="Select Client to Pre-fill..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CLEAR_SELECTION_VALUE}>Clear Selection / Reset Form</SelectItem>
                        {Object.keys(mockClientDatabase).map(clientName => (
                          <SelectItem key={clientName} value={clientName}>{clientName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loadedClientName && <p className="text-xs text-green-400 mt-2">Profile for: {loadedClientName} is loaded.</p>}
                  </div>
                </div>
              </PlaceholderCard>
              <Separator className="my-6 border-border/30" />
              <PlaceholderCard title="Investor Profile Questionnaire" icon={User} className="min-h-[400px]">
                <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full h-2.5 mb-6 mt-2 [&>div]:bg-primary" />
                <div className="mb-8 min-h-[250px]">
                  {renderQuestionnaireStep()}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/30">
                  <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <p className="text-sm text-muted-foreground">Step {currentStep} of {TOTAL_STEPS}</p>
                  <Button onClick={handleNextStep} className="bg-primary hover:bg-primary/90" disabled={isGeneratingPortfolio}>
                    {isGeneratingPortfolio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {currentStep === TOTAL_STEPS ? (isGeneratingPortfolio ? "Generating..." : "Generate Portfolio") : "Next"}
                    {currentStep < TOTAL_STEPS && !isGeneratingPortfolio && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </PlaceholderCard>
            </>
          ) : aiPortfolioRecommendation ? (
            <PlaceholderCard title={aiPortfolioRecommendation.portfolioName} icon={PieChartIcon} className="min-h-[400px]">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Allocation Table</h3>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Allocation</TableHead>
                            <TableHead>Asset Class</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {aiPortfolioRecommendation.allocations.map((alloc, index) => (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{getCompanyNameFromTicker(alloc.etf)} ({alloc.etf})</TableCell>
                            <TableCell>{alloc.allocation}</TableCell>
                            <TableCell>{alloc.assetClass}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Rationale</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{aiPortfolioRecommendation.rationaleSummary}</p>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                    <Button variant="outline" onClick={resetFullForm}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                    </Button>
                     <Button className="bg-primary hover:bg-primary/90">
                        Implement This Portfolio
                    </Button>
                </div>
            </PlaceholderCard>
          ) : portfolioGenerationError ? (
            <PlaceholderCard title="Portfolio Generation Error" icon={AlertTriangle} className="min-h-[400px]">
                <p className="text-red-400">{portfolioGenerationError}</p>
                <div className="flex justify-end mt-6">
                    <Button variant="outline" onClick={resetFullForm}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                </div>
            </PlaceholderCard>
          ) : (
            <PlaceholderCard title="Generating Portfolio..." icon={Loader2} className="min-h-[400px] animate-pulse">
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground">Maven AI is constructing your portfolio...</p>
                </div>
            </PlaceholderCard>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <PlaceholderCard title="AI Portfolio Alerts" icon={AlertTriangle} className="min-h-[300px]">
            {alerts.length === 0 && !showPortfolio ? (
                 <p className="text-muted-foreground text-center py-10">Complete the questionnaire to view potential AI-driven portfolio alerts.</p>
            ): alerts.length === 0 && showPortfolio ? (
                <p className="text-muted-foreground text-center py-10">No active alerts for the suggested portfolio.</p>
            ) : (
              <ScrollArea className="h-[350px] pr-3 -mr-3"> 
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <Alert key={alert.id} className={cn("border-border/40 bg-black/20", alert.actionTaken && "opacity-60")}>
                      <div className="flex items-center mb-1">
                        <AlertTriangle className={cn("h-4 w-4 mr-2", getAlertBadgeClass(alert.severity))} />
                        <AlertTitle className="text-sm font-semibold text-foreground">{alert.title}</AlertTitle>
                      </div>
                      <AlertDescription className="text-xs text-muted-foreground mb-3">{alert.description}</AlertDescription>
                      {alert.rationale && <p className="text-xs text-primary/80 mb-1">Rationale: {alert.rationale}</p>}
                      {alert.source && <p className="text-xs text-muted-foreground/70 mb-3">Source: {alert.source}</p>}
                      {!alert.actionTaken ? (
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleAlertAction(alert.id, "Dismissed")}><XCircle className="mr-1.5 h-3.5 w-3.5"/>Dismiss</Button>
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleAlertAction(alert.id, "Modified")}><Edit className="mr-1.5 h-3.5 w-3.5"/>Modify</Button>
                          <Button size="sm" className="text-xs h-7 bg-primary hover:bg-primary/90" onClick={() => handleAlertAction(alert.id, "Accepted")}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5"/>Accept</Button>
                        </div>
                      ) : (
                         <p className="text-xs text-green-400 font-medium text-right mt-2">Action: {alert.actionTaken}</p>
                      )}
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            )}
          </PlaceholderCard>
        </div>
      </div>
    </main>
  );
}
