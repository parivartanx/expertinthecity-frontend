"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";

// Fallback experts data
const fallbackExperts = [
  {
    id: 101,
    name: "Alex Morgan",
    title: "General Expert",
    location: "Remote",
    rating: 4.5,
    reviews: 50,
    categories: ["General"],
    image: "https://randomuser.me/api/portraits/men/99.jpg",
  },
  {
    id: 102,
    name: "Maria Lopez",
    title: "General Expert",
    location: "Remote",
    rating: 4.6,
    reviews: 60,
    categories: ["General"],
    image: "https://randomuser.me/api/portraits/women/98.jpg",
  },
  {
    id: 103,
    name: "Chen Wei",
    title: "General Expert",
    location: "Remote",
    rating: 4.7,
    reviews: 70,
    categories: ["General"],
    image: "https://randomuser.me/api/portraits/men/97.jpg",
  },
];

export default function CategoriesPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // Get categories store
  const {
    categories,
    subcategories,
    isLoading,
    error,
    isLoaded,
    fetchAllCategories,
    fetchAllSubcategories,
    clearError,
  } = useCategoriesStore();

  // Fetch categories on component mount
  useEffect(() => {
    if (!isLoaded) {
      fetchAllCategories();
    }
  }, [isLoaded, fetchAllCategories]);

  // Fetch subcategories when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      fetchAllSubcategories();
    }
  }, [categories, fetchAllSubcategories]);

  // Get experts for selected subcategory (using fallback for now)
  const experts = fallbackExperts;

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryName: string) => {
    setSelectedSubcategory(subcategoryName);
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Loading state
  if (isLoading && !isLoaded) {
    return (
      <div className="px-6 py-10">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-6 py-10">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchAllCategories();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      {/* Banner Section */}
      <section
        className="relative h-60 flex items-center justify-center text-center rounded-lg overflow-hidden mb-12"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/05/19/12/48-office-5190614_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Find Your Perfect <span className="text-green-400">Expert</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto">
            Connect with verified professionals across various fields.
          </p>
        </div>
      </section>

      {/* Discover Categories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Discover <span className="text-green-600">Experts</span> By Category
        </h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
          Browse our most requested services and find the right professional for
          your needs.
        </p>
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No categories available at the moment.</p>
            <button
              onClick={fetchAllCategories}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Refresh Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative bg-white/90 border border-green-100 rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-200 hover:shadow-2xl group"
              >
                {/* Main Category */}
                <div className="w-full mb-4">
                  <div className="text-lg md:text-xl font-bold text-green-800 mb-2 px-1">
                    {category.name}
                  </div>
                  <div className="border-b border-green-100 mb-2" />
                </div>
                
                {/* Subcategories List */}
                <ul className="w-full space-y-1">
                  {category.subcategories && category.subcategories.length > 0 ? (
                    category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          href={`/allexperts?category=${encodeURIComponent(
                            subcategory.name.toLowerCase().replace(/\s+/g, "-")
                          )}`}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-green-900 bg-green-50 hover:bg-green-100 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-200`}
                          onClick={() => handleSubcategoryClick(subcategory.name)}
                        >
                          <span>{subcategory.name}</span>
                          <HiChevronRight className="text-lg text-green-400" />
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 text-sm">
                      No subcategories available
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Selected Subcategory Experts */}
        {selectedSubcategory && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Experts for "{selectedSubcategory}"
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {experts.map((mentor: any) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-lg shadow p-4 relative"
                >
                  {mentor.status && (
                    <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {mentor.status}
                    </span>
                  )}
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h2 className="text-lg font-semibold mb-1">{mentor.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{mentor.title}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {mentor.location}
                  </p>
                  <div className="flex items-center text-sm mb-2">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {mentor.rating} ({mentor.reviews} reviews)
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {mentor.categories.map((cat: string, i: number) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded text-gray-700"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <Link href={"/profile"}>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      View Profile
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Why Choose Our Experts Section */}
      <div className="mt-16 bg-gray-50 py-12 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-6">Why Choose Our Experts?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full mx-auto">
          <div>
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-xl">
              ✅
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Verified Professionals
            </h3>
            <p className="text-sm text-gray-600">
              Every mentor is thoroughly vetted for expertise and credibility to
              ensure top-quality guidance.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-xl">
              🌟
            </div>
            <h3 className="font-semibold text-lg mb-2">Rated by Real Users</h3>
            <p className="text-sm text-gray-600">
              Genuine reviews from mentees help you make confident decisions
              based on real experiences.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-xl">
              📅
            </div>
            <h3 className="font-semibold text-lg mb-2">Flexible Scheduling</h3>
            <p className="text-sm text-gray-600">
              Book sessions at your convenience with experts available across
              time zones and weekends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
