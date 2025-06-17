"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";

// Grouped categories and subcategories
const groupedCategories = [
  {
    name: "Professional & Business Support",
    subcategories: [
      "Financial Advice & Investment Planning",
      "Tax Planning & Cross-Border Compliance",
      "Legal Consultations & Contract Help",
      "Business Mentorship & Start-Up Support",
      "Real Estate Help & Relocation Support",
      "IT Consultants & Tech Solutions",
      "Crypto & Blockchain Experts",
      "Career Counsellors & Transition Coaches",
      "Personal Branding, Resume & LinkedIn Strategy",
    ],
  },
  {
    name: "Health, Wellness & Medical Guidance",
    subcategories: [
      "General Wellness Coaching (Nutrition, Sleep, Stress)",
      "Mental Health & Emotional Resilience Coaching",
      "Fitness Trainers & Online Health Programs",
      "Yoga, Pilates & Holistic Movement Instructors",
      "Medical Experts & Health Educators (non-diagnostic or second-opinion services)",
      "Preventive Health & Lifestyle Medicine Consultants",
    ],
  },
  {
    name: "Career & Education Support",
    subcategories: [
      "Career Counselling for Students & Professionals",
      "College Admissions & Study Abroad Advisors",
      "Upskilling Mentors & Job Market Guidance",
      "CV, Cover Letter, LinkedIn & Interview Prep Experts",
    ],
  },
  {
    name: "Life & Lifestyle Guidance",
    subcategories: [
      "Travel & Relocation Consultants",
      "Parenting Coaches & Family Advisors",
      "Relationship Coaches & Conflict Mediators",
      "Life Coaching & Mindset Mentorship",
    ],
  },
  {
    name: "Creative, Art & Expression",
    subcategories: [
      "Art Mentors & Portfolio Reviewers",
      "Design & Illustration Coaching",
      "Photography & Filmmaking Mentors",
      "Writing, Blogging & Creative Content Experts",
      "Music Instructors, Producers & Vocal Coaches",
      "Dance, Theatre & Performing Arts Coaches",
    ],
  },
  {
    name: "Sports, Performance & Movement",
    subcategories: [
      "Sports Coaches (Football, Tennis, Cricket, etc.)",
      "Athlete Mindset & Performance Coaching",
      "Dance Instructors & Competitive Prep",
      "Body Mechanics, Flexibility & Strength Trainers",
    ],
  },
];

// Subcategory to experts mapping (sample for 2 subcategories, add more as needed)
const subcategoryExperts: Record<string, any[]> = {
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
};
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
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Get experts for selected subcategory
  const subcatKey = selectedSubcategory?.toLowerCase() || "";
  const experts = subcategoryExperts[subcatKey] || fallbackExperts;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {groupedCategories.map((cat) => (
            <div
              key={cat.name}
              className="relative bg-white/90 border border-green-100 rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-200 hover:shadow-2xl group"
            >
              {/* Main Category */}
              <div className="w-full mb-4">
                <div className="text-lg md:text-xl font-bold text-green-800 mb-2 px-1">
                  {cat.name}
                </div>
                <div className="border-b border-green-100 mb-2" />
              </div>
              {/* Subcategories List */}
              <ul className="w-full space-y-1">
                {cat.subcategories.map((subcat) => (
                  <li key={subcat}>
                    <Link
                      href={`/allexperts?category=${encodeURIComponent(
                        subcat.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-green-900 bg-green-50 hover:bg-green-100 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-200`}
                    >
                      <span>{subcat}</span>
                      <HiChevronRight className="text-lg text-green-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {selectedSubcategory && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Experts for "{selectedSubcategory.replace(/-/g, " ")}"
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

      <div className="mt-16 bg-gray-50 py-12  rounded-lg text-center">
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
