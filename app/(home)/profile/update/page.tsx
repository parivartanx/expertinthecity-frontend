"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUser, FaBriefcase, FaCertificate, FaGraduationCap, FaTrophy, FaMapMarkerAlt, FaEdit, FaSave, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { toast } from "sonner";

const PROGRESS_LEVELS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, isLoading, updateProfile } = useUserStore();
  const { subcategories, fetchAllSubcategories, isLoading: categoriesLoading } = useCategoriesStore();
  
  const isExpert = user?.role?.toUpperCase() === "EXPERT";
  const isUser = user?.role?.toUpperCase() === "USER";

  // Form state for USER fields
  const [userForm, setUserForm] = useState({
    name: "",
    bio: "",
    interests: [] as string[],
    location: {
      city: "",
      country: "",
      postalCode: ""
    }
  });

  // Form state for EXPERT fields
  const [expertForm, setExpertForm] = useState({
    headline: "",
    summary: "",
    expertise: [] as string[],
    experience: 0,
    hourlyRate: 0,
    about: "",
    availability: "",
    languages: [] as string[],
    progressLevel: "BRONZE",
    progressShow: true
  });

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subcategories on component mount
  useEffect(() => {
    fetchAllSubcategories();
  }, [fetchAllSubcategories]);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setUserForm({
        name: profile.name || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        location: {
          city: typeof profile.location === 'object' && profile.location ? profile.location.city || "" : "",
          country: typeof profile.location === 'object' && profile.location ? profile.location.country || "" : "",
          postalCode: typeof profile.location === 'object' && profile.location ? profile.location.postalCode || "" : ""
        }
      });

      if (isExpert) {
        setExpertForm({
          headline: profile.headline || "",
          summary: profile.summary || "",
          expertise: profile.expertise || [],
          experience: profile.experience || 0,
          hourlyRate: profile.hourlyRate || 0,
          about: profile.about || "",
          availability: profile.availability || "",
          languages: profile.languages || [],
          progressLevel: profile.progressLevel || "BRONZE",
          progressShow: profile.progressShow !== false
        });
      }
    }
  }, [profile, isExpert]);

  const handleUserFormChange = (field: string, value: any) => {
    if (field.startsWith('location.')) {
      const key = field.split('.')[1];
      setUserForm(prev => ({
        ...prev,
        location: { ...prev.location, [key]: value }
      }));
    } else if (field === 'interests') {
      setUserForm(prev => ({
        ...prev,
        interests: prev.interests.includes(value) 
          ? prev.interests.filter(i => i !== value)
          : [...prev.interests, value]
      }));
    } else {
      setUserForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleExpertFormChange = (field: string, value: any) => {
    if (field === 'expertise') {
      setExpertForm(prev => ({
        ...prev,
        expertise: prev.expertise.includes(value) 
          ? prev.expertise.filter(i => i !== value)
          : [...prev.expertise, value]
      }));
    } else if (field === 'languages') {
      setExpertForm(prev => ({
        ...prev,
        languages: prev.languages.includes(value) 
          ? prev.languages.filter(i => i !== value)
          : [...prev.languages, value]
      }));
    } else {
      setExpertForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const updateData: any = {
        name: userForm.name,
        bio: userForm.bio,
        interests: userForm.interests,
        location: userForm.location
      };

      if (isExpert) {
        updateData.headline = expertForm.headline;
        updateData.summary = expertForm.summary;
        updateData.expertise = expertForm.expertise;
        updateData.experience = expertForm.experience;
        updateData.hourlyRate = expertForm.hourlyRate;
        updateData.about = expertForm.about;
        updateData.availability = expertForm.availability;
        updateData.languages = expertForm.languages;
        updateData.progressLevel = expertForm.progressLevel;
        updateData.progressShow = expertForm.progressShow;
      }

      await updateProfile(updateData);
      toast.success("Profile updated successfully!");
      router.push('/profile');
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isLoading && !isSubmitting) || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Update Profile</h1>
          <p className="text-muted-foreground">
            {isExpert ? "Update your expert profile and showcase your expertise" : "Update your profile information"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUser className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => handleUserFormChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userForm.bio}
                  onChange={(e) => handleUserFormChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading interests...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subcategory.id}
                          checked={userForm.interests.includes(subcategory.name)}
                          onCheckedChange={() => handleUserFormChange('interests', subcategory.name)}
                        />
                        <Label htmlFor={subcategory.id} className="text-sm cursor-pointer">
                          {subcategory.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userForm.location.city}
                    onChange={(e) => handleUserFormChange('location.city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userForm.location.country}
                    onChange={(e) => handleUserFormChange('location.country', e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={userForm.location.postalCode}
                    onChange={(e) => handleUserFormChange('location.postalCode', e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expert Information Section - Only for Experts */}
          {isExpert && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBriefcase className="w-5 h-5" />
                  Expert Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={expertForm.headline}
                    onChange={(e) => handleExpertFormChange('headline', e.target.value)}
                    placeholder="e.g., Senior Software Engineer | React Specialist"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={expertForm.summary}
                    onChange={(e) => handleExpertFormChange('summary', e.target.value)}
                    placeholder="Brief summary of your expertise and experience..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise</Label>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading expertise areas...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`expertise-${subcategory.id}`}
                            checked={expertForm.expertise.includes(subcategory.name)}
                            onCheckedChange={() => handleExpertFormChange('expertise', subcategory.name)}
                          />
                          <Label htmlFor={`expertise-${subcategory.id}`} className="text-sm cursor-pointer">
                            {subcategory.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={expertForm.experience}
                      onChange={(e) => handleExpertFormChange('experience', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={expertForm.hourlyRate}
                      onChange={(e) => handleExpertFormChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={expertForm.about}
                    onChange={(e) => handleExpertFormChange('about', e.target.value)}
                    placeholder="Detailed description of your expertise, background, and what you offer..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={expertForm.availability}
                    onChange={(e) => handleExpertFormChange('availability', e.target.value)}
                    placeholder="e.g., Weekdays 9 AM - 6 PM, Weekends available"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi", "Arabic"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${language}`}
                          checked={expertForm.languages.includes(language)}
                          onCheckedChange={() => handleExpertFormChange('languages', language)}
                        />
                        <Label htmlFor={`lang-${language}`} className="text-sm cursor-pointer">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="progressLevel">Progress Level</Label>
                    <select
                      id="progressLevel"
                      value={expertForm.progressLevel}
                      onChange={(e) => handleExpertFormChange('progressLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      {PROGRESS_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level.charAt(0) + level.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Show Progress Level</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="progressShow"
                        checked={expertForm.progressShow}
                        onCheckedChange={(checked) => handleExpertFormChange('progressShow', checked)}
                      />
                      <Label htmlFor="progressShow" className="text-sm">
                        Display progress level on profile
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
