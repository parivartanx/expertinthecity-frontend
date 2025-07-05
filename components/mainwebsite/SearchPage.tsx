"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaUserTie,
  FaMapMarkerAlt,
  FaBriefcase,
  FaStar,
  FaSpinner,
} from "react-icons/fa";
import { useAllExpertsStore } from "../../lib/mainwebsite/all-experts-store";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    experts,
    isLoading,
    error,
    searchExperts,
    clearExperts,
    clearError,
  } = useAllExpertsStore();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Search experts when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchExperts(debouncedQuery);
    } else {
      clearExperts();
    }
  }, [debouncedQuery, searchExperts, clearExperts]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const handleExpertClick = (expertId: string) => {
    window.location.href = `/experts/${expertId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-2 text-green-700 tracking-tight">
          Search Experts
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          Find professionals by name, skill, or location
        </p>

        {/* Search Input */}
        <div className="relative mb-10">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-green-600 text-xl" />
          <input
            type="text"
            placeholder="Search by name, skill, or location..."
            className="w-full pl-14 pr-5 py-3 rounded-2xl border border-green-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-lg shadow-sm transition-all"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isLoading && (
            <FaSpinner className="absolute right-5 top-1/2 -translate-y-1/2 text-green-600 text-xl animate-spin" />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-red-500 hover:text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Empty states */}
        {query.trim() === "" && !isLoading && (
          <div className="text-center text-gray-400 py-20 w-full">
            <FaSearch className="mx-auto text-5xl mb-4 text-green-100" />
            <p className="text-xl font-medium">
              Start typing to search for experts
            </p>
          </div>
        )}

        {query.trim() !== "" && !isLoading && experts.length === 0 && !error && (
          <div className="text-center text-gray-400 py-20 w-full">
            <p className="text-xl font-medium">
              No results found for "
              <span className="text-green-600">{query}</span>"
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20 w-full">
            <FaSpinner className="mx-auto text-5xl mb-4 text-green-600 animate-spin" />
            <p className="text-xl font-medium text-gray-600">
              Searching for experts...
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && experts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <div
                key={expert.id}
                onClick={() => handleExpertClick(expert.id)}
                className="group cursor-pointer bg-white rounded-2xl border border-green-100 hover:border-green-300 shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
              >
                <img
                  src={expert.image || "https://randomuser.me/api/portraits/men/1.jpg"}
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-green-600 shadow-sm mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
                  <FaUserTie className="text-green-600" /> {expert.name}
                </h2>
                <p className="text-gray-600 flex items-center gap-1 mb-1 text-sm">
                  <FaBriefcase className="text-green-500" /> {expert.title || "Expert"}
                </p>
                <p className="text-gray-600 flex items-center gap-1 text-sm">
                  <FaMapMarkerAlt className="text-green-500" /> {
                    typeof expert.location === 'string'
                      ? expert.location
                      : expert.location?.address && expert.location?.country
                        ? `${expert.location.address}, ${expert.location.country}`
                        : expert.location?.address || expert.location?.country || 'Remote'
                  }
                </p>

                {/* Rating */}
                {expert.rating > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-gray-600">
                      {expert.rating.toFixed(1)} ({expert.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Expertise */}
                {expert.expertise && expert.expertise.length > 0 && (
                  <div className="mt-2 text-green-600 font-medium text-sm italic">
                    {expert.expertise.slice(0, 3).join(", ")}
                    {expert.expertise.length > 3 && "..."}
                  </div>
                )}

                {/* Hourly Rate */}
                {expert.hourlyRate && (
                  <div className="mt-2 text-gray-600 text-sm">
                    <span className="font-semibold">${expert.hourlyRate}</span>/hr
                  </div>
                )}

                {/* Verified Badge */}
                {expert.verified && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verified Expert
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpertClick(expert.id);
                  }}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition-all"
                >
                  View Profile <span className="text-base">→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
