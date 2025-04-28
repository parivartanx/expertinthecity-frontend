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
import { useUsers } from "@/lib/contexts/users-context";
import { toast } from "sonner";

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
  chatHistory: {
    id: string;
    expertId: string;
    expertName: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  }[];
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { users, updateUser } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundUser = users.find(u => u.id === params.id);
    if (foundUser) {
      setUser(foundUser);
      setEditedUser(foundUser);
    }
    setIsLoading(false);
  }, [params.id, users]);

  const handleSave = () => {
    if (editedUser) {
      const updatedUser = {
        ...editedUser,
        chatHistory: editedUser.chatHistory.map(chat => ({
          ...chat,
          expertId: chat.expertId || `expert-${chat.id}`
        }))
      };
      updateUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("User details updated successfully");
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
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

  if (!user || !editedUser) {
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
          <TabsTrigger value="chats">Chat History</TabsTrigger>
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
                  <h3 className="text-lg font-semibold">{user.name}</h3>
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
                  <p className="text-muted-foreground">{user.email}</p>
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
                  <p className="text-sm font-medium">{user.role}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {user.verified && (
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
                  value={editedUser.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                />
              ) : (
                <p className="font-medium capitalize">{user.status}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              {isEditing ? (
                <Input
                  value={editedUser.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter location"
                />
              ) : (
                <p className="font-medium">{user.location || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile Visitors</p>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="font-medium">{user.profileVisitors.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferences</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.preferences.map((preference, index) => (
                  <Badge key={index} variant="secondary">
                    {preference}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{format(new Date(user.joinedAt), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="font-medium">{format(new Date(user.lastActive), "PPP")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bio</p>
            {isEditing ? (
              <Input
                value={editedUser.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Enter bio"
              />
            ) : (
              <p className="text-muted-foreground">{user.bio || 'No bio provided'}</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Total Posts</p>
              <p className="text-2xl font-bold">15</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Comments</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Likes</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Following</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>

          <div className="border rounded-md p-4 mt-4">
            <p className="text-sm font-medium mb-3">Recent Activity</p>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm">Posted a comment on "Winter Fashion Trends 2023"</p>
                <p className="text-xs text-muted-foreground">Nov 5, 2023</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm">Liked "Introduction to Machine Learning"</p>
                <p className="text-xs text-muted-foreground">Nov 3, 2023</p>
              </div>
              <div>
                <p className="text-sm">Updated profile information</p>
                <p className="text-xs text-muted-foreground">Oct 28, 2023</p>
              </div>
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
        <TabsContent value="chats" className="mt-4 space-y-4">
          <div className="space-y-4">
            {user.chatHistory.length > 0 ? (
              user.chatHistory.map((chat) => (
                <div key={chat.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{chat.expertName}</h4>
                      {chat.unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {chat.unreadCount} new
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(chat.timestamp), "PPP")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{chat.lastMessage}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No chat history available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 