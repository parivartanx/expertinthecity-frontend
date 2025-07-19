"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaSearch, FaFilter, FaMapMarkerAlt, FaChevronDown, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { useFollowStore } from "@/lib/mainwebsite/follow-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRef } from "react";

// Remove Expert interface, use User from user-store

// Search & Filter Section for Users
const SearchFilterSection = ({
  search, setSearch,
  roleFilter, setRoleFilter,
  location, setLocation,
  selectedSubcategory, setSelectedSubcategory,
  subcategories,
  onClearFilters
}: any) => (
  <Card className="w-full h-fit">
    <CardContent className="p-4">
      <div className="sticky top-0 z-10 bg-white pt-12 pb-2 mb-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Find People</h1>
        <p className="text-sm text-gray-600 leading-relaxed">Discover users and experts on the platform</p>
      </div>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users or experts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcategory: any) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Role Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Role</label>
          <Select value={roleFilter || 'ALL'} onValueChange={val => setRoleFilter(val === 'ALL' ? '' : val)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={onClearFilters} className="w-full h-9">Clear All</Button>
      </div>
    </CardContent>
  </Card>
);

// Helper to get initials from name
function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Connections() {
  const { allUsers, fetchAllUsers, isLoading, error, pagination } = useUserStore();
  const { user } = useAuthStore();
  const { followExpert, unfollowExpert, checkFollowStatus, followStatuses } = useFollowStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubcategoryInput, setSelectedSubcategoryInput] = useState("");
  const [debouncedSubcategory, setDebouncedSubcategory] = useState("");
  const { categories, fetchAllCategories, subcategories, fetchAllSubcategories } = useCategoriesStore();
  const [page, setPage] = useState(1);
  const [followLoadingStates, setFollowLoadingStates] = useState<Record<string, boolean>>({});
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // On mount, set roleFilter from query param if present
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      const upperRole = roleParam.toUpperCase();
      if (upperRole === "EXPERT" || upperRole === "USER") {
        setRoleFilter(upperRole);
      }
    }
    setFiltersInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Debounce location
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(locationInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [locationInput]);

  // Debounce category
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubcategory(selectedSubcategoryInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [selectedSubcategoryInput]);

  // Add a useEffect to reset pagination when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, debouncedLocation, debouncedSubcategory, roleFilter]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllSubcategories();
  }, [fetchAllCategories, fetchAllSubcategories]);

  useEffect(() => {
    // Combine search, category, subcategory for backend filtering
    if (!filtersInitialized) return;
    const combinedSearch = [
      debouncedSearch,
      debouncedSubcategory && subcategories.find(s => s.id === debouncedSubcategory)?.name,
      debouncedLocation
    ].filter(Boolean).join(" ");
    let apiRole;
    if (roleFilter === "EXPERT") apiRole = "EXPERT";
    else if (roleFilter === "USER") apiRole = "USER";
    else apiRole = roleFilter || undefined;
    fetchAllUsers({
      page,
      limit: 10,
      search: combinedSearch || undefined,
      role: apiRole,
    });
  }, [fetchAllUsers, debouncedSearch, roleFilter, page, debouncedLocation, debouncedSubcategory, filtersInitialized]);

  // Filtered users are now just allUsers (server-side filtered)
  const filteredUsers = allUsers.filter((u) => u.id !== user?.id);

  const handleViewProfile = (u: any) => {
    router.push(`/connections/${u.id}`);
  };

  const handleFollow = async (u: any) => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }
    const followId = u.id;
    if (!followId) {
      toast.error("Unable to follow this user");
      return;
    }
    try {
      setFollowLoadingStates((prev) => ({ ...prev, [u.id]: true }));
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
      setFollowLoadingStates((prev) => ({ ...prev, [u.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Sidebar - Search & Filters */}
          <div className="lg:w-80 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <SearchFilterSection
              search={searchInput}
              setSearch={setSearchInput}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              location={locationInput}
              setLocation={setLocationInput}
              selectedSubcategory={selectedSubcategoryInput}
              setSelectedSubcategory={setSelectedSubcategoryInput}
              subcategories={subcategories}
              onClearFilters={() => {
                setSearchInput("");
                setRoleFilter("");
                setLocationInput("");
                setSelectedSubcategoryInput("");
                // Remove sortBy and sortOrder from clear filters
                // setSortBy("createdAt");
                // setSortOrder("desc");
                setPage(1);
              }}
            />
          </div>
          {/* Main Content */}
          <div className="flex-1 lg:overflow-y-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                {roleFilter && (
                  <p className="text-xs text-gray-600">Filtered by role: {roleFilter}</p>
                )}
              </div>
            </div>
            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Avatar Skeleton */}
                        <div className="w-16 h-16 rounded-full bg-gray-200" />
                        {/* Info Skeleton */}
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-1/3 mb-1" />
                          <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
                          <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                        </div>
                        {/* Button Skeleton */}
                        <div className="flex flex-col gap-2 min-w-fit">
                          <div className="h-10 w-24 bg-gray-200 rounded mb-2" />
                          <div className="h-10 w-24 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {/* Error State */}
            {/* Do not show error if status 400, just skip error display */}
            {/* {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-600 text-sm">
                    {typeof error === 'string' ? error : (typeof error === 'object' && 'message' in error ? (error as any).message : JSON.stringify(error))}
                  </p>
                </CardContent>
              </Card>
            )} */}
            {/* Users Grid */}
            <div className="grid gap-3">
              {filteredUsers.map((u) => {
                const isFollowing = u.id ? followStatuses[u.id] : false;
                const isFollowLoading = followLoadingStates[u.id] || false;
                const { expertDetails, interests } = u as any;
                return (
                  <Card key={u.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* User Image */}
                        <div className="flex-shrink-0">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 text-xl font-bold border-2 border-gray-200">
                              {getInitials(u.name)}
                            </div>
                          )}
                        </div>
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {u.name}
                                {u.role && u.role.toUpperCase() === "EXPERT" && (
                                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                                    Expert
                                  </Badge>
                                )}
                                {u.role && u.role.toUpperCase() === "ADMIN" && (
                                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 text-xs">
                                    Admin
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">{u.email}</p>
                              <div className="flex items-center text-xs text-gray-500 mb-1">
                                <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                <span>
                                  {typeof u.location === 'string'
                                    ? u.location
                                    : u.location
                                      ? [u.location.city, u.location.country].filter(Boolean).join(', ')
                                      : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Bio */}
                          {u.bio && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{u.bio}</p>}
                          {/* Expertise (for experts) */}
                          {u.role && u.role.toUpperCase() === "EXPERT" && expertDetails?.expertise && expertDetails.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {expertDetails.expertise.slice(0, 3).map((item: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {/* Interests (for users) */}
                          {u.role && u.role.toUpperCase() === "USER" && interests && interests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {interests.slice(0, 3).map((item: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col items-end min-w-fit justify-between h-full">
                          {/* Follow Button */}
                          <div className="flex gap-2 w-full">
                            <Button
                              onClick={() => handleViewProfile(u)}
                              className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 text-base w-full"
                            >
                              View Profile
                            </Button>
                            <Button
                              onClick={() => handleFollow(u)}
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
            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {pagination.page} of {pagination.pages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
