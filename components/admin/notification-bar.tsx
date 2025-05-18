import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationBar() {
  // Mock notification data
  const notifications = [
    { type: "alert", count: 3, label: "Alerts" },
    { type: "success", count: 5, label: "Success" },
    { type: "info", count: 2, label: "Info" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          
          <div className="flex items-center gap-4">
            {notifications.map((notification) => (
              <Button
                key={notification.type}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                {notification.type === "alert" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {notification.type === "success" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {notification.type === "info" && (
                  <Info className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm">{notification.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {notification.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 