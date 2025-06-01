"use client";

import Achievements from "@/components/mainwebsite/Achievements";
import BlogSection from "@/components/mainwebsite/BlogSection";
import CareerEarningsCard from "@/components/mainwebsite/CareerEarningsCard";
import ExpertHeroSection from "@/components/mainwebsite/ExpertHeroSection";
import FAQ from "@/components/mainwebsite/FAQ";
import FeaturedInMarquee from "@/components/mainwebsite/FeaturedInMarquee";
import HowItWorks from "@/components/mainwebsite/HowItWorks";
import TestimonialSection from "@/components/mainwebsite/TestimonialSection";
import TopRatedMentors from "@/components/mainwebsite/TopRatedMembers";
import UnlockLearning from "@/components/mainwebsite/UnlockLearning";
import Link from "next/link";

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
  const experts = [
    {
      id: 1,
      name: "Dr. Meera Kapoor",
      specialty: "Psychologist",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      description:
        "Helping individuals unlock their emotional intelligence and manage stress effectively.",
    },
    {
      id: 2,
      name: "Rajeev Sinha",
      specialty: "Career Coach",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      description:
        "Guiding students and professionals toward the right career choices and growth strategies.",
    },
    {
      id: 3,
      name: "Anjali Verma",
      specialty: "Entrepreneurship Mentor",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      description:
        "Supporting young founders with startup strategies, pitch advice, and growth hacking.",
    },
  ];

  // Define categories with React Icons
  const categories = [
    { name: "Plumbing", icon: FaWrench },
    { name: "Electrical", icon: FaBolt },
    { name: "Cleaning", icon: FaBroom },
    { name: "Gardening", icon: FaSeedling },
    { name: "Tutoring", icon: FaBook },
    { name: "Photography", icon: FaCamera },
    { name: "Personal Training", icon: FaDumbbell },
    { name: "Catering", icon: FaUtensils },
    { name: "Accounting", icon: FaChartBar },
    { name: "Legal Services", icon: FaBalanceScale },
    { name: "Web Design", icon: FaLaptopCode },
    { name: "Pet Care", icon: FaPaw },
  ];

  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {/* Header */}
      {/* Hero Section */}
      <ExpertHeroSection />
      <FeaturedInMarquee />
      <Achievements />
      <CareerEarningsCard />

      {/* Categories */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-2 text-center">
          Discover <span className="text-green-700">Experts</span> By Category
        </h2>
        <p className="text-lg text-neutral-500 mb-10 text-center">
          Browse our most requested services and find the right professional for
          your needs.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center mb-8">
          {/* Map over the categories array with React Icons */}
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-2xl mb-1 border border-green-200">
                <category.icon /> {/* Use the React Icon component */}
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {category.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="mt-2 px-6 py-2 rounded border border-neutral-300 bg-white text-green-700 font-semibold hover:bg-green-50 flex items-center gap-2 shadow-sm">
            View All Services
            <span className="text-lg">→</span>
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {experts.map((expert) => (
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
                {expert.specialty}
              </div>
              <p className="text-sm text-neutral-600 mb-4 text-center">
                {expert.description}
              </p>
              <Link href={`/home/profile/${expert.id}`}>
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold">
                  View Profile
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <UnlockLearning />
      {/* <BlogSection /> */}
      <TestimonialSection />
      <FAQ />
    </main>
  );
}
