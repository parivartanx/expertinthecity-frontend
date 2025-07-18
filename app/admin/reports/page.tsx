"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowUpDown, MoreHorizontal, AlertTriangle, Clock, Flag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useReportStore } from "@/lib/mainwebsite/report-store";

export default function ReportsPage() {
  const {
    adminReports,
    pagination,
    isLoading,
    error,
    adminGetAllReports,
    adminUpdateReport,
    adminDeleteReport,
    adminGetReportById,
    clearError,
    clearSuccess,
  } = useReportStore();

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [resolution, setResolution] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    adminGetAllReports({ status: filter !== "all" ? filter : undefined, page, limit });
  }, [filter, page, limit, adminGetAllReports]);

  const handleAction = (report: any, action: any) => {
    setSelectedReport(report);
    setActionType(action);
    setResolution("");
    setActionDialogOpen(true);
  };

  const handleViewReport = async (report: any) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
    await adminGetReportById(report.id);
  };

  const confirmAction = async () => {
    if (!selectedReport || !actionType) return;
    setActionLoading(true);
    try {
      await adminUpdateReport((selectedReport as any).id, { status: (actionType as any).toUpperCase() });
      toast.success(`Report #${(selectedReport as any).id} has been ${actionType}d`);
      setActionDialogOpen(false);
      adminGetAllReports({ status: filter !== "all" ? filter : undefined, page, limit });
    } catch (e) {
      toast.error("Failed to update report");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (report: any) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setActionLoading(true);
    try {
      await adminDeleteReport(report.id);
      toast.success("Report deleted");
      adminGetAllReports({ status: filter !== "all" ? filter : undefined, page, limit });
    } catch (e) {
      toast.error("Failed to delete report");
    } finally {
      setActionLoading(false);
    }
  };

  // Update columns to use nested fields safely and show post/reporter/reportedUser info
  const columns = [
    {
      accessorKey: "reason",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.reason}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
            {row.original.post?.title && (
              <span className="block font-semibold">Post: {row.original.post.title}</span>
            )}
            {row.original.description?.substring(0, 50)}
            {row.original.description?.length > 50 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "targetType",
      header: "Type",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="capitalize">{row.original.targetType}</span>
        </div>
      ),
    },
    {
      accessorKey: "reportedBy",
      header: "Reporter",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          {row.original.reporter?.avatar && (
            <img src={row.original.reporter.avatar} alt={row.original.reporter.name} className="w-6 h-6 rounded-full" />
          )}
          <span>{row.original.reporter?.name || row.original.reportedBy || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "reportedUser",
      header: "Reported User",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          {row.original.reportedUser?.avatar && (
            <img src={row.original.reportedUser.avatar} alt={row.original.reportedUser.name} className="w-6 h-6 rounded-full" />
          )}
          <span>{row.original.reportedUser?.name || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "pending" ? "secondary" : "default"}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.original.createdAt ? format(new Date(row.original.createdAt), "MMM d, yyyy") : "-"}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const report = row.original;
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
              <DropdownMenuItem onClick={() => handleViewReport(report)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {report.status?.toUpperCase() === "PENDING" && (
                <>
                  <DropdownMenuItem onClick={() => handleAction(report, "resolve")}>Resolve report</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(report, "dismiss")}>Dismiss report</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(report)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
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
        <h1 className="text-3xl font-bold tracking-tight">Reports & Violations</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="high">High priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      <DataTable
        columns={columns}
        data={adminReports}
        searchColumn="reason"
        searchPlaceholder="Search reports..."
        isLoading={isLoading}
      />

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 gap-2 items-center">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="mx-2">
          Page {pagination?.page || 1} of {pagination?.pages || 1}
        </span>
        <Button disabled={page >= (pagination?.pages || 1)} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected report.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Report #{selectedReport.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Reported on {selectedReport.createdAt ? format(new Date(selectedReport.createdAt), "PPP") : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{selectedReport.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <div className="border rounded-md p-3 bg-muted/30 mt-1">
                    <p>{selectedReport.description}</p>
                  </div>
                </div>
                {selectedReport.post && (
                  <div>
                    <p className="text-sm text-muted-foreground">Post</p>
                    <div className="border rounded-md p-3 bg-muted/30 mt-1">
                      <div className="font-semibold">{selectedReport.post.title}</div>
                      <div className="text-xs text-muted-foreground">ID: {selectedReport.post.id}</div>
                      <div className="mt-1">{selectedReport.post.content}</div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reporter</p>
                <div className="flex items-center gap-2">
                  {selectedReport.reporter?.avatar && (
                    <img src={selectedReport.reporter.avatar} alt={selectedReport.reporter.name} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-medium">{selectedReport.reporter?.name || selectedReport.reportedBy || "-"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reported User</p>
                <div className="flex items-center gap-2">
                  {selectedReport.reportedUser?.avatar && (
                    <img src={selectedReport.reportedUser.avatar} alt={selectedReport.reportedUser.name} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-medium">{selectedReport.reportedUser?.name || "-"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Type</p>
                <p className="font-medium capitalize">{selectedReport.targetType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target ID</p>
                <p className="font-medium">{selectedReport.targetId || selectedReport.postId || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={selectedReport.status === "pending" ? "secondary" : "default"}
                  className="mt-1"
                >
                  {selectedReport.status}
                </Badge>
              </div>
              {selectedReport.status === "resolved" && (
                <div>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                  <div className="border rounded-md p-3 bg-muted/30 mt-1">
                    <p>{selectedReport.resolution}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resolved on {selectedReport.resolvedAt ? format(new Date(selectedReport.resolvedAt), "PPP") : "-"}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                {selectedReport.status === "PENDING" && (
                  <>
                    <Button variant="outline" onClick={() => handleAction(selectedReport, "dismiss")}>Dismiss</Button>
                    <Button onClick={() => handleAction(selectedReport, "resolve")}>Resolve</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "resolve" ? "Resolve Report" : "Dismiss Report"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "resolve"
                ? "Are you sure you want to resolve this report?"
                : "Are you sure you want to dismiss this report?"}
            </DialogDescription>
          </DialogHeader>
          {/* Remove Resolution Notes and Actions Taken UI */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction} disabled={actionLoading}>
              {actionType === "resolve" ? "Resolve Report" : "Dismiss Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}