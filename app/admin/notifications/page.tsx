"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Expert Registration",
      message: "A new expert has registered on the platform",
      type: "info",
      timestamp: "2024-04-28T10:30:00",
      read: false,
    },
    {
      id: "2",
      title: "System Update",
      message: "The system will be updated tomorrow at 2:00 AM",
      type: "warning",
      timestamp: "2024-04-28T09:15:00",
      read: true,
    },
    {
      id: "3",
      title: "New Message",
      message: "You have received a new message from a user",
      type: "info",
      timestamp: "2024-04-28T08:45:00",
      read: false,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <Button variant="outline" onClick={() => {
          setNotifications(notifications.map(n => ({ ...n, read: true })));
          toast.success("All notifications marked as read");
        }}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-75" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription>{notification.message}</CardDescription>
              </div>
              <Badge className={getBadgeColor(notification.type)}>
                {notification.type}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
              <div className="flex gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 