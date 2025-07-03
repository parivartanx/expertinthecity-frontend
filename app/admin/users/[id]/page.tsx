"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, CheckCircle, Edit2, Save, X, Loader2, Eye, Tag, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";
import { toast } from "sonner";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const {
    selectedUser,
    isLoading,
    error,
    fetchUserById,
    updateUser,
  } = useAdminUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<typeof selectedUser | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchUserById(params.id as string);
    }
    setIsEditing(false);
  }, [params.id, fetchUserById]);

  useEffect(() => {
    if (selectedUser) {
      setEditedUser(selectedUser);
    }
  }, [selectedUser]);

  const handleSave = async () => {
    if (editedUser) {
      try {
        await updateUser(editedUser.id, editedUser);
        toast.success("User details updated successfully");
        setIsEditing(false);
      } catch (e) {
        toast.error("Failed to update user");
      }
    }
  };

  const handleCancel = () => {
    setEditedUser(selectedUser);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedUser || !editedUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">User not found</p>
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
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
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

      <Tabs defaultValue="profile" className="mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name</p>
                {isEditing ? (
                  <Input
                    value={editedUser.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter user name"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input
                    value={editedUser.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter email address"
                    type="email"
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Role</p>
                {isEditing ? (
                  <Input
                    value={editedUser.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter role"
                  />
                ) : (
                  <p className="text-sm font-medium">{selectedUser.role}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedUser.isAdmin && (
                  <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {isEditing ? (
                <Input
                  value={editedUser.stats?.status || ''}
                  onChange={(e) => handleChange('stats', { ...editedUser.stats, status: e.target.value })}
                />
              ) : (
                <p className="font-medium capitalize">{selectedUser.stats?.status || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              {isEditing ? (
                <Input
                  value={editedUser.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Enter bio"
                />
              ) : (
                <p className="text-muted-foreground">{selectedUser.bio || 'No bio provided'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{format(new Date(selectedUser.createdAt), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{format(new Date(selectedUser.updatedAt), "PPP")}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Total Posts</p>
              <p className="text-2xl font-bold">{selectedUser.stats?.posts ?? 'N/A'}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Comments</p>
              <p className="text-2xl font-bold">{selectedUser.stats?.comments ?? 'N/A'}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Likes</p>
              <p className="text-2xl font-bold">{selectedUser.stats?.likes ?? 'N/A'}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Following</p>
              <p className="text-2xl font-bold">{selectedUser.stats?.following ?? 'N/A'}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center gap-3">
                <Checkbox id="notifications" />
                <label htmlFor="notifications" className="text-sm font-medium">
                  Email Notifications
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center gap-3">
                <Checkbox id="marketing" />
                <label htmlFor="marketing" className="text-sm font-medium">
                  Marketing Emails
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center gap-3">
                <Checkbox id="newsletter" />
                <label htmlFor="newsletter" className="text-sm font-medium">
                  Newsletter Subscription
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline">Reset Settings</Button>
            <Button>Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 