"use client";

import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for experts in each category
const categoryExperts = {
  plumbing: [
    {
      id: 1,
      name: "John Smith",
      location: "London, UK",
      description:
        "Professional plumber with over 15 years of experience in residential and commercial plumbing services. Specializes in emergency repairs and new installations.",
      tags: ["Plumbing", "Heating", "Bathroom Installation"],
      rating: 4.9,
      reviews: 124,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      hourlyRate: "£45",
      availability: "Available Today",
      experience: "15+ years",
      verified: true,
    },
    {
      id: 2,
      name: "Mike Johnson",
      location: "Manchester, UK",
      description:
        "Certified plumber specializing in emergency repairs and new installations. Expert in modern plumbing systems and sustainable solutions.",
      tags: ["Emergency Repairs", "Installations", "Maintenance"],
      rating: 4.8,
      reviews: 98,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      hourlyRate: "£40",
      availability: "Available Tomorrow",
      experience: "10+ years",
      verified: true,
    },
    {
      id: 3,
      name: "David Wilson",
      location: "Birmingham, UK",
      description:
        "Master plumber with expertise in complex plumbing systems and renovations. Known for attention to detail and quality workmanship.",
      tags: ["Renovations", "System Design", "Quality Control"],
      rating: 4.9,
      reviews: 156,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      hourlyRate: "£50",
      availability: "Available This Week",
      experience: "20+ years",
      verified: true,
    },
  ],
  electrical: [
    {
      id: 4,
      name: "Sarah Wilson",
      location: "Birmingham, UK",
      description:
        "Licensed electrician with expertise in residential and commercial electrical systems. Specializes in smart home installations and energy-efficient solutions.",
      tags: ["Electrical Repairs", "Smart Home", "Safety Inspections"],
      rating: 4.9,
      reviews: 156,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      hourlyRate: "£50",
      availability: "Available Today",
      experience: "12+ years",
      verified: true,
    },
    {
      id: 5,
      name: "James Thompson",
      location: "Leeds, UK",
      description:
        "Certified electrical engineer specializing in industrial installations and maintenance. Expert in complex electrical systems and troubleshooting.",
      tags: ["Industrial", "Maintenance", "System Design"],
      rating: 4.7,
      reviews: 89,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      hourlyRate: "£55",
      availability: "Available Next Week",
      experience: "15+ years",
      verified: true,
    },
  ],
  cleaning: [
    {
      id: 6,
      name: "Emma Davis",
      location: "London, UK",
      description:
        "Professional cleaner with expertise in residential and commercial spaces. Specializes in deep cleaning and eco-friendly solutions.",
      tags: ["Deep Cleaning", "Eco-Friendly", "Commercial"],
      rating: 4.8,
      reviews: 203,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      hourlyRate: "£30",
      availability: "Available Today",
      experience: "8+ years",
      verified: true,
    },
    {
      id: 7,
      name: "Sophie Anderson",
      location: "Manchester, UK",
      description:
        "Experienced cleaner focusing on residential properties. Known for attention to detail and reliable service.",
      tags: ["Residential", "Regular Cleaning", "Move-in/Move-out"],
      rating: 4.9,
      reviews: 167,
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      hourlyRate: "£28",
      availability: "Available Tomorrow",
      experience: "6+ years",
      verified: true,
    },
  ],
  gardening: [
    {
      id: 8,
      name: "Robert Green",
      location: "Bristol, UK",
      description:
        "Professional gardener with expertise in landscape design and maintenance. Specializes in sustainable gardening practices.",
      tags: ["Landscaping", "Maintenance", "Design"],
      rating: 4.9,
      reviews: 145,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      hourlyRate: "£35",
      availability: "Available This Week",
      experience: "12+ years",
      verified: true,
    },
    {
      id: 9,
      name: "Mary Brown",
      location: "Edinburgh, UK",
      description:
        "Certified horticulturist offering garden design and maintenance services. Expert in organic gardening and plant care.",
      tags: ["Organic", "Plant Care", "Garden Design"],
      rating: 4.8,
      reviews: 98,
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      hourlyRate: "£32",
      availability: "Available Next Week",
      experience: "10+ years",
      verified: true,
    },
  ],
  tutoring: [
    {
      id: 10,
      name: "Dr. Michael Chen",
      location: "Cambridge, UK",
      description:
        "PhD in Mathematics with 10+ years of teaching experience. Specializes in advanced mathematics and exam preparation.",
      tags: ["Mathematics", "Exam Prep", "Online Tutoring"],
      rating: 4.9,
      reviews: 234,
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      hourlyRate: "£60",
      availability: "Available Today",
      experience: "10+ years",
      verified: true,
    },
    {
      id: 11,
      name: "Dr. Sarah Parker",
      location: "Oxford, UK",
      description:
        "Experienced English literature tutor with expertise in essay writing and literary analysis. Specializes in GCSE and A-Level preparation.",
      tags: ["English", "Essay Writing", "Literature"],
      rating: 4.8,
      reviews: 189,
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      hourlyRate: "£55",
      availability: "Available Tomorrow",
      experience: "8+ years",
      verified: true,
    },
  ],
  photography: [
    {
      id: 12,
      name: "Alex Morgan",
      location: "London, UK",
      description:
        "Professional photographer specializing in portrait and event photography. Known for capturing authentic moments and emotions.",
      tags: ["Portraits", "Events", "Commercial"],
      rating: 4.9,
      reviews: 167,
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      hourlyRate: "£75",
      availability: "Available This Week",
      experience: "12+ years",
      verified: true,
    },
    {
      id: 13,
      name: "Lisa Wong",
      location: "Manchester, UK",
      description:
        "Award-winning photographer with expertise in wedding and lifestyle photography. Specializes in natural light and candid shots.",
      tags: ["Wedding", "Lifestyle", "Natural Light"],
      rating: 4.9,
      reviews: 203,
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      hourlyRate: "£80",
      availability: "Available Next Month",
      experience: "15+ years",
      verified: true,
    },
  ],
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [showFilters, setShowFilters] = useState(false);
  const category = params.category;
  const experts =
    categoryExperts[category as keyof typeof categoryExperts] || [];

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
                  <Input placeholder="Enter your location" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full border rounded-md p-2 text-sm">
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
                      <input type="checkbox" className="rounded border-input" />
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
                      <input type="checkbox" className="rounded border-input" />
                      <label className="text-sm text-gray-600">5+ years</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-input" />
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
                      <input type="checkbox" className="rounded border-input" />
                      <label className="text-sm text-gray-600">
                        Available Today
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-input" />
                      <label className="text-sm text-gray-600">
                        Available This Week
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
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

            {/* Experts Grid */}
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
                          <span className="text-sm text-gray-500">
                            {expert.experience} experience
                          </span>
                        </div>
                        <span className="text-green-600 font-medium">
                          {expert.hourlyRate}/hr
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{expert.location}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{expert.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {expert.tags.map((tag, i) => (
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
                        <span className="text-green-600 text-sm">
                          {expert.availability}
                        </span>
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

            {/* No Results State */}
            {experts.length === 0 && (
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
