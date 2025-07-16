"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaSearch, FaFilter, FaMapMarkerAlt, FaChevronDown, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { useFollowStore } from "@/lib/mainwebsite/follow-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { toast } from "sonner";

interface Expert {
  id: string;
  name: string;
  title?: string;
  location: string | { address?: string; country?: string };
  rating: number;
  reviews: number;
  categories?: string[];
  tags?: string[];
  image: string;
  status?: string;
  bio?: string;
  description?: string;
  hourlyRate?: number;
  verified?: boolean;
  expertise?: string[];
  experience?: number;
  availability?: string;
  languages?: string[];
  userId?: string;
}

// Client Component for Search & Filter Section
const SearchFilterSection = () => {
  const {
    location,
    setLocation,
    selectedServices,
    toggleService,
    selectedRatings,
    toggleRating,
    fetchExperts,
    searchQuery,
    setSearchQuery,
    fetchExpertsByCategory,
    fetchExpertsBySubcategory
  } = useAllExpertsStore();

  const { categories, subcategories, fetchAllCategories, fetchAllSubcategories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchAllCategories();
    fetchAllSubcategories();
  }, [fetchAllCategories, fetchAllSubcategories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    // Clear previously selected services when category changes
    selectedServices.forEach(service => toggleService(service));
    // Find the category name from the id
    const selectedCat = categories.find(cat => cat.id === categoryId);
    if (selectedCat) {
      fetchExpertsByCategory(selectedCat.name);
    }
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);

    if (subcategory) {
      toggleService(subcategory.name);
      // Fetch experts by subcategory
      fetchExpertsBySubcategory(subcategory.name);
    }
  };

  return (
    <Card className="w-full h-fit">
      <CardContent className="p-4">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white pt-12 pb-2 mb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Find Your Expert</h1>
          <p className="text-sm text-gray-600 leading-relaxed">Discover qualified professionals for your needs</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Search & Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsVisible(!isVisible)}
          >
            <FaFilter className="w-4 h-4" />
          </Button>
        </div>

        <div className={`${isVisible ? 'block' : 'hidden'} md:block space-y-4`}>
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Location Input */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select a category" />
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

          {/* Subcategory Selection */}
          {selectedCategory && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Service
              </label>
              <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories
                    .filter(sub => sub.categoryId === selectedCategory)
                    .map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}



          {/* Clear Filters Button */}
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("");
              setSelectedSubcategory("");
              setSearchQuery("");
              setLocation("");
              selectedRatings.forEach(r => toggleRating(r));
              selectedServices.forEach(s => toggleService(s));
              // Fetch all experts again
              fetchExperts();
            }}
            className="w-full h-9"
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AllExperts() {
  const {
    experts,
    isLoading,
    error,
    fetchExperts,
    searchQuery,
    setSearchQuery,
    location,
    selectedRatings,
    selectedServices,
    getExpertById,
    sendMessageToExpert,
    clearSearchState
  } = useAllExpertsStore();

  const { user } = useAuthStore();
  const { followExpert, unfollowExpert, checkFollowStatus, followStatuses, isLoading: followLoading } = useFollowStore();
  const router = useRouter();
  const { createChat, chats } = useChatStore();
  const [messageLoading, setMessageLoading] = useState<string | null>(null);
  const [followLoadingStates, setFollowLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  useEffect(() => {
    // Debounce search and filter changes
    const timeoutId = setTimeout(() => {
      fetchExperts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [location, selectedRatings, selectedServices, searchQuery]);

  // Check follow status for all experts when user is logged in
  useEffect(() => {
    if (user && experts.length > 0) {
      experts.forEach((expert: Expert) => {
        const followId = expert.userId || expert.id;
        if (followId) {
          checkFollowStatus(followId);
        }
      });
    }
  }, [user, experts, checkFollowStatus]);

  const handleViewProfile = async (expert: Expert) => {
    try {
      router.push(`/experts/${expert.id}`);
    } catch (error) {
      console.error("Error navigating to expert profile:", error);
      toast.error("Failed to open expert profile");
    }
  };

  const handleFollow = async (expert: Expert) => {
    if (!user) {
      toast.error("Please login to follow experts");
      return;
    }

    const followId = expert.userId || expert.id;
    if (!followId) {
      toast.error("Unable to follow this expert");
      return;
    }

    try {
      setFollowLoadingStates(prev => ({ ...prev, [expert.id]: true }));
      const isCurrentlyFollowing = followStatuses[followId];
      if (isCurrentlyFollowing) {
        await unfollowExpert(followId);
        toast.success("Unfollowed successfully");
      } else {
        await followExpert(followId);
        toast.success("Followed successfully");
      }
    } catch (error) {
      console.error("Error handling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoadingStates(prev => ({ ...prev, [expert.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-4">


        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Sidebar - Search & Filters (Sticky) */}
          <div className="lg:w-80 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <SearchFilterSection />
          </div>

          {/* Main Content (Scrollable) */}
          <div className="flex-1 lg:overflow-y-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                {selectedServices.length > 0 && (
                  <p className="text-xs text-gray-600">
                    Filtered by: {selectedServices.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Loading experts...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && experts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-3">
                    <FaSearch className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No experts found</h3>
                  <p className="text-sm text-gray-600">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            )}

            {/* Experts Grid */}
            <div className="grid gap-3">
              {experts.map((expert: Expert, index: number) => {
                const followId = expert.userId || expert.id;
                const isFollowing = followId ? followStatuses[followId] : false;
                const isFollowLoading = followLoadingStates[expert.id] || false;

                return (
                  <Card key={expert.id || index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Expert Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={expert.image}
                            alt={expert.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>

                        {/* Expert Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {expert.name}
                                {expert.verified && (
                                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </h3>
                              {expert.title && (
                                <p className="text-sm text-gray-600 mb-1">{expert.title}</p>
                              )}
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                <span>
                                  {typeof expert.location === 'string'
                                    ? expert.location
                                    : [expert.location?.address, expert.location?.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            </div>

                            {/* Rating */}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {expert.description}
                          </p>

                          {/* Expertise (instead of Tags) */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {(expert.expertise || []).slice(0, 3).map((item: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons - Right Side */}
                        <div className="flex flex-col items-end min-w-fit justify-between h-full">
                          {/* Rating */}
                          <div className="flex items-center gap-1 text-yellow-500 mb-2">
                            <FaStar className="w-4 h-4" />
                            <span className="font-medium text-black text-base">{expert.rating}</span>
                            <span className="text-black text-base">(</span>
                            <span className="text-black text-base">{expert.reviews} reviews</span>
                            <span className="text-black text-base">)</span>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              onClick={() => handleViewProfile(expert)}
                              className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 text-base w-full"
                            >
                              View Profile
                            </Button>
                            <Button
                              onClick={() => handleFollow(expert)}
                              disabled={isFollowLoading}
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50 h-10 px-6 text-base w-full"
                            >
                              {isFollowLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : isFollowing ? (
                                "Following"
                              ) : (
                                "Follow"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
