"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { mockPosts } from "@/lib/mock-data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, Eye, ThumbsUp, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  expertId: string;
  expertName: string;
  title: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export default function ContentPage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleAction = (post: Post, action: "approve" | "reject" | "delete") => {
    setSelectedPost(post);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleViewPost = (post: Post) => {
    router.push(`/admin/content/${post.id}`);
  };

  const confirmAction = () => {
    if (!selectedPost || !actionType) return;

    let message = "";
    switch (actionType) {
      case "approve":
        message = `Post "${selectedPost.title}" has been approved`;
        break;
      case "reject":
        message = `Post "${selectedPost.title}" has been rejected`;
        break;
      case "delete":
        message = `Post "${selectedPost.title}" has been deleted`;
        break;
    }

    toast.success(message);
    setActionDialogOpen(false);
  };

  // Filter posts based on selected status
  const filteredPosts = mockPosts.filter(post => {
    if (statusFilter === "all") return true;
    return post.status === statusFilter;
  });

  // Table columns definition
  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-muted-foreground">by {row.original.expertName}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "published"
                ? "default"
                : status === "pending"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "engagement",
      header: "Engagement",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.comments}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewPost(post)}>
                View content
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {post.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => handleAction(post, "approve")}>
                    Approve post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(post, "reject")}>
                    Reject post
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={() => handleAction(post, "delete")}
                className="text-destructive focus:text-destructive"
              >
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All content</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending approval</SelectItem>
            <SelectItem value="flagged">Flagged content</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredPosts} 
        searchColumn="title" 
        searchPlaceholder="Search content..." 
      />

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Are you sure you want to approve this post?"}
              {actionType === "reject" && "Are you sure you want to reject this post?"}
              {actionType === "delete" && "Are you sure you want to delete this post? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "delete" ? "destructive" : "default"} 
              onClick={confirmAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}