import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNavItems } from '@/components/layout/sidebar-nav-items';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sanctuary Matrix Dashboard',
  description: 'Advanced Analytics Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Ensure dark class if needed by some components, though theme is dark by default */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <Sidebar
            collapsible="none"
            className="shadow-[4px_0px_20px_0px_rgba(114,0,255,0.2)]" // Updated soft purple glow on right edge
          >
            <SidebarHeader className="p-4 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 animate-pulse-glow">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#a78bfa" className="w-full h-full">
                    <path d="M12 3C8.686 3 6 5.686 6 9C6 10.481 6.444 11.844 7.209 12.949C7.073 13.3 7 13.638 7 14C7 16.209 8.791 18 11 18V21H13V18C15.209 18 17 16.209 17 14C17 13.638 16.927 13.3 16.791 12.949C17.556 11.844 18 10.481 18 9C18 5.686 15.314 3 12 3ZM8 9C8 6.791 9.791 5 12 5C14.209 5 16 6.791 16 9C16 10.813 14.908 12.347 13.349 12.861C13.131 13.483 13 14.251 13 15H11C11 14.251 10.869 13.483 10.651 12.861C9.092 12.347 8 10.813 8 9Z" />
                    <path d="M11.5 10.5A0.5 0.5 0 0011 11V12A0.5 0.5 0 0011.5 12.5H12.5A0.5 0.5 0 0013 12V11A0.5 0.5 0 0012.5 10.5H11.5Z" />
                    <path d="M9.5 7.5A0.5 0.5 0 009 8V9A0.5 0.5 0 009.5 9.5H10.5A0.5 0.5 0 0011 9V8A0.5 0.5 0 0010.5 7.5H9.5Z" />
                    <path d="M13.5 7.5A0.5 0.5 0 0013 8V9A0.5 0.5 0 0013.5 9.5H14.5A0.5 0.5 0 0015 9V8A0.5 0.5 0 0014.5 7.5H13.5Z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-primary">Sanctuary Matrix</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavItems />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
