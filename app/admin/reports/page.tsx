"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { mockReports } from "@/lib/mock-data";
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
import { ArrowUpDown, MoreHorizontal, AlertTriangle, Clock, Flag } from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  targetType: string;
  targetId: string;
  targetParentId?: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  priority: string;
  resolvedAt?: string;
  resolution?: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"resolve" | "dismiss" | null>(null);
  const [resolution, setResolution] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const handleAction = (report: Report, action: "resolve" | "dismiss") => {
    setSelectedReport(report);
    setActionType(action);
    setResolution("");
    setActionDialogOpen(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedReport || !actionType) return;

    let message = "";
    switch (actionType) {
      case "resolve":
        message = `Report #${selectedReport.id} has been resolved`;
        break;
      case "dismiss":
        message = `Report #${selectedReport.id} has been dismissed`;
        break;
    }

    toast.success(message);
    setActionDialogOpen(false);
  };

  // Function to get the priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Table columns definition
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "reason",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Report
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.reason}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
            {row.original.description.substring(0, 50)}
            {row.original.description.length > 50 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "targetType",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="capitalize">{row.original.targetType}</span>
        </div>
      ),
    },
    {
      accessorKey: "reportedBy",
      header: "Reported By",
      cell: ({ row }) => row.original.reportedBy,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "pending" ? "secondary" : "default"}
          >
            {status}
          </Badge>
        );
      },
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
              {report.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => handleAction(report, "resolve")}>
                    Resolve report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(report, "dismiss")}>
                    Dismiss report
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filter reports based on selected filter
  const filteredReports = mockReports.filter((report) => {
    switch (filter) {
      case "pending":
        return report.status === "pending";
      case "resolved":
        return report.status === "resolved";
      case "high":
        return report.priority === "high";
      default:
        return true; // Show all reports
    }
  });

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

      <DataTable 
        columns={columns} 
        data={filteredReports} 
        searchColumn="reason" 
        searchPlaceholder="Search reports..." 
      />

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                    Reported on {format(new Date(selectedReport.createdAt), "PPP")}
                  </p>
                </div>
                {getPriorityBadge(selectedReport.priority)}
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p className="font-medium">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Type</p>
                  <p className="font-medium capitalize">{selectedReport.targetType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target ID</p>
                  <p className="font-medium">{selectedReport.targetId}</p>
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
              </div>
              
              {selectedReport.status === "resolved" && (
                <div>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                  <div className="border rounded-md p-3 bg-muted/30 mt-1">
                    <p>{selectedReport.resolution}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resolved on {format(new Date(selectedReport.resolvedAt!), "PPP")}
                  </p>
                </div>
              )}
              
              {selectedReport.status === "pending" && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => handleAction(selectedReport, "dismiss")}>
                    Dismiss
                  </Button>
                  <Button onClick={() => handleAction(selectedReport, "resolve")}>
                    Resolve
                  </Button>
                </div>
              )}
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
                ? "Please provide details on how this report was resolved."
                : "Please provide a reason for dismissing this report."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Resolution Notes</p>
              <Textarea
                placeholder="Enter details about the action taken..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
            
            {actionType === "resolve" && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Actions Taken</p>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action taken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No action required</SelectItem>
                    <SelectItem value="content_removed">Content removed</SelectItem>
                    <SelectItem value="content_edited">Content edited</SelectItem>
                    <SelectItem value="user_warned">User warned</SelectItem>
                    <SelectItem value="user_suspended">User suspended</SelectItem>
                    <SelectItem value="user_banned">User banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              {actionType === "resolve" ? "Resolve Report" : "Dismiss Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}