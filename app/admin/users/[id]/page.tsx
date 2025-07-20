"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, User, CheckCircle, Edit2, Save, X, Loader2, Eye, Tag, MessageSquare, MapPin, Calendar, Phone, Mail, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string | null;
  role: string;
  status?: string;
  bio: string | null;
  avatar: string | null;
  interests: string[];
  tags: string[];
  location: {
    city: string;
    country: string;
    postalCode: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  admin: any;
  expertDetails: any;
  posts: any[];
  followers: Array<{
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    updatedAt: string;
    follower: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }>;
  following: Array<{
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    updatedAt: string;
    following: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }>;
  _count: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    comments: number;
  };
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const {
    selectedUser,
    isLoading,
    error,
    fetchUserById,
    updateUser,
    deleteUser,
  } = useAdminUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);

  // Cast selectedUser to UserData to access all the API response fields
  const userData = selectedUser as UserData | null;

  useEffect(() => {
    if (params.id) {
      fetchUserById(params.id as string);
    }
    setIsEditing(false);
  }, [params.id, fetchUserById]);

  useEffect(() => {
    if (userData) {
      setEditedUser(userData);
    }
  }, [userData]);

  const handleSave = async () => {
    if (editedUser && userData) {
      try {
        // Only include fields that have actually changed
        const updateData: any = {};
        
        if (editedUser.name !== userData.name) {
          updateData.name = editedUser.name;
        }
        
        if (editedUser.email !== userData.email) {
          updateData.email = editedUser.email;
        }
        
        if (editedUser.bio !== userData.bio) {
          updateData.bio = editedUser.bio || undefined;
        }
        
        if (editedUser.role !== userData.role) {
          updateData.role = editedUser.role;
        }
        
        if (editedUser.avatar !== userData.avatar) {
          updateData.avatar = editedUser.avatar || undefined;
        }
        
        if (editedUser.phone !== userData.phone) {
          updateData.phone = editedUser.phone || undefined;
        }
        
        if ((editedUser as any).status !== (userData as any).status) {
          updateData.status = (editedUser as any).status;
        }
        
        // Only make API call if there are changes
        if (Object.keys(updateData).length > 0) {
          await updateUser(editedUser.id, updateData);
          toast.success("User details updated successfully");
        } else {
          toast.info("No changes to save");
        }
        setIsEditing(false);
      } catch (e) {
        toast.error("Failed to update user");
      }
    }
  };

  const handleCancel = () => {
    if (userData) {
      setEditedUser(userData);
    }
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

  const handleLocationChange = (field: string, value: string) => {
    if (editedUser && editedUser.location) {
      setEditedUser({
        ...editedUser,
        location: {
          ...editedUser.location,
          [field]: value,
        },
      });
    }
  };

  const handleDelete = async () => {
    if (userData) {
      try {
        await deleteUser(userData.id);
        toast.success("User deleted successfully");
        router.push('/admin/users');
      } catch (e) {
        toast.error("Failed to delete user");
      }
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

  if (!userData || !editedUser) {
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
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user
                      <strong> {userData?.name}</strong> and remove all their data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4 space-y-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar || undefined} alt={userData.name} />
              <AvatarFallback className="text-lg">
                {userData.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedUser.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter user name"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold">{userData.name}</h3>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedUser.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                    />
                  ) : (
                    <p className="text-muted-foreground">{userData.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedUser.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-muted-foreground">{userData.phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Role
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedUser.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder="Enter role"
                    />
                  ) : (
                    <Badge variant={userData.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {userData.role}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Status
                  </p>
                  {isEditing ? (
                    <Select
                      value={(editedUser as any).status || 'ACTIVE'}
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge 
                      variant={
                        (userData as any).status === 'ACTIVE' ? 'default' : 
                        (userData as any).status === 'INACTIVE' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {(userData as any).status || 'ACTIVE'}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Bio</p>
                {isEditing ? (
                  <Textarea
                    value={editedUser.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Enter bio"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{userData.bio || 'No bio provided'}</p>
                )}
              </div>
              
              {userData.interests && userData.interests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {userData.location && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </p>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={editedUser.location?.city || ''}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        value={editedUser.location?.country || ''}
                        onChange={(e) => handleLocationChange('country', e.target.value)}
                        placeholder="Country"
                      />
                      <Input
                        value={editedUser.location?.postalCode || ''}
                        onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                        placeholder="Postal Code"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {userData.location.city}, {userData.location.country} {userData.location.postalCode}
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </p>
                  <p className="font-medium">{format(new Date(userData.createdAt), "PPP")}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{format(new Date(userData.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Post Comments</p>
              <p className="text-2xl font-bold">{userData._count?.comments || 0}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Post Likes</p>
              <p className="text-2xl font-bold">{userData._count?.likes || 0}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Followers</p>
              <p className="text-2xl font-bold">{userData._count?.followers || 0}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium mb-2">Following</p>
              <p className="text-2xl font-bold">{userData._count?.following || 0}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="connections" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Followers ({userData.followers?.length || 0})</h3>
              <div className="space-y-3">
                {userData.followers?.map((follower) => (
                  <div key={follower.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={follower.follower.avatar || undefined} alt={follower.follower.name} />
                      <AvatarFallback>
                        {follower.follower.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{follower.follower.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Following since {format(new Date(follower.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
                {(!userData.followers || userData.followers.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No followers yet</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Following ({userData.following?.length || 0})</h3>
              <div className="space-y-3">
                {userData.following?.map((following) => (
                  <div key={following.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={following.following.avatar || undefined} alt={following.following.name} />
                      <AvatarFallback>
                        {following.following.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{following.following.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Following since {format(new Date(following.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
                {(!userData.following || userData.following.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">Not following anyone yet</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 