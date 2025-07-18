"use client"
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Toaster } from "@/components/ui/sonner";
import { useAdminAuthStore } from "@/lib/mainwebsite/auth-store";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAdminAuthStore();

  // If we're on the login page or not authenticated, don't show the admin layout
  if (pathname === '/admin/login' || !isAuthenticated) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
        {/* <Toaster position="top-right" /> Removed to prevent duplicate toasts */}
      </ThemeProvider>
    );
  }

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
      {/* <Toaster position="top-right" /> Removed to prevent duplicate toasts */}
    </ThemeProvider>
  );
}