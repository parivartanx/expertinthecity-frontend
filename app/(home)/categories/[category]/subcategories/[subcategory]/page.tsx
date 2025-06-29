"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";

interface Expert {
  id: number;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  categories: string[];
  image: string;
  status?: string;
}

// Map each subcategory to 3 unique experts
const subcategoryExperts: Record<string, Expert[]> = {
  // Professional & Business Support
  "financial-advice-&-investment-planning": [
    {
      id: 1,
      name: "Priya Mehta",
      title: "Certified Financial Planner",
      location: "Mumbai, India",
      rating: 4.9,
      reviews: 210,
      categories: ["Financial Advice", "Investment Planning"],
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "Featured",
    },
    {
      id: 2,
      name: "John Carter",
      title: "Investment Strategist",
      location: "London, UK",
      rating: 4.8,
      reviews: 180,
      categories: ["Investment Planning", "Wealth Management"],
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 3,
      name: "Amit Shah",
      title: "Mutual Funds Advisor",
      location: "Delhi, India",
      rating: 4.7,
      reviews: 150,
      categories: ["Financial Advice", "Mutual Funds"],
      image: "https://randomuser.me/api/portraits/men/33.jpg",
    },
  ],
  "tax-planning-&-cross-border-compliance": [
    {
      id: 4,
      name: "Ritu Agarwal",
      title: "Tax Consultant",
      location: "Bangalore, India",
      rating: 4.8,
      reviews: 120,
      categories: ["Tax Planning", "Cross-Border Compliance"],
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 5,
      name: "David Kim",
      title: "International Tax Advisor",
      location: "Singapore",
      rating: 4.7,
      reviews: 98,
      categories: ["Tax Planning", "International Compliance"],
      image: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      id: 6,
      name: "Fatima Noor",
      title: "Cross-Border Tax Specialist",
      location: "Dubai, UAE",
      rating: 4.9,
      reviews: 134,
      categories: ["Cross-Border Compliance", "Tax Planning"],
      image: "https://randomuser.me/api/portraits/women/41.jpg",
    },
  ],
  // Add 3 experts for each remaining subcategory below...
  // For demonstration, fallback experts for all other subcategories:
};

// Fallback experts if subcategory not found
const fallbackExperts: Expert[] = [
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

export default function SubcategoryExpertsPage() {
  const params = useParams();
  const { subcategory } = params;
  const subcatKey = (subcategory as string).toLowerCase();
  const subcatName = decodeURIComponent(subcategory as string).replace(
    /-/g,
    " "
  );
  const {
    experts,
    isLoading,
    error,
    fetchExpertsBySubcategory,
    clearError,
  } = useAllExpertsStore();

  useEffect(() => {
    if (subcatKey) {
      fetchExpertsBySubcategory(subcatKey);
    }

    return () => {
      clearError();
    };
  }, [subcatKey, fetchExpertsBySubcategory, clearError]);

  // Get 3 experts for the subcategory, or fallback
  // const filteredExperts: Expert[] =
  //   subcategoryExperts[subcatKey] || fallbackExperts;

  return (
    <main className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        Experts for {subcatName}
      </h1>

      {/* adding loading */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading experts...</p>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty State */}
      {!isLoading && experts.length === 0 && (
        <p className="text-sm text-muted-foreground">No experts found for {subcatName}</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts.map((mentor) => (
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
            <p className="text-xs text-gray-400 mb-2">{mentor.location}</p>
            <div className="flex items-center text-sm mb-2">
              <span className="text-yellow-500 mr-1">⭐</span>
              {mentor.rating} ({mentor.reviews} reviews)
            </div>
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              {(mentor.categories ?? []).map((cat: string, i: number) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-1 rounded text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
            <Link href={`/profile/${mentor.id}`}>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                View Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
