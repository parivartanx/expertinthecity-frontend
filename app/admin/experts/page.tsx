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
  category: string;
  status: string;
  profileCompletion: number;
  followers: number;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  experience: string;
  skills: string[];
  featured: boolean;
  rating: number;
  profileVisitors: number;
}

export default function ExpertsPage() {
  const router = useRouter();
  const {
    users,
    fetchUsers,
    updateUser,
    isLoading,
    error,
  } = useAdminUserStore();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "verify" | "feature" | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    fetchUsers({ role: "EXPERT" });
  }, [fetchUsers]);

  // Map API users to Expert interface
  const mappedExperts: Expert[] = users
    .filter((u) => u.role === "EXPERT")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      category: u.expertDetails?.category || "",
      status: (u as any).status || "active",
      profileCompletion: u.expertDetails?.profileCompletion || 0,
      followers: u.stats?.followers || 0,
      joinedAt: u.createdAt || "",
      lastActive: u.updatedAt || "",
      verified: (u as any).verified ?? false,
      experience: u.expertDetails?.experience || "",
      skills: u.expertDetails?.skills || [],
      featured: u.expertDetails?.featured || false,
      rating: u.stats?.rating || 0,
      profileVisitors: u.stats?.profileVisitors || 0,
    }));

  const handleAction = (expert: Expert, action: "activate" | "deactivate" | "verify" | "feature") => {
    setSelectedExpert(expert);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleViewExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsNavigating(true);
    router.push(`/admin/experts/${expert.id}`);
  };

  const confirmAction = () => {
    if (!selectedExpert || !actionType) return;

    let message = "";
    let updatedExpert: Partial<Expert> | null = null;

    switch (actionType) {
      case "activate":
        updatedExpert = {
          ...selectedExpert,
          status: "active"
        };
        message = `Expert ${selectedExpert.name} has been activated`;
        break;
      case "deactivate":
        updatedExpert = {
          ...selectedExpert,
          status: "inactive",
          featured: false // Remove from featured when deactivated
        };
        message = `Expert ${selectedExpert.name} has been deactivated and removed from featured`;
        break;
      case "verify":
        updatedExpert = {
          ...selectedExpert,
          verified: true
        };
        message = `Expert ${selectedExpert.name} has been verified`;
        break;
      case "feature":
        updatedExpert = {
          ...selectedExpert,
          featured: !selectedExpert.featured
        };
        message = `Expert ${selectedExpert.name} has been ${selectedExpert.featured ? 'removed from' : 'added to'} featured experts`;
        break;
    }

    if (updatedExpert) {
      // Update via API
      updateUser(selectedExpert.id, updatedExpert);
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
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
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
            <div className="text-sm text-muted-foreground">{row.original.category}</div>
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
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.original.experience}
          </div>
        );
      },
    },
    {
      accessorKey: "skills",
      header: "Skills",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "followers",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Followers
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.original.followers.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{row.original.rating.toFixed(1)}</span>
        </div>
      ),
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
      accessorKey: "profileCompletion",
      header: "Profile",
      cell: ({ row }) => {
        const completion = row.original.profileCompletion;
        return (
          <div className="w-24">
            <div className="flex justify-between mb-1 text-xs">
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Expert Management</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={mappedExperts} 
        searchColumn="name" 
        searchPlaceholder="Search experts..." 
      />

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
                    <p className="text-sm font-medium mt-1">{selectedExpert.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedExpert.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-medium">{selectedExpert.followers.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">Profile Completion</p>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{selectedExpert.profileCompletion}%</span>
                  </div>
                  <Progress value={selectedExpert.profileCompletion} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{selectedExpert.experience}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedExpert.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
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
              {actionType === "feature" && selectedExpert?.featured
                ? "Are you sure you want to remove this expert from featured?"
                : "Are you sure you want to add this expert to featured?"}
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