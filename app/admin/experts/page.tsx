"use client";

import { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, Award, CheckCircle, Users, ArrowUpRight, Loader2, Star, Eye } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";

interface Expert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  location?: string | {
    city?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };
  interests: string[];
  tags: string[];
  expertDetails?: {
    id: string;
    userId: string;
    headline?: string;
    summary?: string;
    expertise?: string[];
    experience?: number;
    hourlyRate?: number;
    about?: string;
    availability?: string;
    languages?: string[];
    verified?: boolean;
    badges?: string[];
    progressLevel?: string;
    progressShow?: boolean;
    ratings?: number;
  };
  stats?: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    comments: number;
  };
}

export default function ExpertsPage() {
  const router = useRouter();
  const {
    users,
    pagination,
    fetchUsers,
    updateUser,
    isLoading,
    error,
  } = useAdminUserStore();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "verify" | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
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
      role: "EXPERT"
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

  // Map API users to Expert interface
  const mappedExperts: Expert[] = users
    .filter((u) => u.role === "EXPERT")
    .map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      bio: u.bio,
      avatar: u.avatar,
      status: u.status?.toLowerCase() || "active",
      joinedAt: u.createdAt,
      lastActive: u.updatedAt,
      verified: u.expertDetails?.verified || false,
      location: u.location,
      interests: u.interests || [],
      tags: u.tags || [],
      expertDetails: u.expertDetails,
      stats: u.stats,
    }));

  const handleAction = (expert: Expert, action: "activate" | "deactivate" | "verify") => {
    setSelectedExpert(expert);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleViewExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsNavigating(true);
    router.push(`/admin/experts/${expert.id}`);
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

  const confirmAction = () => {
    if (!selectedExpert || !actionType) return;

    let message = "";
    let updatedExpert: Partial<Expert> | null = null;

    switch (actionType) {
      case "activate":
        updatedExpert = {
          status: "ACTIVE"
        };
        message = `Expert ${selectedExpert.name} has been activated`;
        break;
      case "deactivate":
        updatedExpert = {
          status: "INACTIVE"
        };
        message = `Expert ${selectedExpert.name} has been deactivated`;
        break;
      case "verify":
        updatedExpert = {
          status: "ACTIVE"
        };
        message = `Expert ${selectedExpert.name} has been verified and activated`;
        break;
    }

    if (updatedExpert) {
      // Update via API - cast to AdminUser type for compatibility
      updateUser(selectedExpert.id, updatedExpert as any);
      toast.success(message);
    }

    setActionDialogOpen(false);
  };

  // Table columns definition
  const columns: ColumnDef<Expert>[] = [
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
          {row.original.avatar ? (
            <img 
              src={row.original.avatar} 
              alt={row.original.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div 
              className="font-medium flex items-center gap-1 cursor-pointer hover:text-primary hover:underline transition-colors"
              onClick={() => handleViewExpert(row.original)}
            >
              {row.original.name}
              {row.original.verified && (
                <CheckCircle className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
              )}
              {isNavigating && row.original.id === selectedExpert?.id && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {row.original.email} • {row.original.phone || "No phone"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {typeof row.original.location === 'string' 
                ? row.original.location 
                : row.original.location 
                  ? `${(row.original.location as any).city || ''}, ${(row.original.location as any).country || ''}`.trim() || 'No location'
                  : 'No location'
              }
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "active" || status === "ACTIVE"
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
        accessorKey: "expertise",
        header: "Expertise",
        cell: ({ row }) => {
          const expertise = row.original.expertDetails?.expertise;
          return (
            <div className="text-xs">
              {expertise && expertise.length > 0 ? (
                <div className="flex flex-wrap gap-0.5">
                  {expertise.slice(0, 2).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {expertise.length > 2 && (
                    <span className="text-muted-foreground">+{expertise.length - 2}</span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">No expertise</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "stats",
        header: "Stats",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Followers:</span>
              <span className="font-medium">{row.original.stats?.followers?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Following:</span>
              <span className="font-medium">{row.original.stats?.following?.toLocaleString() || 0}</span>
            </div>
          </div>
        ),
            },
      {
        accessorKey: "progressLevel",
        header: "Level",
        cell: ({ row }) => {
          const level = row.original.expertDetails?.progressLevel;
          return (
            <div className="text-sm">
              <Badge variant="outline">
                {level || "BRONZE"}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const expert = row.original;
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
                <DropdownMenuItem onClick={() => handleViewExpert(expert)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {(expert.status === "inactive" || expert.status === "INACTIVE") && (
                  <DropdownMenuItem onClick={() => handleAction(expert, "activate")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </DropdownMenuItem>
                )}
                {(expert.status === "active" || expert.status === "ACTIVE") && (
                  <DropdownMenuItem onClick={() => handleAction(expert, "deactivate")}>
                    <Award className="mr-2 h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>
                )}
                {!expert.verified && (
                  <DropdownMenuItem onClick={() => handleAction(expert, "verify")}>
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
        <h1 className="text-3xl font-bold tracking-tight">Expert Management</h1>
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
          data={mappedExperts} 
          searchColumn="name" 
          searchPlaceholder="Search experts..."
          searchValue={searchInputValue}
          pagination={pagination || undefined}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearchInputChange}
          isLoading={isLoading}
        />
      )}

      {/* View Expert Dialog */}
      {selectedExpert && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Expert Profile</DialogTitle>
              <DialogDescription>
                Detailed information about the selected expert.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="profile" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-lg font-semibold">{selectedExpert.name}</h3>
                      {selectedExpert.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{selectedExpert.email}</p>
                    <p className="text-sm font-medium mt-1">{selectedExpert.expertDetails?.headline || "No headline"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedExpert.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-medium">{selectedExpert.stats?.followers?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{format(new Date(selectedExpert.joinedAt), "PPP")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="font-medium">{format(new Date(selectedExpert.lastActive), "PPP")}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Progress Level</p>
                  <p className="font-medium">{selectedExpert.expertDetails?.progressLevel || "BRONZE"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{selectedExpert.expertDetails?.experience ? `${selectedExpert.expertDetails.experience} years` : "Not specified"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedExpert.expertDetails?.expertise?.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    )) || <span className="text-muted-foreground text-sm">No expertise listed</span>}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Total Posts</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Avg. Engagement</p>
                    <p className="text-2xl font-bold">13.5%</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Chats Completed</p>
                    <p className="text-2xl font-bold">142</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Satisfaction Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                </div>

                <div className="border rounded-md p-4 mt-4">
                  <p className="text-sm font-medium mb-3">Latest Activity</p>
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="text-sm">Posted "Winter Fashion Trends 2023"</p>
                      <p className="text-xs text-muted-foreground">Nov 5, 2023</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="text-sm">Completed chat with user #1058</p>
                      <p className="text-xs text-muted-foreground">Nov 3, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm">Updated profile information</p>
                      <p className="text-xs text-muted-foreground">Oct 28, 2023</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="mt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id="doc1" />
                      <label htmlFor="doc1" className="text-sm font-medium">
                        Resume.pdf
                      </label>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id="doc2" />
                      <label htmlFor="doc2" className="text-sm font-medium">
                        Certificate_Fashion_Design.pdf
                      </label>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id="doc3" />
                      <label htmlFor="doc3" className="text-sm font-medium">
                        ID_Verification.jpg
                      </label>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline">Reject Documents</Button>
                  <Button>Approve Documents</Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionType === "activate" && "Are you sure you want to activate this expert?"}
              {actionType === "deactivate" && "Are you sure you want to deactivate this expert?"}
              {actionType === "verify" && "Are you sure you want to verify this expert?"}
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