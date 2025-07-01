"use client";

import React, { useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const [showFilters, setShowFilters] = React.useState(false);

  // Store selectors
  const experts = useAllExpertsStore((state) => state.experts);
  const isLoading = useAllExpertsStore((state) => state.isLoading);
  const error = useAllExpertsStore((state) => state.error);
  const fetchExpertsByCategory = useAllExpertsStore((state) => state.fetchExpertsByCategory);
  const setFilters = useAllExpertsStore((state) => state.setFilters);

  // Filter states
  const [location, setLocation] = React.useState("");
  const [price, setPrice] = React.useState("Any Price");
  const [ratings, setRatings] = React.useState<number[]>([]);
  const [experience, setExperience] = React.useState<number[]>([]);
  const [availability, setAvailability] = React.useState<string[]>([]);

  useEffect(() => {
    if (category) {
      fetchExpertsByCategory(category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
            {category.replace(/-/g, " ")} Experts
          </h1>
          <p className="text-lg text-green-100 max-w-2xl">
            Find qualified and experienced {category.replace(/-/g, " ")}{" "}
            professionals in your area
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on mobile, shown with button */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input placeholder="Enter your location" value={location} onChange={e => setLocation(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full border rounded-md p-2 text-sm" value={price} onChange={e => setPrice(e.target.value)}>
                    <option>Any Price</option>
                    <option>£0 - £25</option>
                    <option>£26 - £50</option>
                    <option>£51 - £100</option>
                    <option>£100+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  {[5, 4, 3].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center space-x-2 py-1"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={ratings.includes(rating)}
                        onChange={() => {
                          setRatings((prev) =>
                            prev.includes(rating)
                              ? prev.filter((r) => r !== rating)
                              : [...prev, rating]
                          );
                        }}
                      />
                      <label className="text-sm text-gray-600">
                        {rating}★ & up
                      </label>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={experience.includes(5)}
                        onChange={() => {
                          setExperience((prev) =>
                            prev.includes(5)
                              ? prev.filter((e) => e !== 5)
                              : [...prev, 5]
                          );
                        }}
                      />
                      <label className="text-sm text-gray-600">5+ years</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={experience.includes(10)}
                        onChange={() => {
                          setExperience((prev) =>
                            prev.includes(10)
                              ? prev.filter((e) => e !== 10)
                              : [...prev, 10]
                          );
                        }}
                      />
                      <label className="text-sm text-gray-600">10+ years</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={availability.includes("today")}
                        onChange={() => {
                          setAvailability((prev) =>
                            prev.includes("today")
                              ? prev.filter((a) => a !== "today")
                              : [...prev, "today"]
                          );
                        }}
                      />
                      <label className="text-sm text-gray-600">
                        Available Today
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={availability.includes("week")}
                        onChange={() => {
                          setAvailability((prev) =>
                            prev.includes("week")
                              ? prev.filter((a) => a !== "week")
                              : [...prev, "week"]
                          );
                        }}
                      />
                      <label className="text-sm text-gray-600">
                        Available This Week
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                // Map UI state to store filter keys
                setFilters({
                  location: location || undefined,
                  rating: ratings.length > 0 ? Math.max(...ratings) : undefined,
                  priceRange: price !== "Any Price" ? (() => {
                    if (price === "£0 - £25") return { min: 0, max: 25 };
                    if (price === "£26 - £50") return { min: 26, max: 50 };
                    if (price === "£51 - £100") return { min: 51, max: 100 };
                    if (price === "£100+") return { min: 100, max: 10000 };
                    return undefined;
                  })() : undefined,
                  availability: availability.length > 0 ? availability.join(",") : undefined,
                  // Add more mappings as needed
                });
                fetchExpertsByCategory(category);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Experts List */}
          <div className="lg:w-3/4">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input placeholder="Search experts..." className="flex-1" />
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <FaFilter className="mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading experts...</div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Error loading experts
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
              </div>
            )}

            {/* Experts Grid */}
            {!isLoading && !error && experts.length > 0 && (
              <div className="space-y-6">
                {experts.map((expert) => (
                  <div
                    key={expert.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              {expert.name}
                            </h2>
                            {expert.experience && (
                              <span className="text-sm text-gray-500">
                                {expert.experience}+ years experience
                              </span>
                            )}
                          </div>
                          {expert.hourlyRate && (
                            <span className="text-green-600 font-medium">
                              £{expert.hourlyRate}/hr
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{expert.location}</span>
                        </div>
                        {expert.description && (
                          <p className="text-gray-600 mb-3">{expert.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {expert.tags && expert.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-yellow-500">
                            <FaStar className="mr-1" />
                            <span className="text-gray-900 font-medium">
                              {expert.rating} ({expert.reviews} reviews)
                            </span>
                          </div>
                          {expert.availability && (
                            <span className="text-green-600 text-sm">
                              {expert.availability}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !error && experts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No experts found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  Adjust Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
