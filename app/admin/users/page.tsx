"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, User, CheckCircle, Users, ArrowUpRight, Eye, Tag } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  chatHistory: {
    id: string;
    expertId: string;
    expertName: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  }[];
  verified: boolean;
  profilePicture?: string;
  bio?: string;
  location?: string;
  profileVisitors: number;
  preferences: string[];
}

export default function UsersPage() {
  const router = useRouter();
  const {
    users,
    fetchUsers,
    updateUser,
    deleteUser,
    isLoading,
    error,
  } = useAdminUserStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "verify" | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = (user: User, action: "activate" | "deactivate" | "verify") => {
    setSelectedUser(user);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;

    let message = "";
    let updatedUser: User | null = null;

    switch (actionType) {
      case "activate":
        updatedUser = {
          ...selectedUser,
          status: "active",
          chatHistory: selectedUser.chatHistory || []
        };
        message = `User ${selectedUser.name} has been activated`;
        break;
      case "deactivate":
        updatedUser = {
          ...selectedUser,
          status: "inactive",
          chatHistory: selectedUser.chatHistory || []
        };
        message = `User ${selectedUser.name} has been deactivated`;
        break;
      case "verify":
        updatedUser = {
          ...selectedUser,
          verified: true,
          chatHistory: selectedUser.chatHistory || []
        };
        message = `User ${selectedUser.name} has been verified`;
        break;
    }

    if (updatedUser) {
      updateUser(updatedUser.id, updatedUser);
      toast.success(message);
    }

    setActionDialogOpen(false);
  };

  const mappedUsers: User[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: (u as any).status || "active",
    joinedAt: (u as any).createdAt || "",
    lastActive: (u as any).updatedAt || "",
    chatHistory: [],
    verified: (u as any).verified ?? false,
    profilePicture: u.avatar,
    bio: u.bio,
    location: (u as any).location || "",
    profileVisitors: (u as any).profileVisitors || 0,
    preferences: (u as any).preferences || [],
  }));

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div
              className="font-medium flex items-center gap-1 cursor-pointer hover:text-primary hover:underline transition-colors"
              onClick={() => handleViewUser(row.original)}
            >
              {row.original.name}
              {row.original.verified && (
                <CheckCircle className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.original.role}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "pending"
                  ? "secondary"
                  : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.original.location || 'Not specified'}
          </div>
        );
      },
    },
    {
      accessorKey: "profileVisitors",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profile Visitors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.original.profileVisitors.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "preferences",
      header: "Preferences",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.preferences.map((preference, index) => (
              <Badge key={index} variant="secondary">
                {preference}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {format(new Date(row.original.joinedAt), "PPP")}
          </div>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <DataTable
        columns={columns}
        data={mappedUsers}
        searchColumn="name"
        searchPlaceholder="Search users..."
      />

      {/* View User Dialog */}
      {selectedUser && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Detailed information about the selected user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    {selectedUser.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <p className="text-sm font-medium mt-1">{selectedUser.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedUser.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedUser.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{format(new Date(selectedUser.joinedAt), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">{format(new Date(selectedUser.lastActive), "PPP")}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Bio</p>
                <p className="text-muted-foreground">{selectedUser.bio || 'No bio provided'}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionType === "activate" && "Are you sure you want to activate this user?"}
              {actionType === "deactivate" && "Are you sure you want to deactivate this user?"}
              {actionType === "verify" && "Are you sure you want to verify this user?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}