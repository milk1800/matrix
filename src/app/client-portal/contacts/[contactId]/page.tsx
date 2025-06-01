
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
  Briefcase,
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
      { key: "attorney", label: "Attorney" },
      { key: "cpa", label: "CPA" },
      { key: "doctor", label: "Doctor" },
      { key: "insurance", label: "Insurance" },
      { key: "businessManager", label: "Business Manager" },
      { key: "familyOfficer", label: "Family Officer" },
      { key: "assistant", label: "Assistant" },
      { key: "trustedContact", label: "Trusted Contact" },
      { key: "otherProfessional", label: "Other" },
    ],
  },
  {
    title: "Employment Information",
    fields: [
      { key: "occupation", label: "Occupation" },
      { key: "occupationStartDate", label: "Occupation Start Date", type: "date" },
      { key: "retirementDate", label: "Retirement Date", type: "date" },
      { key: "grossAnnualIncome", label: "Gross Annual Income", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Written Agreements",
    fields: [
      { key: "signedFeeAgreementDate", label: "Signed Fee Agreement Date", type: "date" },
      { key: "signedIpsAgreementDate", label: "Signed IPS Agreement Date", type: "date" },
      { key: "signedFpAgreementDate", label: "Signed FP Agreement Date", type: "date" },
      { key: "lastAdvOfferingDate", label: "Last ADV Offering Date", type: "date" },
      { key: "initialCrsOfferingDate", label: "Initial CRS Offering Date", type: "date" },
      { key: "lastCrsOfferingDate", label: "Last CRS Offering Date", type: "date" },
      { key: "lastPrivacyOfferingDate", label: "Last Privacy Offering Date", type: "date" },
    ],
  },
  {
    title: "Investment Profile",
    fields: [
      { 
        key: "investmentObjective", 
        label: "Investment Objective",
        type: 'select',
        selectPlaceholder: 'Select objective...',
        options: [
          { value: 'aggressive_growth', label: 'Aggressive Growth' },
          { value: 'growth', label: 'Growth' },
          { value: 'income', label: 'Income' },
          { value: 'safety_of_principal', label: 'Safety of Principal' },
        ]
      },
      { 
        key: "timeHorizon", 
        label: "Time Horizon",
        type: 'select',
        selectPlaceholder: 'Select horizon...',
        options: [
          { value: 'short_term', label: 'Short Term' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'long_term', label: 'Long Term' },
        ]
      },
      { 
        key: "riskTolerance", 
        label: "Risk Tolerance",
        type: 'select',
        selectPlaceholder: 'Select tolerance...',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high_risk', label: 'High Risk' },
        ]
      },
      { 
        key: "experienceMutualFunds", 
        label: "Experience with Mutual Funds",
        type: 'select',
        selectPlaceholder: 'Select years...',
        options: yearOptions
      },
      { 
        key: "experienceStocksBonds", 
        label: "Experience with Stocks & Bonds",
        type: 'select',
        selectPlaceholder: 'Select years...',
        options: yearOptions
      },
      { 
        key: "experiencePartnerships", 
        label: "Experience with Partnerships",
        type: 'select',
        selectPlaceholder: 'Select years...',
        options: yearOptions
      },
      { 
        key: "otherInvestingExperience", 
        label: "Other Investing Experience",
        type: 'select',
        selectPlaceholder: 'Select years...',
        options: yearOptions
      },
    ],
  },
  {
    title: "Estimated Net Worth", // Renamed from Assets
    fields: [
      { key: "assetsValue", label: "Assets", type: "text", placeholder: "$0.00" },
      { key: "nonLiquidAssets", label: "Non-Liquid Assets", type: "text", placeholder: "$0.00" },
      { key: "liabilities", label: "Liabilities", type: "text", placeholder: "$0.00" },
      { key: "estimatedNetWorth", label: "Estimated Net Worth", type: "text", placeholder: "$0.00" },
      { key: "estimatedLiquidNetWorth", label: "Estimated Liquid Net Worth", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Estimated Tax Information",
    fields: [
      { key: "taxBracket", label: "Tax Bracket", placeholder: "e.g., 24%" },
      { key: "taxFilingStatus", label: "Tax Filing Status" },
      { key: "estimatedTaxableIncome", label: "Estimated Taxable Income", type: "text", placeholder: "$0.00" },
    ],
  },
  {
    title: "Health Information",
    fields: [
      { key: "height", label: "Height", placeholder: "e.g., 5'10\"" },
      { key: "weight", label: "Weight", placeholder: "e.g., 170 lbs" },
      { key: "smoker", label: "Smoker", placeholder: "Yes/No" },
      { key: "medicalConditions", label: "Medical Conditions", type: "textarea" },
    ],
  },
  {
    title: "Other Information",
    fields: [
      { key: "driversLicenseNumber", label: "Driver’s License Number" },
      { key: "driversLicenseState", label: "Driver’s License State" },
      { key: "driversLicenseIssuedDate", label: "Driver’s License Issued Date", type: "date" },
      { key: "driversLicenseExpiryDate", label: "Driver’s License Expiry Date", type: "date" },
      { key: "birthPlace", label: "Birth Place" },
      { key: "maidenName", label: "Maiden Name" },
      { key: "passportNumber", label: "Passport Number" },
      { key: "greenCardNumber", label: "Green Card Number" },
      { key: "personalInterests", label: "Personal Interests", type: "textarea" },
      { key: "importantInformation", label: "Important Information", type: "textarea" },
    ],
  },
];


export default function ContactDetailPage() {
  const params = useParams();
  const contactIdParam = params.contactId;
  const contactId = Array.isArray(contactIdParam) ? contactIdParam[0] : contactIdParam;

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

  React.useEffect(() => {
    setIsLoading(true);
    if (contactId && typeof contactId === 'string') {
      // Simulate fetching contact data
      setTimeout(() => {
        const data = mockContactData[contactId];
        if (data) {
          setContact({
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [], // Ensure tags is an array
          });
        } else {
          // Fallback if contactId doesn't match mockData keys
           setContact({ 
            id: contactId, 
            name: `Contact ID: ${contactId}`, 
            email: 'N/A', 
            phone: 'N/A', 
            relationship: 'Unknown', 
            avatarUrl: 'https://placehold.co/100x100.png',
            tags: [] 
          });
        }
        setIsLoading(false);
      }, 250); // Short delay for mock fetch
    } else {
      setContact(null); // Handle cases where contactId is not valid
      setIsLoading(false);
    }
  }, [contactId]);

  const handleAdditionalInfoChange = (fieldKey: string, value: string) => {
    setAdditionalInfoData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const toggleSectionEdit = (sectionTitle: string) => {
    setEditingSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
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
        <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const displayName = contact.name || 'Unknown Contact';
  const displayAvatarUrl = contact.avatarUrl || 'https://placehold.co/100x100.png';
  const displayRelationship = contact.relationship || 'N/A';
  const displayTags = Array.isArray(contact.tags) ? contact.tags : [];
  const displayPhone = contact.phone || 'N/A';
  const displayEmail = contact.email || 'N/A';


  return (
    <div className="flex-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] p-6 md:p-8 space-y-6">
      <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={displayAvatarUrl} alt={displayName} data-ai-hint="person" />
              <AvatarFallback className="bg-muted text-xl">
                {(displayName || '??').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{displayRelationship}</Badge>
                {displayTags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-primary">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{displayPhone}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>{displayEmail}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/30">
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="note" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <MessageSquare className="mr-2 h-4 w-4" /> Note
            </TabsTrigger>
            <TabsTrigger value="task" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <ListChecks className="mr-2 h-4 w-4" /> Task
            </TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <CalendarPlus className="mr-2 h-4 w-4" /> Event
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
               <Briefcase className="mr-2 h-4 w-4" /> Opportunity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="note" className="mt-4">
            <div className="space-y-3">
              <Textarea
                placeholder={`Add a note for ${displayName}...`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[100px] bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary rounded-md"
                rows={4}
              />
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" /> Post Note
                </Button>
              </div>
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
          <TabsContent value="activity" className="p-0">
            <ActivityFeed activities={mockActivityFeed} />
          </TabsContent>
          <TabsContent value="email"><p className="text-muted-foreground text-center p-8">Email history will appear here.</p></TabsContent>
          <TabsContent value="accounts"><p className="text-muted-foreground text-center p-8">Related accounts will appear here.</p></TabsContent>
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
                          <Label htmlFor={`${section.title}-${field.key}`} className="text-muted-foreground md:col-span-1">
                            {field.label}
                          </Label>
                          <div className="md:col-span-2">
                            {isEditing ? (
                              field.type === 'select' && field.options ? (
                                <Select
                                  value={additionalInfoData[field.key] === "Not Set" ? undefined : additionalInfoData[field.key]}
                                  onValueChange={(value) => handleAdditionalInfoChange(field.key, value)}
                                >
                                  <SelectTrigger 
                                    id={`${section.title}-${field.key}`}
                                    className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                                  >
                                    <SelectValue placeholder={field.selectPlaceholder || "Select an option"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map(opt => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === 'textarea' ? (
                                <Textarea
                                  id={`${section.title}-${field.key}`}
                                  value={additionalInfoData[field.key] === "Not Set" ? "" : additionalInfoData[field.key]}
                                  onChange={(e) => handleAdditionalInfoChange(field.key, e.target.value)}
                                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                  className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                                  rows={3}
                                />
                              ) : (
                                <Input
                                  id={`${section.title}-${field.key}`}
                                  type={field.type || 'text'}
                                  value={additionalInfoData[field.key] === "Not Set" ? "" : additionalInfoData[field.key]}
                                  onChange={(e) => handleAdditionalInfoChange(field.key, e.target.value)}
                                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                  className="bg-input border-border/50 text-foreground placeholder-muted-foreground focus:ring-primary"
                                />
                              )
                            ) : (
                              <p className="text-foreground text-sm py-2">
                                {additionalInfoData[field.key] || "Not Set"}
                              </p>
                            )}
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
  );
}

    