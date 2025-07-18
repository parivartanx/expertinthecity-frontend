"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MoonIcon, SunIcon, BellIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "@/lib/mainwebsite/admin-user-store";
import { useAdminNotificationsStore } from "@/lib/mainwebsite/admin-notifications-store";

interface HeaderProps {
  user: AdminUser | null;
};

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Use admin notifications store
  const {
    notifications,
    fetchNotifications,
    updateNotification,
    bulkMarkAsRead,
    isLoading,
  } = useAdminNotificationsStore();

  // Fetch notifications on mount (only first page, limit 5 for performance)
  useEffect(() => {
    setMounted(true);
    if (notifications.length === 0) {
      fetchNotifications({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
    }
  }, []);

  // Compute unread count and recent notifications
  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 2);

  // Mark all as read handler
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      await bulkMarkAsRead(unreadIds);
    }
  };

  // Notification text logic (copied from notifications page)
  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case "FOLLOW":
        return `${notification.sender?.name || "Unknown"} followed ${notification.recipient?.name || "Unknown"}`;
      case "LIKE":
        return `${notification.sender?.name || "Unknown"} liked a post by ${notification.recipient?.name || "Unknown"}`;
      case "COMMENT":
        return `${notification.sender?.name || "Unknown"} commented on a post by ${notification.recipient?.name || "Unknown"}`;
      case "MESSAGE":
        return `${notification.sender?.name || "Unknown"} sent a message to ${notification.recipient?.name || "Unknown"}`;
      case "MESSAGE_SCHEDULE":
        return `Message scheduled from ${notification.sender?.name || "Unknown"} to ${notification.recipient?.name || "Unknown"}`;
      case "BADGE_EARNED":
        return `${notification.recipient?.name || "Unknown"} earned a badge`;
      case "SUGGESTION":
        return `Suggestion from ${notification.sender?.name || "Unknown"} to ${notification.recipient?.name || "Unknown"}`;
      case "OTHER":
      default:
        return notification.content;
    }
  };

  // Generate page title based on current route
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    
    const path = pathname.split("/").filter(Boolean);
    if (path.length < 2) return "Dashboard";
    
    // Convert the last segment to title case
    const lastSegment = path[path.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

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
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={isLoading || unreadCount === 0}>
                Mark all as read
              </Button>
            </div>
            <div className="max-h-96 overflow-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer p-3 focus:bg-accent">
                    <div className="flex items-start gap-2">
                      {!notification.read && (
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                      )}
                      <span className={`text-sm ${notification.read ? 'text-muted-foreground' : ''}`}>
                        {getNotificationText(notification)}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => router.push('/admin/notifications')}
              >
                Show More
                <ArrowRight className="h-4 w-4" />
              </Button>
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
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
