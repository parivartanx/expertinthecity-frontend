"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, ThumbsUp, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { useAdminContentStore } from "@/lib/mainwebsite/admin-content-store";

export default function ContentPage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    posts,
    isLoading,
    error,
    fetchPosts,
    deletePost,
    clearError,
    pagination,
  } = useAdminContentStore();

  // Fetch posts on mount and when filters/search/page/limit change
  useEffect(() => {
    fetchPosts({
      page: currentPage,
      limit: pageSize,
      search: search || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchWithDebounce = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    []
  );

  const handleAction = (post: any, action: "approve" | "reject" | "delete") => {
    setSelectedPost(post);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleViewPost = (post: any) => {
    router.push(`/admin/content/${post.id}`);
  };

  const confirmAction = async () => {
    if (!selectedPost || !actionType) return;
    let message = "";
    if (actionType === "delete") {
      await deletePost(selectedPost.id);
      message = `Post "${selectedPost.title}" has been deleted`;
    } else if (actionType === "approve") {
      // Implement approve logic here (e.g., updatePost with status)
      message = `Post "${selectedPost.title}" has been approved`;
    } else if (actionType === "reject") {
      // Implement reject logic here (e.g., updatePost with status)
      message = `Post "${selectedPost.title}" has been rejected`;
    }
    toast.success(message);
    setActionDialogOpen(false);
  };

  // Table columns definition
  const columns: ColumnDef<any>[] = [
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
        <div className="flex gap-2 items-center">
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
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={e => handleSearchWithDebounce(e.target.value)}
            className="input input-bordered w-[200px]"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-muted-foreground mb-2">Loading...</div>
      )}
      {error && (
        <div className="text-red-500 mb-2">
          {error} <Button variant="link" onClick={clearError}>Clear</Button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={posts.filter(post => statusFilter === "all" ? true : post.status === statusFilter)}
        searchColumn="title"
        searchPlaceholder="Search content..."
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
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
              disabled={isLoading}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}