
"use client";

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  UserCircle2,
  Phone,
  Mail,
  PlusCircle,
  MessageSquare,
  ListChecks,
  CalendarPlus,
  Briefcase, // Used for account cards
  Users,
  FileText,
  StickyNote,
  MoreHorizontal,
  Tag,
  Send,
  Loader2,
  AlertTriangle,
  Edit,
  Save,
  Search,
  Check, // For checkbox in modal
  ShieldCheck, // Example icon for Tax Qualified
  DollarSign as CurrencyIcon, // For currency inputs
  CalendarDays as DateIcon, // For date inputs
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { ActivityFeed, type ActivityCardProps } from "@/components/dashboard/ActivityFeed";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";


interface ContactDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  avatarUrl: string;
  tags: string[];
}

const mockContactData: Record<string, ContactDetails> = {
  '1': { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '555-123-4567', relationship: 'Client', avatarUrl: 'https://placehold.co/100x100.png', tags: ['VIP', 'Referred by Jane'] },
  '2': { id: '2', name: 'Jane Doe', email: 'jane.doe@email.com', phone: '555-987-6543', relationship: 'Prospect', avatarUrl: 'https://placehold.co/100x100.png', tags: ['New Lead'] },
};

const mockActivityFeed: ActivityCardProps[] = [
  { id: 'act1', type: 'contact', summary: 'Contact created by Josh Bajorek.', user: 'Josh Bajorek', timestamp: '3 days ago', tags: ['System Event'] },
  { id: 'act2', type: 'note', summary: 'Discussed Q4 investment strategy and risk tolerance. Client is considering a more conservative approach for the next 6 months due to market volatility.', user: 'Sarah Miller', timestamp: '2 days ago', details: 'Follow-up task created.' },
  { id: 'act3', type: 'task', summary: 'Task "Prepare Q4 Performance Report" completed by Maven AI.', user: 'Maven AI', userAvatar: '/icons/brain-logo.png', timestamp: '1 day ago' },
];

interface AdditionalInfoFieldOption {
  value: string;
  label: string;
}
interface AdditionalInfoField {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'number' | 'select';
  placeholder?: string;
  options?: AdditionalInfoFieldOption[];
  selectPlaceholder?: string;
}

interface SectionConfig {
  title: string;
  icon?: React.ElementType;
  fields: AdditionalInfoField[];
}

const yearOptions = Array.from({ length: 49 }, (_, i) => {
  const year = i + 1;
  return { value: `${year} Year${year > 1 ? 's' : ''}`, label: `${year} Year${year > 1 ? 's' : ''}` };
});

const additionalInfoSections: SectionConfig[] = [
  {
    title: "Professional Contacts",
    fields: [
      { key: "attorney", label: "Attorney" }, { key: "cpa", label: "CPA" }, { key: "doctor", label: "Doctor" }, { key: "insurance", label: "Insurance" }, { key: "businessManager", label: "Business Manager" }, { key: "familyOfficer", label: "Family Officer" }, { key: "assistant", label: "Assistant" }, { key: "trustedContact", label: "Trusted Contact" }, { key: "otherProfessional", label: "Other" },
    ],
  },
  {
    title: "Employment Information",
    fields: [
      { key: "occupation", label: "Occupation" }, { key: "occupationStartDate", label: "Occupation Start Date", type: "date" }, { key: "retirementDate", label: "Retirement Date", type: "date" }, { key: "grossAnnualIncome", label: "Gross Annual Income", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Written Agreements",
    fields: [
      { key: "signedFeeAgreementDate", label: "Signed Fee Agreement Date", type: "date" }, { key: "signedIpsAgreementDate", label: "Signed IPS Agreement Date", type: "date" }, { key: "signedFpAgreementDate", label: "Signed FP Agreement Date", type: "date" }, { key: "lastAdvOfferingDate", label: "Last ADV Offering Date", type: "date" }, { key: "initialCrsOfferingDate", label: "Initial CRS Offering Date", type: "date" }, { key: "lastCrsOfferingDate", label: "Last CRS Offering Date", type: "date" }, { key: "lastPrivacyOfferingDate", label: "Last Privacy Offering Date", type: "date" },
    ],
  },
  {
    title: "Investment Profile",
    fields: [
      { key: "investmentObjective", label: "Investment Objective", type: 'select', selectPlaceholder: 'Select objective...', options: [ { value: 'aggressive_growth', label: 'Aggressive Growth' }, { value: 'growth', label: 'Growth' }, { value: 'income', label: 'Income' }, { value: 'safety_of_principal', label: 'Safety of Principal' }, ] },
      { key: "timeHorizon", label: "Time Horizon", type: 'select', selectPlaceholder: 'Select horizon...', options: [ { value: 'short_term', label: 'Short Term (1-3 years)' }, { value: 'intermediate', label: 'Intermediate (3-7 years)' }, { value: 'long_term', label: 'Long Term (7+ years)' }, ] },
      { key: "riskTolerance", label: "Risk Tolerance", type: 'select', selectPlaceholder: 'Select tolerance...', options: [ { value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' }, { value: 'high_risk', label: 'High Risk' }, ] },
      { key: "experienceMutualFunds", label: "Experience with Mutual Funds", type: 'select', selectPlaceholder: 'Select years...', options: yearOptions }, { key: "experienceStocksBonds", label: "Experience with Stocks & Bonds", type: 'select', selectPlaceholder: 'Select years...', options: yearOptions }, { key: "experiencePartnerships", label: "Experience with Partnerships", type: 'select', selectPlaceholder: 'Select years...', options: yearOptions }, { key: "otherInvestingExperience", label: "Other Investing Experience", type: 'text', placeholder: 'e.g. Real Estate, Private Equity' },
    ],
  },
  {
    title: "Estimated Net Worth",
    fields: [
      { key: "assetsValue", label: "Assets", type: "text", placeholder: "$0.00" }, { key: "nonLiquidAssets", label: "Non-Liquid Assets", type: "text", placeholder: "$0.00" }, { key: "liabilities", label: "Liabilities", type: "text", placeholder: "$0.00" }, { key: "estimatedNetWorth", label: "Estimated Net Worth", type: "text", placeholder: "$0.00" }, { key: "estimatedLiquidNetWorth", label: "Estimated Liquid Net Worth", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Estimated Tax Information",
    fields: [
      { key: "taxBracket", label: "Federal Tax Rate", placeholder: "e.g., 24%" },
      { key: "stateTaxRate", label: "State Tax Rate", type: "text", placeholder: "e.g., 6.5%" },
      { key: "taxFilingStatus", label: "Tax Filing Status", type: "text", placeholder: "e.g., Married Filing Jointly" },
      { key: "hasTaxLossCarryforward", label: "Has Tax Loss Carryforward", type: "text", placeholder: "Yes/No" },
      { key: "estimatedTaxableIncome", label: "Estimated Taxable Income", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Health Information",
    fields: [
      { key: "height", label: "Height", placeholder: "e.g., 5'10\"" }, { key: "weight", label: "Weight", placeholder: "e.g., 170 lbs" }, { key: "smoker", label: "Smoker", placeholder: "Yes/No" }, { key: "medicalConditions", label: "Medical Conditions", type: "textarea" },
    ],
  },
  {
    title: "Other Information",
    fields: [
      { key: "driversLicenseNumber", label: "Driver’s License Number" }, { key: "driversLicenseState", label: "Driver’s License State" }, { key: "driversLicenseIssuedDate", label: "Driver’s License Issued Date", type: "date" }, { key: "driversLicenseExpiryDate", label: "Driver’s License Expiry Date", type: "date" }, { key: "birthPlace", label: "Birth Place" }, { key: "maidenName", label: "Maiden Name" }, { key: "passportNumber", label: "Passport Number" }, { key: "greenCardNumber", label: "Green Card Number" }, { key: "personalInterests", label: "Personal Interests", type: "textarea" }, { key: "importantInformation", label: "Important Information", type: "textarea" },
    ],
  },
];

interface AccountFormData {
  id: string; 
  accountNumber: string;
  company: string;
  product: string;
  accountType: string;
  taxQualified: boolean;
  taxQualType: string;
  discretionary: boolean;
  managed: boolean;
  manager: string;
  contacts: string;
  modelStrategy: string;
  status: string;
  issueDate: string;
  cashValue: string;
  faceValue: string;
  surrenderValue: string;
  loanBalance: string;
  assetBalance: string;
  rebalanceFrequency: string;
}

const initialAccountFormState: AccountFormData = {
  id: '',
  accountNumber: '', company: '', product: '', accountType: 'taxable_brokerage',
  taxQualified: false, taxQualType: '', discretionary: false, managed: false, manager: '',
  contacts: '', modelStrategy: '', status: 'active', issueDate: '',
  cashValue: '', faceValue: '', surrenderValue: '', loanBalance: '', assetBalance: '',
  rebalanceFrequency: 'annually',
};

const accountTypeOptions = [
  { value: "taxable_brokerage", label: "Taxable Brokerage" }, { value: "traditional_ira", label: "Traditional IRA" }, { value: "roth_ira", label: "Roth IRA" }, { value: "sep_ira", label: "SEP IRA" }, { value: "simple_ira", label: "SIMPLE IRA" }, { value: "401k", label: "401(k)" }, { value: "trust", label: "Trust" }, { value: "utma_ugma", label: "UTMA/UGMA" }, { value: "529", label: "529 Plan" }, { value: "annuity", label: "Annuity" }, { value: "insurance", label: "Insurance Policy" }, { value: "other", label: "Other" },
];
const taxQualTypeOptions = [
  { value: "qualified", label: "Qualified" }, { value: "non_qualified", label: "Non-Qualified" }, { value: " ERISA", label: "ERISA Governed" },
];
const statusOptions = [
  { value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "closed", label: "Closed" }, { value: "restricted", label: "Restricted" },
];
const rebalanceFrequencyOptions = [
  { value: "daily", label: "Daily" }, { value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "annually", label: "Annually" }, { value: "on_demand", label: "On Demand" }, { value: "never", label: "Never" },
];


export default function ContactDetailPage() {
  const params = useParams();
  const contactIdParam = params.contactId;
  const contactId = Array.isArray(contactIdParam) ? contactIdParam[0] : contactIdParam;
  const { toast } = useToast();

  const [contact, setContact] = React.useState<ContactDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [noteText, setNoteText] = React.useState('');

  const initialAdditionalInfoState: Record<string, string> = {};
  additionalInfoSections.forEach(section => {
    section.fields.forEach(field => {
      initialAdditionalInfoState[field.key] = "Not Set";
    });
  });

  const [additionalInfoData, setAdditionalInfoData] = React.useState<Record<string, string>>(initialAdditionalInfoState);
  const [editingSections, setEditingSections] = React.useState<Record<string, boolean>>({});

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = React.useState(false);
  const [accountFormData, setAccountFormData] = React.useState<AccountFormData>(initialAccountFormState);
  const [linkedAccounts, setLinkedAccounts] = React.useState<AccountFormData[]>([]);

  React.useEffect(() => {
    setIsLoading(true);
    if (contactId && typeof contactId === 'string') {
      setTimeout(() => {
        const data = mockContactData[contactId];
        if (data) {
          setContact({
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
          });

          if (data.id === '1') { // John Smith's ID
            const johnSmithSpecificData: Record<string, string> = {
              occupation: "Software Engineer",
              occupationStartDate: "2012-03-01",
              retirementDate: "2045-06-15",
              grossAnnualIncome: "$185,000",
              investmentObjective: "growth",
              timeHorizon: "long_term",
              riskTolerance: "moderate",
              experienceMutualFunds: "8 Years",
              experienceStocksBonds: "12 Years",
              experiencePartnerships: "2 Years",
              otherInvestingExperience: "Real estate and private equity",
              assetsValue: "$1,200,000",
              nonLiquidAssets: "$400,000",
              liabilities: "$250,000",
              estimatedNetWorth: "$950,000",
              estimatedLiquidNetWorth: "$550,000",
              taxBracket: "24%",
              stateTaxRate: "6.5%",
              taxFilingStatus: "Married Filing Jointly",
              hasTaxLossCarryforward: "Yes",
            };
            setAdditionalInfoData(prev => ({ ...prev, ...johnSmithSpecificData }));
          }

        } else {
          setContact({
            id: contactId, name: `Contact ID: ${contactId}`, email: 'N/A', phone: 'N/A', relationship: 'Unknown', avatarUrl: 'https://placehold.co/100x100.png', tags: []
          });
        }
        setIsLoading(false);
      }, 250); // Simulate fetch delay
    } else {
      setContact(null);
      setIsLoading(false);
    }
  }, [contactId]);

  const displayName = contact?.name || 'Unknown Contact';
  const displayAvatarUrl = contact?.avatarUrl || 'https://placehold.co/100x100.png';
  const displayRelationship = contact?.relationship || 'N/A';
  const displayTags = Array.isArray(contact?.tags) ? contact.tags : [];
  const displayPhone = contact?.phone || 'N/A';
  const displayEmail = contact?.email || 'N/A';

  const handleAdditionalInfoChange = (fieldKey: string, value: string) => {
    setAdditionalInfoData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const toggleSectionEdit = (sectionTitle: string) => {
    setEditingSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
  };

  const handleAccountFormChange = (field: keyof AccountFormData, value: string | boolean) => {
    setAccountFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'taxQualified' && value === false) {
        newState.taxQualType = ''; 
      }
      return newState;
    });
  };

  const handleSaveAccount = () => {
    if (!accountFormData.accountNumber.trim() || !accountFormData.company.trim() || !accountFormData.product.trim()) {
      toast({ title: "Missing Required Fields", description: "Account Number, Company, and Product are required.", variant: "destructive" });
      return;
    }
    setLinkedAccounts(prev => [...prev, { ...accountFormData, id: Date.now().toString() }]);
    toast({ title: "Account Added", description: `${accountFormData.product} account for ${accountFormData.company} added successfully.` });
    setIsAddAccountModalOpen(false);
    setAccountFormData(initialAccountFormState); 
  };
  
  const calculateTotalAssetBalance = (accounts: AccountFormData[]): string => {
    const total = accounts.reduce((sum, acc) => {
        const balanceStr = acc.assetBalance?.replace(/[^0-9.-]+/g,"") || "0";
        const balance = parseFloat(balanceStr);
        return sum + (isNaN(balance) ? 0 : balance);
    }, 0);
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  if (isLoading) {
    return (
      <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] p-6 md:p-8 flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground text-lg">Loading contact details...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] p-6 md:p-8 flex flex-col items-center justify-center h-screen text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive-foreground mb-2">Contact Not Found</h2>
        <p className="text-muted-foreground">The contact you are looking for does not exist or the ID is invalid.</p>
        <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] p-6 md:p-8 space-y-6">
      <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={displayAvatarUrl} alt={displayName} data-ai-hint="person" />
              <AvatarFallback className="bg-muted text-xl">{(displayName || '??').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{displayRelationship}</Badge>
                {displayTags.map((tag: string) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
                <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-primary"><PlusCircle className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-2"><Phone className="h-4 w-4 text-primary" /><span>{displayPhone}</span></div>
            <div className="flex items-center justify-center sm:justify-end gap-2"><Mail className="h-4 w-4 text-primary" /><span>{displayEmail}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/30">
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="note" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><MessageSquare className="mr-2 h-4 w-4" /> Note</TabsTrigger>
            <TabsTrigger value="task" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><ListChecks className="mr-2 h-4 w-4" /> Task</TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><CalendarPlus className="mr-2 h-4 w-4" /> Event</TabsTrigger>
            <TabsTrigger value="opportunity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Briefcase className="mr-2 h-4 w-4" /> Opportunity</TabsTrigger>
          </TabsList>
          <TabsContent value="note" className="mt-4">
            <div className="space-y-3">
              <Textarea placeholder={`Add a note for ${displayName}...`} value={noteText} onChange={(e) => setNoteText(e.target.value)} className="min-h-[100px] bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary rounded-md" rows={4}/>
              <div className="flex justify-end"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="mr-2 h-4 w-4" /> Post Note</Button></div>
            </div>
          </TabsContent>
           <TabsContent value="task"><p className="text-muted-foreground text-center p-4">Task creation form will appear here.</p></TabsContent>
           <TabsContent value="event"><p className="text-muted-foreground text-center p-4">Event creation form will appear here.</p></TabsContent>
           <TabsContent value="opportunity"><p className="text-muted-foreground text-center p-4">Opportunity creation form will appear here.</p></TabsContent>
        </Tabs>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/30 min-h-[400px]">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="border-b border-border/30 rounded-t-xl rounded-b-none px-4 bg-muted/30 justify-start">
            <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Activity</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Email</TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Accounts</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Files</TabsTrigger>
            <TabsTrigger value="additional_info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-3 py-2.5 text-sm">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="p-0"><ActivityFeed activities={mockActivityFeed} /></TabsContent>
          <TabsContent value="email"><p className="text-muted-foreground text-center p-8">Email history will appear here.</p></TabsContent>
          
          <TabsContent value="accounts" className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">Accounts</h3>
              <p className="text-xl font-semibold text-primary">${calculateTotalAssetBalance(linkedAccounts)}</p>
            </div>

            {linkedAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[250px] text-center bg-black/20 border border-border/20 rounded-lg p-8 shadow-inner">
                <Users className="h-20 w-20 text-muted-foreground/40 mb-5" strokeWidth={1.5} />
                <p className="text-lg text-muted-foreground">No accounts were found.</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Add an account to see details here.</p>
              </div>
            ) : (
               <div className="space-y-4">
                {linkedAccounts.map((acc) => (
                  <PlaceholderCard key={acc.id} title={`${acc.company} - ${acc.product}`} icon={Briefcase} className="bg-black/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      <div><strong className="text-muted-foreground">Acct #:</strong> {acc.accountNumber}</div>
                      <div><strong className="text-muted-foreground">Type:</strong> {accountTypeOptions.find(opt => opt.value === acc.accountType)?.label || acc.accountType}</div>
                      <div><strong className="text-muted-foreground">Status:</strong> {statusOptions.find(opt => opt.value === acc.status)?.label || acc.status}</div>
                      <div><strong className="text-muted-foreground">Asset Bal:</strong> {acc.assetBalance ? `$${parseFloat(acc.assetBalance.replace(/[^0-9.-]+/g,"")).toLocaleString()}` : '$0.00'}</div>
                      <div><strong className="text-muted-foreground">Managed:</strong> {acc.managed ? "Yes" : "No"}{acc.managed && acc.manager ? ` (${acc.manager})` : ""}</div>
                      <div><strong className="text-muted-foreground">Tax Qualified:</strong> {acc.taxQualified ? `Yes (${taxQualTypeOptions.find(opt => opt.value === acc.taxQualType)?.label || acc.taxQualType})` : "No"}</div>
                    </div>
                  </PlaceholderCard>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-out"
                onClick={() => {
                  setAccountFormData(prev => ({ ...initialAccountFormState, contacts: displayName, id: '' })); 
                  setIsAddAccountModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="files"><p className="text-muted-foreground text-center p-8">Files related to this contact will appear here.</p></TabsContent>
          <TabsContent value="additional_info" className="p-4 md:p-6">
            <div className="space-y-8">
              {additionalInfoSections.map((section) => {
                const isEditing = !!editingSections[section.title];
                return (
                  <PlaceholderCard key={section.title} title="" className="bg-black/20 p-0">
                    <div className="flex justify-between items-center p-4 border-b border-border/20">
                      <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                      <Button variant="ghost" size="sm" onClick={() => toggleSectionEdit(section.title)} className="text-primary hover:text-primary/80">
                        {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                        {isEditing ? "Save" : "Edit"}
                      </Button>
                    </div>
                    <div className="p-4 space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                          <Label htmlFor={`${section.title}-${field.key}`} className="text-muted-foreground md:col-span-1">{field.label}</Label>
                          <div className="md:col-span-2">
                            {isEditing ? (
                              field.type === 'select' && field.options ? (
                                <Select value={additionalInfoData[field.key] === "Not Set" ? undefined : additionalInfoData[field.key]} onValueChange={(value) => handleAdditionalInfoChange(field.key, value)}>
                                  <SelectTrigger id={`${section.title}-${field.key}`} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"><SelectValue placeholder={field.selectPlaceholder || "Select an option"} /></SelectTrigger>
                                  <SelectContent>{field.options.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                                </Select>
                              ) : field.type === 'textarea' ? (
                                <Textarea id={`${section.title}-${field.key}`} value={additionalInfoData[field.key] === "Not Set" ? "" : additionalInfoData[field.key]} onChange={(e) => handleAdditionalInfoChange(field.key, e.target.value)} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary" rows={3}/>
                              ) : (
                                <Input id={`${section.title}-${field.key}`} type={field.type || 'text'} value={additionalInfoData[field.key] === "Not Set" ? "" : additionalInfoData[field.key]} onChange={(e) => handleAdditionalInfoChange(field.key, e.target.value)} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`} className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"/>
                              )
                            ) : ( <p className="text-foreground text-sm py-2">{additionalInfoData[field.key] || "Not Set"}</p> )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PlaceholderCard>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <Dialog open={isAddAccountModalOpen} onOpenChange={setIsAddAccountModalOpen}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col bg-card/90 backdrop-blur-md border-border/40 text-foreground">
        <DialogHeader className="p-6 border-b border-border/30">
          <DialogTitle className="text-xl font-bold">Add New Account</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Left Column */}
            <div className="space-y-5">
              <div><Label htmlFor="accountNumber-dialog">Account Number</Label><Input id="accountNumber-dialog" value={accountFormData.accountNumber} onChange={(e) => handleAccountFormChange('accountNumber', e.target.value)} placeholder="e.g., XZY-123456" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="company-dialog">Company</Label><Input id="company-dialog" value={accountFormData.company} onChange={(e) => handleAccountFormChange('company', e.target.value)} placeholder="e.g., Pershing LLC" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="product-dialog">Product</Label><Input id="product-dialog" value={accountFormData.product} onChange={(e) => handleAccountFormChange('product', e.target.value)} placeholder="e.g., Brokerage Account" className="bg-input border-border/50"/></div>
              <div>
                <Label htmlFor="accountType-dialog">Account Type</Label>
                <Select value={accountFormData.accountType} onValueChange={(val) => handleAccountFormChange('accountType', val)}><SelectTrigger id="accountType-dialog" className="bg-input border-border/50"><SelectValue /></SelectTrigger><SelectContent>{accountTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="flex items-center space-x-2 pt-2"><Checkbox id="taxQualified-dialog" checked={accountFormData.taxQualified} onCheckedChange={(checked) => handleAccountFormChange('taxQualified', !!checked)} /><Label htmlFor="taxQualified-dialog" className="font-normal">Tax Qualified?</Label></div>
              {accountFormData.taxQualified && (<div><Label htmlFor="taxQualType-dialog">Tax Qual Type</Label><Select value={accountFormData.taxQualType} onValueChange={(val) => handleAccountFormChange('taxQualType', val)} disabled={!accountFormData.taxQualified}><SelectTrigger id="taxQualType-dialog" className="bg-input border-border/50"><SelectValue placeholder="Select qualification type..." /></SelectTrigger><SelectContent>{taxQualTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>)}
              <div className="flex items-center space-x-2 pt-2"><Checkbox id="discretionary-dialog" checked={accountFormData.discretionary} onCheckedChange={(checked) => handleAccountFormChange('discretionary', !!checked)} /><Label htmlFor="discretionary-dialog" className="font-normal">Discretionary?</Label></div>
              <div className="flex items-center space-x-2 pt-2"><Checkbox id="managed-dialog" checked={accountFormData.managed} onCheckedChange={(checked) => handleAccountFormChange('managed', !!checked)} /><Label htmlFor="managed-dialog" className="font-normal">Managed?</Label></div>
              {accountFormData.managed && (<div><Label htmlFor="manager-dialog">Manager</Label><Input id="manager-dialog" value={accountFormData.manager} onChange={(e) => handleAccountFormChange('manager', e.target.value)} placeholder="Enter manager name" className="bg-input border-border/50"/></div>)}
              <div><Label htmlFor="contacts-dialog">Contacts</Label><Input id="contacts-dialog" value={accountFormData.contacts} onChange={(e) => handleAccountFormChange('contacts', e.target.value)} className="bg-input border-border/50"/></div>
            </div>
            {/* Right Column */}
            <div className="space-y-5">
              <div><Label htmlFor="modelStrategy-dialog">Model Strategy</Label><Input id="modelStrategy-dialog" value={accountFormData.modelStrategy} onChange={(e) => handleAccountFormChange('modelStrategy', e.target.value)} placeholder="e.g., Growth Portfolio Model A" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="status-dialog">Status</Label><Select value={accountFormData.status} onValueChange={(val) => handleAccountFormChange('status', val)}><SelectTrigger id="status-dialog" className="bg-input border-border/50"><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="issueDate-dialog">Issue Date</Label><Input id="issueDate-dialog" type="date" value={accountFormData.issueDate} onChange={(e) => handleAccountFormChange('issueDate', e.target.value)} className="bg-input border-border/50"/></div>
              <div><Label htmlFor="cashValue-dialog">Cash Value</Label><Input id="cashValue-dialog" type="number" value={accountFormData.cashValue} onChange={(e) => handleAccountFormChange('cashValue', e.target.value)} placeholder="$0.00" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="faceValue-dialog">Face Value</Label><Input id="faceValue-dialog" type="number" value={accountFormData.faceValue} onChange={(e) => handleAccountFormChange('faceValue', e.target.value)} placeholder="$0.00" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="surrenderValue-dialog">Surrender Value</Label><Input id="surrenderValue-dialog" type="number" value={accountFormData.surrenderValue} onChange={(e) => handleAccountFormChange('surrenderValue', e.target.value)} placeholder="$0.00" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="loanBalance-dialog">Loan Balance</Label><Input id="loanBalance-dialog" type="number" value={accountFormData.loanBalance} onChange={(e) => handleAccountFormChange('loanBalance', e.target.value)} placeholder="$0.00" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="assetBalance-dialog">Asset Balance</Label><Input id="assetBalance-dialog" type="number" value={accountFormData.assetBalance} onChange={(e) => handleAccountFormChange('assetBalance', e.target.value)} placeholder="$0.00" className="bg-input border-border/50"/></div>
              <div><Label htmlFor="rebalanceFrequency-dialog">Rebalance Frequency</Label><Select value={accountFormData.rebalanceFrequency} onValueChange={(val) => handleAccountFormChange('rebalanceFrequency', val)}><SelectTrigger id="rebalanceFrequency-dialog" className="bg-input border-border/50"><SelectValue /></SelectTrigger><SelectContent>{rebalanceFrequencyOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 border-t border-border/30">
          <DialogClose asChild><Button variant="outline" onClick={() => setAccountFormData(initialAccountFormState)}>Cancel</Button></DialogClose>
          <Button onClick={handleSaveAccount} className="bg-primary hover:bg-primary/90">Save Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

