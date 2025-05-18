"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Award, CheckCircle, Edit2, Save, X, Loader2, Star, Eye } from "lucide-react";
import { format } from "date-fns";
import { useExperts } from "@/lib/contexts/experts-context";
import { toast } from "sonner";

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

export default function ExpertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { experts, updateExpert } = useExperts();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpert, setEditedExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundExpert = experts.find(e => e.id === params.id);
    if (foundExpert) {
      setExpert(foundExpert);
      setEditedExpert(foundExpert);
    }
    setIsLoading(false);
  }, [params.id, experts]);

  const handleSave = () => {
    if (editedExpert) {
      updateExpert(editedExpert);
      setExpert(editedExpert);
      setIsEditing(false);
      toast.success("Expert details updated successfully");
    }
  };

  const handleCancel = () => {
    setEditedExpert(expert);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Expert, value: any) => {
    if (editedExpert) {
      setEditedExpert({
        ...editedExpert,
        [field]: value
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading expert details...</p>
        </div>
      </div>
    );
  }

  if (!expert || !editedExpert) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Expert not found</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Expert Details</h1>
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
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name</p>
                {isEditing ? (
                  <Input
                    value={editedExpert.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter expert name"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{expert.name}</h3>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input
                    value={editedExpert.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter email address"
                    type="email"
                  />
                ) : (
                  <p className="text-muted-foreground">{expert.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Category</p>
                {isEditing ? (
                  <Input
                    value={editedExpert.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter category"
                  />
                ) : (
                  <p className="text-sm font-medium">{expert.category}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {expert.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
                )}
                {expert.featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {isEditing ? (
                <Input
                  value={editedExpert.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                />
              ) : (
                <p className="font-medium capitalize">{expert.status}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <p className="font-medium">{expert.followers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <p className="font-medium">{expert.rating.toFixed(1)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile Visitors</p>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="font-medium">{expert.profileVisitors.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{format(new Date(expert.joinedAt), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="font-medium">{format(new Date(expert.lastActive), "PPP")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Profile Completion</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{expert.profileCompletion}%</span>
            </div>
            <Progress value={expert.profileCompletion} className="h-2" />
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
    </div>
  );
} 