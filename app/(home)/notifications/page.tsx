"use client";

import { useEffect } from "react";
import { Bell, Calendar, Heart, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/lib/mainwebsite/notifications-store";

export default function NotificationsPage() {
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  } = useNotificationsStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark all as Read
        </Button>
      </div>
      <div className="space-y-3">
        {!isLoading && notifications.length === 0 && (
          <div className="text-gray-500">No notifications found.</div>
        )}
        {notifications.length > 0 &&
          notifications.map((notif: any) => (
            <div
              key={notif.id}
              className={`flex items-start justify-between p-4 rounded-lg border border-gray-200 ${notif.isRead ? "bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
                }`}
            >
              <div className="flex items-start space-x-3">
                {/* You can map notif.type to an icon if you want */}
                <Bell className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {typeof notif.message === "string"
                      ? notif.message
                      : notif.message && typeof notif.message.message === "string"
                        ? notif.message.message
                        : JSON.stringify(notif.message)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notif.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
