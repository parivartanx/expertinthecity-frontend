"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Loader2, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAdminNotificationsStore } from "@/lib/mainwebsite/admin-notifications-store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NotificationsPage() {
  const {
    notifications,
    pagination,
    isLoading,
    error,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    bulkMarkAsRead,
    bulkDeleteNotifications,
    clearError,
  } = useAdminNotificationsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: "OTHER" as const,
    content: "",
    recipientId: "",
    senderId: "",
  });

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications({
      page: currentPage,
      limit: 20,
      search: searchTerm || undefined,
      type: typeFilter === "all" ? undefined : typeFilter || undefined,
      read: readFilter === "true" ? true : readFilter === "false" ? false : undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, [currentPage, searchTerm, typeFilter, readFilter]);

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateNotification(id, { read: true });
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) {
      toast.info("No notifications to mark as read");
      return;
    }

    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) {
        toast.info("All notifications are already read");
        return;
      }

      await bulkMarkAsRead(unreadIds);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      toast.info("Please select notifications to delete");
      return;
    }

    try {
      await bulkDeleteNotifications(selectedNotifications);
      setSelectedNotifications([]);
      toast.success("Selected notifications deleted");
    } catch (error) {
      toast.error("Failed to delete selected notifications");
    }
  };

  const handleCreateNotification = async () => {
    if (!newNotification.content || !newNotification.recipientId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createNotification(newNotification);
      setIsCreateDialogOpen(false);
      setNewNotification({
        type: "OTHER",
        content: "",
        recipientId: "",
        senderId: "",
      });
      toast.success("Notification created successfully");
    } catch (error) {
      toast.error("Failed to create notification");
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "FOLLOW":
        return "bg-blue-500";
      case "LIKE":
        return "bg-pink-500";
      case "COMMENT":
        return "bg-green-500";
      case "MESSAGE":
        return "bg-purple-500";
      case "MESSAGE_SCHEDULE":
        return "bg-orange-500";
      case "BADGE_EARNED":
        return "bg-yellow-500";
      case "SUGGESTION":
        return "bg-indigo-500";
      case "OTHER":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Admin Notifications</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Create a new notification for a user.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) =>
                      setNewNotification(prev => ({ ...prev, type: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOLLOW">Follow</SelectItem>
                      <SelectItem value="LIKE">Like</SelectItem>
                      <SelectItem value="COMMENT">Comment</SelectItem>
                      <SelectItem value="MESSAGE">Message</SelectItem>
                      <SelectItem value="MESSAGE_SCHEDULE">Message Schedule</SelectItem>
                      <SelectItem value="BADGE_EARNED">Badge Earned</SelectItem>
                      <SelectItem value="SUGGESTION">Suggestion</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNotification.content}
                    onChange={(e) =>
                      setNewNotification(prev => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Enter notification content..."
                  />
                </div>
                <div>
                  <Label htmlFor="recipientId">Recipient ID</Label>
                  <Input
                    id="recipientId"
                    value={newNotification.recipientId}
                    onChange={(e) =>
                      setNewNotification(prev => ({ ...prev, recipientId: e.target.value }))
                    }
                    placeholder="Enter recipient user ID"
                  />
                </div>
                <div>
                  <Label htmlFor="senderId">Sender ID (Optional)</Label>
                  <Input
                    id="senderId"
                    value={newNotification.senderId}
                    onChange={(e) =>
                      setNewNotification(prev => ({ ...prev, senderId: e.target.value }))
                    }
                    placeholder="Enter sender user ID"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FOLLOW">Follow</SelectItem>
            <SelectItem value="LIKE">Like</SelectItem>
            <SelectItem value="COMMENT">Comment</SelectItem>
            <SelectItem value="MESSAGE">Message</SelectItem>
            <SelectItem value="MESSAGE_SCHEDULE">Message Schedule</SelectItem>
            <SelectItem value="BADGE_EARNED">Badge Earned</SelectItem>
            <SelectItem value="SUGGESTION">Suggestion</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Unread</SelectItem>
            <SelectItem value="true">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedNotifications.length} notification(s) selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              bulkMarkAsRead(selectedNotifications);
              setSelectedNotifications([]);
            }}
          >
            Mark Selected as Read
          </Button>
        </div>
      )}

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${notification.read ? "opacity-75" : ""} ${
                selectedNotifications.includes(notification.id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="rounded"
                  />
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {notification.type === "FOLLOW" && `${notification.sender?.name || "Unknown"} followed ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "LIKE" && `${notification.sender?.name || "Unknown"} liked a post by ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "COMMENT" && `${notification.sender?.name || "Unknown"} commented on a post by ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "MESSAGE" && `${notification.sender?.name || "Unknown"} sent a message to ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "MESSAGE_SCHEDULE" && `Message scheduled from ${notification.sender?.name || "Unknown"} to ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "BADGE_EARNED" && `${notification.recipient?.name || "Unknown"} earned a badge`}
                      {notification.type === "SUGGESTION" && `Suggestion from ${notification.sender?.name || "Unknown"} to ${notification.recipient?.name || "Unknown"}`}
                      {notification.type === "OTHER" && notification.content}
                    </CardTitle>
                    <CardDescription>
                      From: {notification.sender?.name || "System"} | 
                      To: {notification.recipient?.name || "Unknown"}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getBadgeColor(notification.type)}>
                  {notification.type}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </span>
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.total)} of {pagination.total} notifications
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pagination.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 