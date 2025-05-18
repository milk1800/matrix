
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const rmdClientData = [
  {
    id: "1",
    clientName: "Johnathan 'Johnny' Doe",
    accountType: "Traditional IRA",
    ytdLimitDue: "$5,000 / $7,000",
    progressPercent: 71,
    suggestedMonthly: "$400.00/mo",
    rmdDue: "$12,000 / $6,000",
    daysLeft: 45,
  },
  {
    id: "2",
    clientName: "Alice Wonderland",
    accountType: "401(k)",
    ytdLimitDue: "$7,000 / $7,000",
    progressPercent: 100,
    suggestedMonthly: "N/A",
    rmdDue: "N/A",
    daysLeft: 120,
  },
  {
    id: "3",
    clientName: "Robert 'Robbie' Smith",
    accountType: "Roth IRA",
    ytdLimitDue: "$2,500 / $6,500",
    progressPercent: 38,
    suggestedMonthly: "$500.00/mo",
    rmdDue: "$8,000 / $3,000",
    daysLeft: 15,
  },
  {
    id: "4",
    clientName: "Eleanor Vance",
    accountType: "SEP IRA",
    ytdLimitDue: "$10,000 / $15,000",
    progressPercent: 67,
    suggestedMonthly: "$850.00/mo",
    rmdDue: "$25,000 / $10,000",
    daysLeft: 88,
  },
   {
    id: "5",
    clientName: "Michael 'Mikey' Cho",
    accountType: "Traditional IRA",
    ytdLimitDue: "$3,000 / $7,000",
    progressPercent: 43,
    suggestedMonthly: "$600.00/mo",
    rmdDue: "$15,000 / $7,500",
    daysLeft: 60,
  },
];

// Simulate a larger dataset for "Show More" functionality
const totalClients = 16; // Example total
const initialDisplayCount = rmdClientData.length;
const remainingClients = totalClients - initialDisplayCount;


export default function RMDMatrixPage() {
  // In a real app, this would be stateful and handle loading more clients
  const clientsToDisplay = rmdClientData;

  return (
    <main className="flex-1 p-6 space-y-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">RMD Matrix Dashboard</h1>
      
      <PlaceholderCard title="Client RMD Overview" className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Client Name</TableHead>
              <TableHead className="font-bold">Account Type</TableHead>
              <TableHead className="font-bold whitespace-nowrap">YTD / Limit (Due)</TableHead>
              <TableHead className="font-bold min-w-[150px]">Progress</TableHead>
              <TableHead className="font-bold whitespace-nowrap">Suggested Monthly</TableHead>
              <TableHead className="font-bold whitespace-nowrap">RMD Due</TableHead>
              <TableHead className="font-bold text-center">Days Left</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsToDisplay.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium whitespace-nowrap">{client.clientName}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{client.accountType}</TableCell>
                <TableCell className="whitespace-nowrap">{client.ytdLimitDue}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={client.progressPercent}
                      className={cn(
                        "h-3 flex-grow",
                        client.progressPercent === 100 ? "[&>div]:bg-[hsl(var(--chart-3))]" : "[&>div]:bg-[hsl(var(--chart-4))]"
                      )}
                      aria-label={`Progress ${client.progressPercent}%`}
                    />
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">{client.progressPercent}%</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{client.suggestedMonthly}</TableCell>
                <TableCell className="whitespace-nowrap">{client.rmdDue}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-semibold px-2.5 py-1 text-sm",
                      client.daysLeft < 30 ? "bg-red-500/20 border-red-500/50 text-red-400" : 
                      client.daysLeft < 90 ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" :
                      "bg-green-500/20 border-green-500/50 text-green-400"
                    )}
                  >
                    {client.daysLeft}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {remainingClients > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="rounded-md">
              Show More Clients ({remainingClients} remaining)
            </Button>
          </div>
        )}
      </PlaceholderCard>
    </main>
  );
}
