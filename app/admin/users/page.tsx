"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { useAdminUserStore, AdminUser } from "@/lib/mainwebsite/admin-user-store";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  profilePicture?: string;
  bio?: string;
  location?: string;
  profileVisitors: number;
  preferences: string[];
  stats?: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    comments: number;
  };
}

export default function UsersPage() {
  const router = useRouter();
  const {
    users,
    pagination,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState(""); // Separate state for input value
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Debouncing ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUsers({
      page: currentPage,
      limit: pageSize,
      search: searchQuery,
      sortBy,
      sortOrder,
      role: "USER" // Filter for users with role USER
    });
  }, [fetchUsers, currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
    let updatedUser: Partial<AdminUser> = {};

    switch (actionType) {
      case "activate":
        updatedUser = {
          status: "active"
        };
        message = `User ${selectedUser.name} has been activated`;
        break;
      case "deactivate":
        updatedUser = {
          status: "inactive"
        };
        message = `User ${selectedUser.name} has been deactivated`;
        break;
      case "verify":
        updatedUser = {
          verified: true
        };
        message = `User ${selectedUser.name} has been verified`;
        break;
    }

    if (Object.keys(updatedUser).length > 0) {
      updateUser(selectedUser.id, updatedUser);
      toast.success(message);
    }

    setActionDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchInputChange = (query: string) => {
    // Update input value immediately
    setSearchInputValue(query);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for API call
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleSort = (column: string, order: string) => {
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Map API users to the expected format
  const mappedUsers: User[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.isAdmin ? "admin" : "active", // Use isAdmin to determine status
    joinedAt: u.createdAt,
    lastActive: u.updatedAt,
    verified: false, // Default to false since not in API response
    profilePicture: u.avatar,
    bio: u.bio,
    location: "", // Not in API response
    profileVisitors: 0, // Not in API response
    preferences: [], // Not in API response
    stats: u.stats
  }));

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = column.getIsSorted() === "asc" ? "desc" : "asc";
            handleSort("name", newOrder);
          }}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.profilePicture ? (
            <img 
              src={row.original.profilePicture} 
              alt={row.original.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
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
      accessorKey: "bio",
      header: "Bio",
      cell: ({ row }) => {
        const bio = row.original.bio;
        return (
          <div className="text-sm max-w-[200px]">
            {bio ? (
              <div className="truncate" title={bio}>
                {bio}
              </div>
            ) : (
              <span className="text-muted-foreground">No bio</span>
            )}
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
                : status === "admin"
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
      accessorKey: "stats",
      header: "Activity",
      cell: ({ row }) => {
        const stats = row.original.stats;
        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Followers:</span>
              <span className="font-medium">{stats?.followers || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Following:</span>
              <span className="font-medium">{stats?.following || 0}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = column.getIsSorted() === "asc" ? "desc" : "asc";
            handleSort("createdAt", newOrder);
          }}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {format(new Date(row.original.joinedAt), "PPP")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.status === "inactive" && (
                <DropdownMenuItem onClick={() => handleAction(user, "activate")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}
              {user.status === "active" && (
                <DropdownMenuItem onClick={() => handleAction(user, "deactivate")}>
                  <User className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {!user.verified && (
                <DropdownMenuItem onClick={() => handleAction(user, "verify")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Removed page size selector - DataTable has its own controls */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={mappedUsers}
          searchColumn="name"
          searchPlaceholder="Search users..."
          searchValue={searchInputValue}
          pagination={pagination || undefined}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearchInputChange}
          isLoading={isLoading}
        />
      )}

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
                {selectedUser.profilePicture ? (
                  <img 
                    src={selectedUser.profilePicture} 
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
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

              {selectedUser.stats && (
                <div className="grid grid-cols-5 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Posts</p>
                    <p className="font-medium">{selectedUser.stats.posts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-medium">{selectedUser.stats.followers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Following</p>
                    <p className="font-medium">{selectedUser.stats.following}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Likes</p>
                    <p className="font-medium">{selectedUser.stats.likes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="font-medium">{selectedUser.stats.comments}</p>
                  </div>
                </div>
              )}

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