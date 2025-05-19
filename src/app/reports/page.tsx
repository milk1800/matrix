
import { FileText, Download, Settings } from 'lucide-react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReportsPage() {
  const sampleReports = [
    { id: 'RPT001', name: 'Q3 Financial Summary', date: '2024-09-30', status: 'Generated' },
    { id: 'RPT002', name: 'Annual Client Activity', date: '2024-12-31', status: 'Pending' },
    { id: 'RPT003', name: 'Asset Performance Review', date: '2024-10-15', status: 'Generated' },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <Button>
          <Settings className="mr-2 h-4 w-4" /> Configure Reports
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Generated Reports"
          value="125"
          description="This year"
          icon={FileText}
        />
        <PlaceholderCard
          title="Scheduled Reports"
          value="15"
          description="Pending generation"
          icon={Download}
        />
        <PlaceholderCard
          title="Custom Templates"
          value="22"
          description="Available for use"
          icon={Settings}
        />
      </div>

      <PlaceholderCard title="Recent Reports">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'Generated' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {report.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" /> Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PlaceholderCard>
    </main>
  );
}
