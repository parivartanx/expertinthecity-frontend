"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user is authenticated by looking for the cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const isAuth = cookies.some(cookie => cookie.trim().startsWith('isAuthenticated=true'));
      setIsAuthenticated(isAuth);
    };

    checkAuth();
  }, [pathname]);

  // If we're on the login page or not authenticated, don't show the admin layout
  if (pathname === '/admin/login' || !isAuthenticated) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
        <Toaster position="top-right" />
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
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}