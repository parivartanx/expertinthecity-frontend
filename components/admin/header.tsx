"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/auth";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; text: string; read: boolean }[]>([
    { id: "1", text: "New report submitted: Inappropriate content", read: false },
    { id: "2", text: "New expert application pending review", read: false },
    { id: "3", text: "System alert: Daily backup completed", read: true },
  ]);

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate page title based on current route
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    
    const path = pathname.split("/").filter(Boolean);
    if (path.length < 2) return "Dashboard";
    
    // Convert the last segment to title case
    const lastSegment = path[path.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!mounted) {
    return (
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <div className="flex items-center space-x-2">
          {/* Placeholder for theme toggle */}
          <div className="h-9 w-9 rounded-md bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4">
      <h1 className="text-xl font-semibold">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm font-medium">Notifications</span>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
            <div className="max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer p-3 focus:bg-accent">
                    <div className="flex items-start gap-2">
                      {!notification.read && (
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                      )}
                      <span className={`text-sm ${notification.read ? 'text-muted-foreground' : ''}`}>
                        {notification.text}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switch */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}