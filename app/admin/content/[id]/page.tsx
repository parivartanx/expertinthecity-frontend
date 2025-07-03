"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Edit2, X, Save, ThumbsUp, MessageSquare, Clock, FileText } from "lucide-react";
import { useAdminContentStore, AdminContentPost } from "@/lib/mainwebsite/admin-content-store";

export default function ContentDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // Get store state and actions
  const {
    selectedPost,
    isLoading,
    error,
    fetchPostById,
    updatePost,
  } = useAdminContentStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<AdminContentPost | null>(null);

  // Fetch post on mount or when id changes
  useEffect(() => {
    if (params.id) {
      fetchPostById(params.id as string);
    }
  }, [params.id, fetchPostById]);

  // Sync editedPost with selectedPost
  useEffect(() => {
    setEditedPost(selectedPost);
  }, [selectedPost]);

  const handleSave = async () => {
    if (editedPost) {
      await updatePost(editedPost.id, editedPost);
      setIsEditing(false);
      toast.success("Content updated successfully");
    }
  };

  const handleCancel = () => {
    setEditedPost(selectedPost);
    setIsEditing(false);
  };

  const handleChange = (field: keyof AdminContentPost, value: any) => {
    if (editedPost) {
      setEditedPost({
        ...editedPost,
        [field]: value
      });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (editedPost) {
      setEditedPost({
        ...editedPost,
        status: newStatus
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading content details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedPost || !editedPost) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Content not found</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Content Details</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Content
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Title</p>
              {isEditing ? (
                <Input
                  value={editedPost.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full max-w-md"
                  placeholder="Enter content title"
                />
              ) : (
                <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Author</p>
              <p className="text-muted-foreground">{selectedPost.expertName}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Category</p>
              {isEditing ? (
                <Input
                  value={editedPost.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full max-w-md"
                  placeholder="Enter category"
                />
              ) : (
                <p className="text-sm font-medium">{selectedPost.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              {isEditing ? (
                <select
                  value={editedPost.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
              ) : (
                <Badge
                  variant={
                    selectedPost.status === "published"
                      ? "default"
                      : selectedPost.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {selectedPost.status}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Content</p>
              {isEditing ? (
                <textarea
                  value={editedPost.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full h-40 rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter content"
                />
              ) : (
                <div className="border rounded-md p-4 bg-muted/30">
                  <p className="whitespace-pre-line">{selectedPost.content}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Likes</p>
              <p className="text-2xl font-bold">{selectedPost.likes}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Comments</p>
              <p className="text-2xl font-bold">{selectedPost.comments}</p>
            </div>
          </div>

          <div className="border rounded-md p-4 mt-4">
            <p className="text-sm font-medium mb-3">Recent Comments</p>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm">"Great article! Very informative."</p>
                <p className="text-xs text-muted-foreground">By John Doe • Nov 5, 2023</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm">"I learned a lot from this. Thanks for sharing!"</p>
                <p className="text-xs text-muted-foreground">By Jane Smith • Nov 4, 2023</p>
              </div>
              <div>
                <p className="text-sm">"Could you elaborate more on the second point?"</p>
                <p className="text-xs text-muted-foreground">By Mike Johnson • Nov 3, 2023</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4">
          <div className="border rounded-md p-4">
            <p className="text-sm font-medium mb-3">Content History</p>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm">Content created</p>
                <p className="text-xs text-muted-foreground">{format(new Date(selectedPost.createdAt), "PPP")}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm">Status changed to {selectedPost.status}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(selectedPost.createdAt), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm">Last edited</p>
                <p className="text-xs text-muted-foreground">{format(new Date(selectedPost.createdAt), "PPP")}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 