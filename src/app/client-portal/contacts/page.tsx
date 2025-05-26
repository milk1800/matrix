
"use client";

import * as React from 'react';
import { PlaceholderCard } from '@/components/dashboard/placeholder-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Filter, UserPlus, MoreHorizontal, Tags as TagsIcon, UploadCloud, Search } from 'lucide-react';

// Mock data for contact count for now
const contactCount = 0;

export default function ClientPortalContactsPage() {
  const [activeSort, setActiveSort] = React.useState("Recent");

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5b21b6]/10 to-[#000104] flex-1 p-6 space-y-8 md:p-8">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-auto bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="prospects">Prospects</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">({contactCount} contacts)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Order:</span>
            {["Recent", "Created", "A-Z", "Z-A"].map((sort) => (
              <Button
                key={sort}
                variant={activeSort === sort ? "default" : "ghost"}
                size="sm"
                className={`px-2 py-1 h-auto text-xs ${activeSort === sort ? 'bg-primary/80 text-primary-foreground' : 'hover:bg-muted/50'}`}
                onClick={() => setActiveSort(sort)}
              >
                {sort}
              </Button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Manage Columns</DropdownMenuItem>
              <DropdownMenuItem>Merge Duplicates</DropdownMenuItem>
              <DropdownMenuItem>Recycle Bin</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Contacts Table Card (Left) */}
        <div className="lg:col-span-2">
          <PlaceholderCard title="" className="p-0"> {/* No header title for the card wrapping the table */}
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="select-all-contacts" aria-label="Select all contacts" />
                    <Label htmlFor="select-all-contacts" className="text-sm font-medium text-muted-foreground">Select All</Label>
                 </div>
                 {/* Placeholder for bulk actions if needed */}
                 <Button variant="ghost" size="sm" disabled className="text-xs">Bulk Actions</Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead> {/* For Checkbox */}
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactCount === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No contacts found. Add a new contact to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  // Map over contacts data here when available
                  <></>
                )}
              </TableBody>
            </Table>
             {contactCount > 0 && (
              <div className="p-4 border-t border-border/30 flex justify-end">
                <Select defaultValue="100">
                  <SelectTrigger className="w-[180px] bg-card border-none text-foreground shadow-white-glow-soft hover:shadow-white-glow-hover transition-shadow duration-200 ease-out">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </PlaceholderCard>
        </div>

        {/* Right Column Cards */}
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          <PlaceholderCard
            title="Tags"
            icon={TagsIcon}
            headerActions={
              <Button variant="link" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto">Manage Tags</Button>
            }
          >
            <p className="text-muted-foreground text-sm text-center py-4">You have no tags.</p>
          </PlaceholderCard>

          <PlaceholderCard title="Import / Export" icon={UploadCloud}>
            <div className="space-y-3">
              <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto justify-start w-full">
                Import from CSV, Excel, Outlook...
              </Button>
              <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto justify-start w-full">
                Export filtered contacts to CSV
              </Button>
            </div>
          </PlaceholderCard>
        </div>
      </div>
    </main>
  );
}
