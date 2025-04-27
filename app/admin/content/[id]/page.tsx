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
import { mockPosts } from "@/lib/mock-data";

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

export default function ContentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundPost = mockPosts.find(p => p.id === params.id);
    if (foundPost) {
      setPost(foundPost);
      setEditedPost(foundPost);
    }
    setIsLoading(false);
  }, [params.id]);

  const handleSave = () => {
    if (editedPost) {
      // In a real app, this would update the post in the database
      setPost(editedPost);
      setIsEditing(false);
      toast.success("Content updated successfully");
    }
  };

  const handleCancel = () => {
    setEditedPost(post);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Post, value: any) => {
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

  if (!post || !editedPost) {
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
                <h3 className="text-lg font-semibold">{post.title}</h3>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Author</p>
              <p className="text-muted-foreground">{post.expertName}</p>
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
                <p className="text-sm font-medium">{post.category}</p>
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
                    post.status === "published"
                      ? "default"
                      : post.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {post.status}
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
                  <p className="whitespace-pre-line">{post.content}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Likes</p>
              <p className="text-2xl font-bold">{post.likes}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Comments</p>
              <p className="text-2xl font-bold">{post.comments}</p>
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
                <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), "PPP")}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm">Status changed to {post.status}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm">Last edited</p>
                <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), "PPP")}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 