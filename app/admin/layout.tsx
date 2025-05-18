"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col">
          <Header user={user} />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}