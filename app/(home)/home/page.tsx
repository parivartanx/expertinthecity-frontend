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

  // Define grouped categories
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center mb-8">
          {groupedCategories.map((category) => (
            <Link
              key={category.name}
              href={`/home/categories/${encodeURIComponent(
                category.name.toLowerCase().replace(/\s+/g, "-")
              )}/subcategories`}
            >
              <div className="flex flex-col items-center gap-3 p-8 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 border border-green-200 bg-green-50">
                <span className="text-xl font-bold text-green-800 mb-2">
                  {category.name}
                </span>
                <ul className="text-sm text-neutral-700 list-disc list-inside text-left">
                  {category.subcategories.slice(0, 3).map((sub, idx) => (
                    <li key={idx}>{sub}</li>
                  ))}
                  {category.subcategories.length > 3 && (
                    <li className="text-gray-400">...and more</li>
                  )}
                </ul>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href={"/home/categories"}>
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
              <Link href={`/home/profile`}>
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold">
                  View Profile
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-6">
          <Link
            href={"/home/experts"}
            className="text-center p-2 bg-green-700  my-5 text-white  rounded font-bold"
          >
            View More
          </Link>
        </div>
      </section>
      <UnlockLearning />
      {/* <BlogSection /> */}
      <TestimonialSection />
      <FAQ />
    </main>
  );
}
