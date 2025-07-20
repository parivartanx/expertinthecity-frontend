"use client";

import Achievements from "@/components/mainwebsite/Achievements";
import CareerEarningsCard from "@/components/mainwebsite/CareerEarningsCard";
import ExpertHeroSection from "@/components/mainwebsite/ExpertHeroSection";
import FAQ from "@/components/mainwebsite/FAQ";
import FeaturedInMarquee from "@/components/mainwebsite/FeaturedInMarquee";
import HowItWorks from "@/components/mainwebsite/HowItWorks";
import TestimonialSection from "@/components/mainwebsite/TestimonialSection";
import TopRatedMentors from "@/components/mainwebsite/TopRatedMembers";
import UnlockLearning from "@/components/mainwebsite/UnlockLearning";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiChevronRight } from "react-icons/hi";

// Import stores for dynamic data
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";

// Import React Icons for categories
import {
  FaWrench,
  FaBolt,
  FaBroom,
  FaSeedling,
  FaBook,
  FaCamera,
  FaDumbbell,
  FaUtensils,
  FaChartBar,
  FaBalanceScale,
  FaLaptopCode,
  FaPaw,
} from "react-icons/fa";

export default function HomePage() {
  // Get data from stores
  const {
    experts,
    fetchExperts,
    isLoading: expertsLoading,
    clearSearchState
  } = useAllExpertsStore();

  const {
    categories,
    subcategories,
    isLoaded: categoriesLoaded,
    subcategoriesLoaded,
    fetchAllCategories,
    fetchAllSubcategories,
    isLoading: categoriesLoading
  } = useCategoriesStore();

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("");
  const [groupedCategories, setGroupedCategories] = useState<any[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Starting data fetch...");

        // Clear any search state and fetch experts
        clearSearchState();
        await fetchExperts();
        console.log("✅ Experts fetched");

        // Only fetch categories and subcategories if not already loaded
        if (!categoriesLoaded && !categoriesLoading) {
          console.log("📂 Fetching categories...");
          await fetchAllCategories();
          console.log("✅ Categories fetched:", categories.length);
        }

        // Only fetch subcategories if not already loaded and categories are loaded
        if (categoriesLoaded && !subcategoriesLoaded && !categoriesLoading) {
          console.log("📂 Fetching subcategories...");
          await fetchAllSubcategories();
          console.log("✅ Subcategories fetched:", subcategories.length);
        }

      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, [categoriesLoaded, categoriesLoading, subcategoriesLoaded]); // Removed function dependencies

  // Process categories and subcategories when data is loaded
  useEffect(() => {
    console.log("🔄 Processing categories and subcategories...");
    console.log("Categories:", categories.length);
    console.log("Subcategories:", subcategories.length);

    if (categories.length > 0 && subcategories.length > 0) {
      // Group subcategories by category
      const grouped = categories.map(category => {
        const categorySubcategories = subcategories.filter(
          sub => sub.categoryId === category.id
        );
        console.log(`📁 Category "${category.name}" has ${categorySubcategories.length} subcategories`);

        return {
          id: category.id,
          name: category.name,
          subcategories: categorySubcategories.map(sub => sub.name)
        };
      }).filter(cat => cat.subcategories.length > 0); // Only show categories with subcategories

      console.log("📊 Grouped categories:", grouped.length);
      setGroupedCategories(grouped);

      // Set first category as active tab if no active tab is set
      if (grouped.length > 0 && !activeTab) {
        setActiveTab(grouped[0].name);
        console.log("🎯 Set active tab to:", grouped[0].name);
      }
    }
  }, [categories, subcategories, activeTab]);

  // Get first 3 experts for featured section
  const featuredExperts = experts.slice(0, 3);

  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {/* Header */}
      {/* Hero Section */}
      <ExpertHeroSection />
      <Achievements />
      <FeaturedInMarquee />

      {/* Categories */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-2 text-center">
          Discover <span className="text-green-700">Experts</span> By Category
        </h2>
        <p className="text-lg text-neutral-500 mb-10 text-center">
          Browse our most requested services and find the right professional for
          your needs.
        </p>
        <div className="w-full max-w-5xl mx-auto mb-12">
          {/* Category Tabs */}
          {categoriesLoading ? (
            <div className="flex justify-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              <p className="ml-3 text-gray-600">Loading categories...</p>
            </div>
          ) : groupedCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No categories available</p>
              <button
                onClick={() => {
                  // Force refresh by clearing loaded state and refetching
                  localStorage.removeItem('categoriesLastFetch');
                  localStorage.removeItem('subcategoriesLastFetch');
                  fetchAllCategories();
                  fetchAllSubcategories();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Refresh Categories
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {groupedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none border border-green-700/30 shadow-sm
                      ${activeTab === cat.name
                        ? "bg-green-400 text-black"
                        : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                      }
                    `}
                    onClick={() => setActiveTab(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* Subcategories Capsules Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 justify-items-center">
                {groupedCategories
                  .find((cat) => cat.name === activeTab)
                  ?.subcategories.map((subcat: string) => (
                    <a
                      key={subcat}
                      href={`/connections?category=${encodeURIComponent(
                        subcat.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      className="px-6 py-4 rounded-2xl font-semibold text-center shadow-lg bg-green-400 text-black transition-all duration-200 text-base cursor-pointer w-full hover:bg-green-500"
                    >
                      {subcat}
                    </a>
                  ))}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center">
          <Link href={"/categories"}>
            <button className="mt-2 px-6 py-2 rounded border border-neutral-300 bg-white text-green-700 font-semibold hover:bg-green-50 flex items-center gap-2 shadow-sm">
              View All Categories
              <span className="text-lg">→</span>
            </button>
          </Link>
        </div>
      </section>

      {/* How it works  */}
      <HowItWorks />

      {/* Top Rated experts  */}
      <TopRatedMentors />

      {/* Featured Experts */}
      <section className="py-12 px-4 bg-neutral-50">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Featured <span className="text-green-700">Experts</span>
        </h2>

        {expertsLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredExperts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                >
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 object-cover rounded-full mb-4"
                  />
                  <div className="font-bold text-lg mb-1">{expert.name}</div>
                  <div className="text-green-700 font-medium mb-2">
                    {expert.title}
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 text-center">
                    {expert.description || expert.bio || "Professional expert in their field."}
                  </p>
                  <Link href={`/experts/${expert.id}`}>
                    <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold">
                      View Profile
                    </button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-center mt-6">
              <Link
                href={"/experts"}
                className="text-center p-2 bg-green-700 my-5 text-white rounded font-bold"
              >
                View More
              </Link>
            </div>
          </>
        )}
      </section>
      <UnlockLearning />
      {/* <BlogSection /> */}
      <TestimonialSection />
      <FAQ />
    </main>
  );
}
