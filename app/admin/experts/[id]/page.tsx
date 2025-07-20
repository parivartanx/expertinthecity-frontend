"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Award, CheckCircle, Edit2, Save, X, Loader2, Star, Eye, MapPin, Clock, DollarSign, Users, MessageSquare, Heart, Calendar, Globe, Phone, Mail, Plus, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useAdminUserStore } from "@/lib/mainwebsite/admin-user-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { toast } from "sonner";

interface Expert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  location?: string | {
    city?: string;
    country?: string;
    postalCode?: string;
  };
  interests: string[];
  tags: string[];
  expertDetails?: {
    id: string;
    userId: string;
    headline?: string;
    summary?: string;
    expertise?: string[];
    experience?: number;
    hourlyRate?: number;
    about?: string;
    availability?: string;
    languages?: string[];
    verified?: boolean;
    badges?: string[];
    progressLevel?: string;
    progressShow?: boolean;
    ratings?: number;
  };
  posts?: Array<{
    id: string;
    title: string;
    content: string;
    image?: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    _count: {
      likes: number;
      comments: number;
    };
  }>;
  followers?: Array<{
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
    updatedAt: string;
    follower: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  following?: Array<any>;
  _count?: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
    comments: number;
  };
}

export default function ExpertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { fetchUserById, selectedUser, updateUser, deleteUser, isLoading, error } = useAdminUserStore();
  const { categories, fetchAllCategories, isLoading: categoriesLoading, isLoaded } = useCategoriesStore();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpert, setEditedExpert] = useState<Expert | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Temporary input states for editing
  const [newInterest, setNewInterest] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newExpertise, setNewExpertise] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  
  // Pending changes for visual feedback
  const [pendingExpertise, setPendingExpertise] = useState<string[]>([]);
  const [pendingInterests, setPendingInterests] = useState<string[]>([]);
  const [pendingTags, setPendingTags] = useState<string[]>([]);
  const [pendingLanguages, setPendingLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchUserById(params.id as string);
    }
  }, [params.id, fetchUserById]);

  useEffect(() => {
    if (!isLoaded && !categoriesLoading) {
      fetchAllCategories();
    }
  }, [fetchAllCategories, isLoaded, categoriesLoading]);

  useEffect(() => {
    if (selectedUser && selectedUser.role === "EXPERT") {
      const expertData = {
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        phone: (selectedUser as any).phone,
        bio: (selectedUser as any).bio,
        avatar: (selectedUser as any).avatar,
        status: (selectedUser as any).status?.toLowerCase() || "active",
        joinedAt: selectedUser.createdAt || "",
        lastActive: selectedUser.updatedAt || "",
        verified: selectedUser.expertDetails?.verified || false,
        location: (selectedUser as any).location,
        interests: (selectedUser as any).interests || [],
        tags: (selectedUser as any).tags || [],
        expertDetails: selectedUser.expertDetails,
        posts: (selectedUser as any).posts || [],
        followers: (selectedUser as any).followers || [],
        following: (selectedUser as any).following || [],
        _count: (selectedUser as any)._count,
      };
      setExpert(expertData);
      setEditedExpert(expertData);
    }
  }, [selectedUser]);

  const handleSave = async () => {
    if (!editedExpert || !expert) return;

    setIsSaving(true);
    try {
      // Compare and build update payload with only changed fields
      const updatePayload: any = {};

      // Basic fields comparison
      if (editedExpert.name !== expert.name) {
        updatePayload.name = editedExpert.name;
      }
      if (editedExpert.email !== expert.email) {
        updatePayload.email = editedExpert.email;
      }
      if (editedExpert.phone !== expert.phone) {
        updatePayload.phone = editedExpert.phone;
      }
      if (editedExpert.bio !== expert.bio) {
        updatePayload.bio = editedExpert.bio;
      }
      if (editedExpert.status !== expert.status) {
        updatePayload.status = editedExpert.status.toUpperCase();
      }
      if (JSON.stringify(editedExpert.location) !== JSON.stringify(expert.location)) {
        updatePayload.location = editedExpert.location;
      }
      if (JSON.stringify(editedExpert.interests) !== JSON.stringify(expert.interests)) {
        updatePayload.interests = editedExpert.interests;
      }
      if (JSON.stringify(editedExpert.tags) !== JSON.stringify(expert.tags)) {
        updatePayload.tags = editedExpert.tags;
      }

      // Expert details comparison
      const expertDetailsChanges: any = {};
      const originalDetails = expert.expertDetails || {} as any;
      const editedDetails = editedExpert.expertDetails || {} as any;

      if ((editedDetails as any).headline !== (originalDetails as any).headline) {
        expertDetailsChanges.headline = (editedDetails as any).headline;
      }
      if ((editedDetails as any).summary !== (originalDetails as any).summary) {
        expertDetailsChanges.summary = (editedDetails as any).summary;
      }
      if (JSON.stringify((editedDetails as any).expertise) !== JSON.stringify((originalDetails as any).expertise)) {
        expertDetailsChanges.expertise = (editedDetails as any).expertise;
      }
      if ((editedDetails as any).experience !== (originalDetails as any).experience) {
        expertDetailsChanges.experience = (editedDetails as any).experience;
      }
      if ((editedDetails as any).hourlyRate !== (originalDetails as any).hourlyRate) {
        expertDetailsChanges.hourlyRate = (editedDetails as any).hourlyRate;
      }
      if ((editedDetails as any).about !== (originalDetails as any).about) {
        expertDetailsChanges.about = (editedDetails as any).about;
      }
      if ((editedDetails as any).availability !== (originalDetails as any).availability) {
        expertDetailsChanges.availability = (editedDetails as any).availability;
      }
      if (JSON.stringify((editedDetails as any).languages) !== JSON.stringify((originalDetails as any).languages)) {
        expertDetailsChanges.languages = (editedDetails as any).languages;
      }
      if ((editedDetails as any).verified !== (originalDetails as any).verified) {
        expertDetailsChanges.verified = (editedDetails as any).verified;
      }
      if ((editedDetails as any).progressLevel !== (originalDetails as any).progressLevel) {
        expertDetailsChanges.progressLevel = (editedDetails as any).progressLevel;
      }

      // Only add expertDetails if there are changes
      if (Object.keys(expertDetailsChanges).length > 0) {
        updatePayload.expertDetails = expertDetailsChanges;
      }

            // Only make API call if there are changes
      if (Object.keys(updatePayload).length > 0) {
        await updateUser(editedExpert.id, updatePayload as any);
        setExpert(editedExpert);
        setIsEditing(false);
        // Clear pending changes
        setPendingExpertise([]);
        setPendingInterests([]);
        setPendingTags([]);
        setPendingLanguages([]);
        toast.success("Expert details updated successfully");
      } else {
        setIsEditing(false);
        toast.info("No changes to save");
      }
    } catch (error) {
      console.error("Error updating expert:", error);
      toast.error("Failed to update expert details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedExpert(expert);
    setIsEditing(false);
    // Clear temporary inputs
    setNewInterest("");
    setNewTag("");
    setNewExpertise("");
    setNewLanguage("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    // Clear pending changes
    setPendingExpertise([]);
    setPendingInterests([]);
    setPendingTags([]);
    setPendingLanguages([]);
  };

  const handleDeleteExpert = async () => {
    if (!expert) return;

    setIsDeleting(true);
    try {
      await deleteUser(expert.id);
      toast.success("Expert deleted successfully");
      router.push("/admin/experts");
    } catch (error) {
      console.error("Error deleting expert:", error);
      toast.error("Failed to delete expert");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleChange = (field: keyof Expert, value: any) => {
    if (editedExpert) {
      setEditedExpert({
        ...editedExpert,
        [field]: value
      });
    }
  };

  const handleExpertDetailsChange = (field: string, value: any) => {
    if (editedExpert && editedExpert.expertDetails) {
      setEditedExpert({
        ...editedExpert,
        expertDetails: {
          ...editedExpert.expertDetails,
          [field]: value
        }
      });
    }
  };

  const addArrayItem = (field: 'interests' | 'tags' | 'expertise' | 'languages', value: string, setter: (value: string) => void) => {
    if (!value.trim()) return;
    
    if (editedExpert) {
      let currentArray: string[] = [];
      
      if (field === 'languages') {
        currentArray = editedExpert.expertDetails?.languages || [];
      } else if (field === 'expertise') {
        currentArray = editedExpert.expertDetails?.expertise || [];
      } else if (field === 'interests') {
        currentArray = editedExpert.interests || [];
      } else if (field === 'tags') {
        currentArray = editedExpert.tags || [];
      }
      
      if (!currentArray.includes(value.trim())) {
        if (field === 'languages' || field === 'expertise') {
          handleExpertDetailsChange(field, [...currentArray, value.trim()]);
        } else {
          handleChange(field, [...currentArray, value.trim()]);
        }
        
        // Add to pending changes for visual feedback
        if (field === 'expertise') {
          setPendingExpertise(prev => [...prev, value.trim()]);
        } else if (field === 'interests') {
          setPendingInterests(prev => [...prev, value.trim()]);
        } else if (field === 'tags') {
          setPendingTags(prev => [...prev, value.trim()]);
        } else if (field === 'languages') {
          setPendingLanguages(prev => [...prev, value.trim()]);
        }
      }
    }
    setter("");
  };

  const removeArrayItem = (field: 'interests' | 'tags' | 'expertise' | 'languages', index: number) => {
    if (editedExpert) {
      let currentArray: string[] = [];
      
      if (field === 'languages') {
        currentArray = editedExpert.expertDetails?.languages || [];
      } else if (field === 'expertise') {
        currentArray = editedExpert.expertDetails?.expertise || [];
      } else if (field === 'interests') {
        currentArray = editedExpert.interests || [];
      } else if (field === 'tags') {
        currentArray = editedExpert.tags || [];
      }
      
      const removedItem = currentArray[index];
      const newArray = currentArray.filter((_: string, i: number) => i !== index);
      
      if (field === 'languages' || field === 'expertise') {
        handleExpertDetailsChange(field, newArray);
      } else if (field === 'interests' || field === 'tags') {
        handleChange(field as keyof Expert, newArray);
      }
      
      // Remove from pending changes
      if (field === 'expertise') {
        setPendingExpertise(prev => prev.filter(item => item !== removedItem));
      } else if (field === 'interests') {
        setPendingInterests(prev => prev.filter(item => item !== removedItem));
      } else if (field === 'tags') {
        setPendingTags(prev => prev.filter(item => item !== removedItem));
      } else if (field === 'languages') {
        setPendingLanguages(prev => prev.filter(item => item !== removedItem));
      }
    }
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    if (location && typeof location === 'object') {
      const parts = [location.city, location.country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'No location';
    }
    return 'No location';
  };

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isLoading ? "Loading expert details..." : "Loading categories..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !expert || !editedExpert) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">{error || "Expert not found"}</p>
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
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button 
                onClick={() => setShowDeleteDialog(true)} 
                variant="destructive" 
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Expert
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-2">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {expert.avatar ? (
                  <img 
                    src={expert.avatar} 
                    alt={expert.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Award className="h-12 w-12 text-muted-foreground" />
            </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                {isEditing ? (
                  <Input
                    value={editedExpert.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                          className="text-2xl font-bold h-10"
                          placeholder="Expert name"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold">{expert.name}</h2>
                      )}
                      {expert.verified && (
                        <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500" />
                      )}
                      {isEditing ? (
                        <Select
                          value={editedExpert.status}
                          onValueChange={(value) => handleChange('status', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={
                          expert.status === "active" ? "default" : 
                          expert.status === "blocked" ? "destructive" : 
                          "secondary"
                        }>
                          {expert.status}
                        </Badge>
                      )}
                    </div>
                    {isEditing ? (
                      <Input
                        value={editedExpert.expertDetails?.headline || ""}
                        onChange={(e) => handleExpertDetailsChange('headline', e.target.value)}
                        className="text-lg text-muted-foreground"
                        placeholder="Professional headline"
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground">{expert.expertDetails?.headline}</p>
                    )}
                    {isEditing ? (
                      <Textarea
                        value={editedExpert.expertDetails?.summary || ""}
                        onChange={(e) => handleExpertDetailsChange('summary', e.target.value)}
                        className="text-sm text-muted-foreground mt-1"
                        placeholder="Professional summary"
                        rows={2}
                  />
                ) : (
                      expert.expertDetails?.summary && (
                        <p className="text-sm text-muted-foreground mt-1">{expert.expertDetails.summary}</p>
                      )
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {expert.expertDetails?.badges?.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              <div className="space-y-2">
                  <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={editedExpert.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    type="email"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editedExpert.phone || ""}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.phone || "No phone number"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={typeof editedExpert.location === 'object' ? (editedExpert.location as any).city || "" : ""}
                        onChange={(e) => handleChange('location', { 
                          ...(typeof editedExpert.location === 'object' ? editedExpert.location : {}),
                          city: e.target.value 
                        })}
                        placeholder="City"
                      />
                      <Input
                        value={typeof editedExpert.location === 'object' ? (editedExpert.location as any).country || "" : ""}
                        onChange={(e) => handleChange('location', { 
                          ...(typeof editedExpert.location === 'object' ? editedExpert.location : {}),
                          country: e.target.value 
                        })}
                        placeholder="Country"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatLocation(expert.location)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Availability & Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Availability</Label>
                  {isEditing ? (
                    <Input
                      value={editedExpert.expertDetails?.availability || ""}
                      onChange={(e) => handleExpertDetailsChange('availability', e.target.value)}
                      placeholder="e.g., Weekdays 10am-6pm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.expertDetails?.availability || "Not specified"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate ($)</Label>
                  {isEditing ? (
                    <Input
                      value={editedExpert.expertDetails?.hourlyRate || ""}
                      onChange={(e) => handleExpertDetailsChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      type="number"
                      placeholder="0.00"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">${expert.expertDetails?.hourlyRate || 0}/hour</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Progress Level</Label>
                  {isEditing ? (
                    <Select
                      value={editedExpert.expertDetails?.progressLevel || "BRONZE"}
                      onValueChange={(value) => handleExpertDetailsChange('progressLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRONZE">BRONZE</SelectItem>
                        <SelectItem value="SILVER">SILVER</SelectItem>
                        <SelectItem value="GOLD">GOLD</SelectItem>
                        <SelectItem value="PLATINUM">PLATINUM</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{expert.expertDetails?.progressLevel || "BRONZE"} Level</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio & About */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedExpert.bio || ""}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Enter bio"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {expert.bio || "No bio provided"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedExpert.expertDetails?.about || ""}
                    onChange={(e) => handleExpertDetailsChange('about', e.target.value)}
                    placeholder="Enter about information"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {expert.expertDetails?.about || "No about information provided"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{expert._count?.posts || 0}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{expert._count?.followers || 0}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{expert._count?.following || 0}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{expert._count?.likes || 0}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{expert._count?.comments || 0}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expertise Tab */}
        <TabsContent value="expertise" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expertise (Categories & Subcategories)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {/* Existing expertise */}
                  {expert.expertDetails?.expertise?.map((skill, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('expertise', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {/* Pending expertise */}
                  {isEditing && pendingExpertise.map((skill, index) => (
                    <Badge key={`pending-${index}`} variant="outline" className="flex items-center gap-1 border-green-500 text-green-700 bg-green-50">
                      {skill}
                      <span className="text-xs text-green-600">(New)</span>
                      <button
                        onClick={() => {
                          setPendingExpertise(prev => prev.filter((_, i) => i !== index));
                          // Also remove from editedExpert
                          const currentArray = editedExpert.expertDetails?.expertise || [];
                          handleExpertDetailsChange('expertise', currentArray.filter(item => item !== skill));
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {!expert.expertDetails?.expertise?.length && !pendingExpertise.length && (
                    <span className="text-muted-foreground">No expertise listed</span>
                  )}
                </div>
                {isEditing && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={(value) => {
                            setSelectedCategory(value);
                            setSelectedSubcategory("");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Subcategory</Label>
                        <Select
                          value={selectedSubcategory}
                          onValueChange={setSelectedSubcategory}
                          disabled={!selectedCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find(cat => cat.id === selectedCategory)
                              ?.subcategories?.map((subcategory) => {
                                const isSelected = expert.expertDetails?.expertise?.includes(subcategory.name);
                                return (
                                  <SelectItem 
                                    key={subcategory.id} 
                                    value={subcategory.id}
                                    className={isSelected ? "bg-muted" : ""}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{subcategory.name}</span>
                                      {isSelected && (
                                        <CheckCircle className="h-3 w-3 text-green-500 ml-2" />
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="Or type custom expertise"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('expertise', newExpertise, setNewExpertise)}
                      />
                      <Button
                        size="sm"
                        onClick={() => addArrayItem('expertise', newExpertise, setNewExpertise)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedCategory && selectedSubcategory && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const category = categories.find(cat => cat.id === selectedCategory);
                          const subcategory = category?.subcategories?.find(sub => sub.id === selectedSubcategory);
                          if (subcategory) {
                            addArrayItem('expertise', subcategory.name, setNewExpertise);
                            setSelectedCategory("");
                            setSelectedSubcategory("");
                          }
                        }}
                        className="w-full"
                      >
                        Add {categories.find(cat => cat.id === selectedCategory)?.name} - {categories.find(cat => cat.id === selectedCategory)?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests (Categories)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {/* Existing interests */}
                  {expert.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('interests', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {/* Pending interests */}
                  {isEditing && pendingInterests.map((interest, index) => (
                    <Badge key={`pending-${index}`} variant="outline" className="flex items-center gap-1 border-green-500 text-green-700 bg-green-50">
                      {interest}
                      <span className="text-xs text-green-600">(New)</span>
                      <button
                        onClick={() => {
                          setPendingInterests(prev => prev.filter((_, i) => i !== index));
                          // Also remove from editedExpert
                          const currentArray = editedExpert.interests || [];
                          handleChange('interests', currentArray.filter(item => item !== interest));
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {!expert.interests?.length && !pendingInterests.length && (
                    <span className="text-muted-foreground">No interests listed</span>
                  )}
                </div>
                {isEditing && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={(value) => {
                            setSelectedCategory(value);
                            setSelectedSubcategory("");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Subcategory</Label>
                        <Select
                          value={selectedSubcategory}
                          onValueChange={setSelectedSubcategory}
                          disabled={!selectedCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find(cat => cat.id === selectedCategory)
                              ?.subcategories?.map((subcategory) => {
                                const isSelected = expert.interests?.includes(subcategory.name);
                                return (
                                  <SelectItem 
                                    key={subcategory.id} 
                                    value={subcategory.id}
                                    className={isSelected ? "bg-muted" : ""}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{subcategory.name}</span>
                                      {isSelected && (
                                        <CheckCircle className="h-3 w-3 text-green-500 ml-2" />
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {selectedCategory && selectedSubcategory && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const category = categories.find(cat => cat.id === selectedCategory);
                          const subcategory = category?.subcategories?.find(sub => sub.id === selectedSubcategory);
                          if (subcategory) {
                            addArrayItem('interests', subcategory.name, setNewInterest);
                            setSelectedCategory("");
                            setSelectedSubcategory("");
                          }
                        }}
                        className="w-full"
                      >
                        Add {categories.find(cat => cat.id === selectedCategory)?.name} - {categories.find(cat => cat.id === selectedCategory)?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name}
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Or type custom interest"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('interests', newInterest, setNewInterest)}
                      />
                      <Button
                        size="sm"
                        onClick={() => addArrayItem('interests', newInterest, setNewInterest)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {/* Existing tags */}
                  {expert.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('tags', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {/* Pending tags */}
                  {isEditing && pendingTags.map((tag, index) => (
                    <Badge key={`pending-${index}`} variant="outline" className="flex items-center gap-1 border-green-500 text-green-700 bg-green-50">
                      {tag}
                      <span className="text-xs text-green-600">(New)</span>
                      <button
                        onClick={() => {
                          setPendingTags(prev => prev.filter((_, i) => i !== index));
                          // Also remove from editedExpert
                          const currentArray = editedExpert.tags || [];
                          handleChange('tags', currentArray.filter(item => item !== tag));
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {!expert.tags?.length && !pendingTags.length && (
                    <span className="text-muted-foreground">No tags</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('tags', newTag, setNewTag)}
                    />
                    <Button
                      size="sm"
                      onClick={() => addArrayItem('tags', newTag, setNewTag)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {/* Existing languages */}
                  {expert.expertDetails?.languages?.map((language, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {language}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('languages', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {/* Pending languages */}
                  {isEditing && pendingLanguages.map((language, index) => (
                    <Badge key={`pending-${index}`} variant="outline" className="flex items-center gap-1 border-green-500 text-green-700 bg-green-50">
                      {language}
                      <span className="text-xs text-green-600">(New)</span>
                      <button
                        onClick={() => {
                          setPendingLanguages(prev => prev.filter((_, i) => i !== index));
                          // Also remove from editedExpert
                          const currentArray = editedExpert.expertDetails?.languages || [];
                          handleExpertDetailsChange('languages', currentArray.filter(item => item !== language));
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {!expert.expertDetails?.languages?.length && !pendingLanguages.length && (
                    <span className="text-muted-foreground">No languages specified</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language"
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('languages', newLanguage, setNewLanguage)}
                    />
                    <Button
                      size="sm"
                      onClick={() => addArrayItem('languages', newLanguage, setNewLanguage)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
            </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Experience & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
              {isEditing ? (
                <Input
                      value={editedExpert.expertDetails?.experience || ""}
                      onChange={(e) => handleExpertDetailsChange('experience', parseInt(e.target.value) || 0)}
                      type="number"
                      placeholder="0"
                />
              ) : (
                    <p className="text-lg font-semibold">{expert.expertDetails?.experience || 0} years</p>
              )}
            </div>
                <div className="space-y-2">
                  <Label>Hourly Rate ($)</Label>
                  {isEditing ? (
                    <Input
                      value={editedExpert.expertDetails?.hourlyRate || ""}
                      onChange={(e) => handleExpertDetailsChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      type="number"
                      placeholder="0.00"
                    />
                  ) : (
                    <p className="text-lg font-semibold">${expert.expertDetails?.hourlyRate || 0}</p>
                  )}
            </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold">{expert.expertDetails?.ratings?.toFixed(1) || "0.0"}</span>
              </div>
            </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {expert.posts && expert.posts.length > 0 ? (
                <div className="space-y-4">
                  {expert.posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{post.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post._count.likes}
            </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {post._count.comments}
            </div>
            </div>
          </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.createdAt), "PPP")}
              </div>
            </div>
                  ))}
          </div>
              ) : (
                <p className="text-muted-foreground">No posts yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Followers Tab */}
        <TabsContent value="followers" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Followers ({expert.followers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expert.followers && expert.followers.length > 0 ? (
          <div className="space-y-3">
                  {expert.followers.map((follower) => (
                    <div key={follower.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {follower.follower.avatar ? (
                        <img 
                          src={follower.follower.avatar} 
                          alt={follower.follower.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
              </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{follower.follower.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Following since {format(new Date(follower.createdAt), "MMM yyyy")}
                        </p>
            </div>
          </div>
                  ))}
          </div>
              ) : (
                <p className="text-muted-foreground">No followers yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Expert
            </DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to delete <strong>{expert?.name}</strong>? This action cannot be undone and will permanently remove the expert from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteExpert}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete Expert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 