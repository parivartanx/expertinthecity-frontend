"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Expert {
  id: string;
  name: string;
  title?: string;
  location: string;
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
}

export default function SubcategoryExpertsPage() {
  const params = useParams();
  const { category, subcategory } = params;
  const subcatKey = (subcategory as string).toLowerCase();
  const subcatName = decodeURIComponent(subcategory as string).replace(/-/g, " ");
  const categoryName = decodeURIComponent(category as string).replace(/-/g, " ");

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("rating");

  // Store hooks
  const {
    experts,
    isLoading: expertsLoading,
    error: expertsError,
    totalExperts,
    totalPages,
    fetchExpertsBySubcategory,
    searchExperts,
    filterExperts,
    clearError: clearExpertsError,
  } = useAllExpertsStore();

  const {
    categories,
    subcategories,
    currentSubcategory,
    currentCategory,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchAllCategories,
    fetchAllSubcategories,
    fetchSubcategoryById,
    fetchCategoryById,
    clearError: clearCategoriesError,
  } = useCategoriesStore();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchAllCategories();
    fetchAllSubcategories();
  }, [fetchAllCategories, fetchAllSubcategories]);

  // Find subcategory by name/slug and fetch its details
  useEffect(() => {
    if (subcatKey && subcategories.length > 0) {
      // Try to find subcategory by name (case-insensitive)
      const foundSubcategory = subcategories.find(
        sub => sub.name.toLowerCase().replace(/\s+/g, '-') === subcatKey ||
          sub.name.toLowerCase() === subcatKey.replace(/-/g, ' ')
      );

      if (foundSubcategory) {
        fetchSubcategoryById(foundSubcategory.id);
      }
    }

    return () => {
      clearCategoriesError();
    };
  }, [subcatKey, subcategories, fetchSubcategoryById, clearCategoriesError, category]);

  // Fetch experts for the subcategory
  useEffect(() => {
    if (currentSubcategory) {
      fetchExpertsBySubcategory(currentSubcategory.name, currentPage, 12);
    }

    return () => {
      clearExpertsError();
    };
  }, [currentSubcategory, currentPage, fetchExpertsBySubcategory, clearExpertsError]);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchExperts(searchQuery, 1, 12);
    } else if (currentSubcategory) {
      fetchExpertsBySubcategory(currentSubcategory.name, 1, 12);
    }
    setCurrentPage(1);
  };

  // Handle filtering
  const handleFilter = () => {
    const filters: any = {};

    if (selectedRating) {
      filters.rating = parseInt(selectedRating);
    }

    if (selectedLocation) {
      filters.location = selectedLocation;
    }

    if (Object.keys(filters).length > 0) {
      filterExperts(filters, 1, 12);
    } else if (currentSubcategory) {
      fetchExpertsBySubcategory(currentSubcategory.name, 1, 12);
    }
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton component
  const ExpertSkeleton = () => (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-48 w-full rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  const isLoading = expertsLoading || categoriesLoading;
  const error = expertsError || categoriesError;

  return (
    <main className="max-w-7xl mx-auto py-16 px-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          {currentSubcategory?.name || subcatName}
        </h1>
        {currentSubcategory?.category && (
          <p className="text-gray-600">
            Category: {currentSubcategory.category.name}
          </p>
        )}
        {totalExperts > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {totalExperts} expert{totalExperts !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Experts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search experts by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Location</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              Search
            </Button>
            <Button onClick={handleFilter} variant="outline" disabled={isLoading}>
              Apply Filters
            </Button>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedRating("");
                setSelectedLocation("");
                if (currentSubcategory) {
                  fetchExpertsBySubcategory(currentSubcategory.name, 1, 12);
                }
                setCurrentPage(1);
              }}
              variant="ghost"
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExpertSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">{error}</p>
            <div className="text-center mt-4">
              <Button onClick={() => {
                if (currentSubcategory) {
                  fetchExpertsBySubcategory(currentSubcategory.name, currentPage, 12);
                }
              }}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && experts.length === 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">No experts found for {currentSubcategory?.name || subcatName}</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search criteria or check back later for new experts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Experts Grid */}
      {!isLoading && !error && experts.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert: Expert) => (
              <Card key={expert.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {expert.status && (
                      <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
                        {expert.status}
                      </Badge>
                    )}
                    {expert.verified && (
                      <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{expert.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{expert.title}</p>
                  <p className="text-xs text-gray-400 mb-2">{expert.location}</p>

                  <div className="flex items-center text-sm mb-2">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {expert.rating} ({expert.reviews} reviews)
                  </div>

                  {expert.hourlyRate && (
                    <p className="text-sm text-green-600 font-medium mb-2">
                      ${expert.hourlyRate}/hour
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 text-xs mb-4">
                    {(expert.categories ?? []).slice(0, 3).map((cat: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                    {(expert.categories ?? []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(expert.categories ?? []).length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Link href={`/profile/${expert.id}`}>
                    <Button
                      className="w-full"
                    >
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
