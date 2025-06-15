"use client";

import { Bell, Calendar, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    icon: <MessageSquare className="text-blue-500 w-5 h-5" />,
    message: "New chat request from Sarah Johnson",
    date: "Apr 15, 2023, 04:00 PM",
  },
  {
    id: 2,
    icon: <Calendar className="text-green-500 w-5 h-5" />,
    message:
      "Your booking with Michael Lee has been confirmed for April 17th at 2:00 PM",
    date: "Apr 14, 2023, 09:15 PM",
  },
  {
    id: 3,
    icon: <Heart className="text-red-500 w-5 h-5" />,
    message: "John Smith commented on your post",
    date: "Apr 13, 2023, 02:45 PM",
  },
  {
    id: 4,
    icon: <MessageSquare className="text-green-500 w-5 h-5" />,
    message: "New chat request from Sarah Johnson",
    date: "Apr 12, 2023, 09:50 PM",
  },
  {
    id: 5,
    icon: <MessageSquare className="text-blue-500 w-5 h-5" />,
    message: "You have a new message from Emily Davis",
    date: "Apr 11, 2023, 07:40 PM",
  },
  {
    id: 6,
    icon: <Calendar className="text-green-500 w-5 h-5" />,
    message:
      "Your session with Chris Wilson has been rescheduled to April 20th at 11:00 AM",
    date: "Apr 11, 2023, 07:40 PM",
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline">Mark all as Read</Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-start justify-between bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              {notif.icon}
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
