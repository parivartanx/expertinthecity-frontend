"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Users,
  Award,
  FileText,
  AlertTriangle,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { User } from "@/lib/auth";
import { toast } from "sonner";

interface SidebarProps {
  user: User | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingRoute(null);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear authentication cookies
      document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (href: string) => {
    if (pathname === href) return; // Don't reload if already on the page
    setLoadingRoute(href);
    router.push(href);
  };

  const routes = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Experts",
      href: "/admin/experts",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Content",
      href: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-200 lg:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-lg transition-transform duration-200 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center">
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Close Menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-60px)]">
            <div className="space-y-1 py-2">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === route.href
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50 hover:text-secondary-foreground"
                  )}
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleNavigation(route.href);
                  }}
                  disabled={loadingRoute === route.href}
                >
                  {loadingRoute === route.href ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    route.icon
                  )}
                  <span>{route.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block h-screen sticky top-0 border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-14 items-center justify-between border-b px-4">
            {!isCollapsed && (
              <span className="text-lg font-bold">Admin Panel</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(!isCollapsed && "ml-auto")}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Sidebar Links */}
          <ScrollArea className="flex-1 py-3">
            <div className="space-y-1 px-2">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === route.href
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50 hover:text-secondary-foreground",
                    isCollapsed ? "px-2" : "px-4"
                  )}
                  onClick={() => handleNavigation(route.href)}
                  disabled={loadingRoute === route.href}
                >
                  {loadingRoute === route.href ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    route.icon
                  )}
                  {!isCollapsed && <span className="ml-2">{route.title}</span>}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* User Info */}
          {user && (
            <div className="border-t py-4 px-4">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  {user.avatar && (
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                className={cn(
                  "w-full mt-3 justify-start gap-2",
                  isCollapsed && "justify-center"
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {!isCollapsed && "Logging out..."}
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && "Logout"}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}