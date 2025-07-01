"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiUserAdd } from "react-icons/hi";
import { useEffect } from "react";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";

export default function ExpertsPage() {
  const router = useRouter();
  const {
    experts,
    isLoading,
    error,
    fetchExperts,
  } = useAllExpertsStore();

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  if (isLoading) {
    return <div className="text-center py-20">Loading experts...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-neutral-900/40 to-neutral-900/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left space-y-10">
              <div className="inline-block px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                Expert Network
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                Connect with Top{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  Experts
                </span>
              </h1>

              <p className="text-xl text-neutral-200 leading-relaxed max-w-2xl">
                Discover a diverse range of experts who can help you level up
                your career, hobby, or personal growth journey. Get personalized
                guidance from industry leaders.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-start pt-4">
                <Link
                  href="/becomeanexpert"
                  className="px-10 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 text-lg"
                >
                  <HiUserAdd className="text-2xl" />
                  Join Now
                </Link>
                <Link
                  href="/allexperts"
                  className="px-10 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm flex items-center gap-3 text-lg"
                >
                  Explore Experts
                </Link>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-8 pt-12">
                {[
                  { number: "1000+", label: "Active Experts" },
                  { number: "50+", label: "Categories" },
                  { number: "95%", label: "Success Rate" },
                  { number: "24/7", label: "Support" },
                ].map((stat) => (
                  <div key={stat.label} className="text-left">
                    <div className="inline-block px-6 py-4 rounded-xl bg-neutral-900/40 backdrop-blur-sm border border-neutral-700/50">
                      <div className="text-3xl font-bold text-green-500 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-base text-neutral-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Featured Expert Card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop"
                    alt="Featured Expert"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h3 className="text-white text-xl font-semibold">
                      Sarah Johnson
                    </h3>
                    <p className="text-green-400 text-base">Featured Expert</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-lg">4.9 (128 reviews)</span>
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed">
                    "Join our community of experts and share your knowledge with
                    the world. Make a difference in people's lives through
                    mentorship."
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Mentorship", "Career Growth", "Leadership"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet Our <span className="text-green-600">Experts</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((mentor) => (
            <div
              key={mentor.id}
              className="relative bg-white/60 backdrop-blur-lg border border-green-100 rounded-3xl shadow-xl p-6 flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group overflow-hidden"
            >
              {/* Status Badge */}
              {mentor.status && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                  {mentor.status}
                </span>
              )}
              {/* Profile Image */}
              <div className="mb-4 z-10 flex justify-center w-full">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover mx-auto group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              {/* Name & Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                {mentor.name}
              </h2>
              <p className="text-sm text-green-600 font-medium mb-1 text-center">
                {mentor.title}
              </p>
              <p className="text-xs text-gray-400 mb-2 text-center">
                {typeof mentor.location === 'object' && mentor.location !== null
                  ? [mentor.location.address, mentor.location.country].filter(Boolean).join(', ')
                  : mentor.location}
              </p>
              {/* Rating */}
              <div className="flex items-center justify-center text-sm mb-2">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-semibold text-gray-700">
                  {mentor.rating}
                </span>
                <span className="text-gray-500 ml-1">
                  ({mentor.reviews} reviews)
                </span>
              </div>
              {/* Categories - Wire Design */}
              {mentor.categories && mentor.categories.length > 0 && (
                <div className="flex flex-col items-center mb-4 w-full">
                  {/* Main Category */}
                  <div className="font-semibold text-green-700 text-sm mb-1">
                    {mentor.categories[0]}
                  </div>
                  {/* Wire and Subcategories */}
                  {mentor.categories.length > 1 && (
                    <div className="flex items-center w-full justify-center">
                      {/* Wire left */}
                      <div className="h-0.5 bg-green-200 flex-1" />
                      {/* Subcategories */}
                      <div className="flex gap-2 px-2">
                        {mentor.categories.slice(1).map((cat, i) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      {/* Wire right */}
                      <div className="h-0.5 bg-green-200 flex-1" />
                    </div>
                  )}
                </div>
              )}
              {/* View Profile Button */}
              <Link href={"/profile"}>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-2 rounded-xl font-semibold shadow hover:from-green-600 hover:to-green-700 transition-all mt-2">
                  View Profile
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/allexperts">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
              View All
            </button>
          </Link>
        </div>
      </section>

      <div className="flex w-full my-8 items-center justify-center bg-gradient-to-r from-green-50 to-green-100 py-6">
        <Link
          href="/register"
          className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <HiUserAdd className="text-2xl" />
          <span className="text-lg">Join as Expert</span>
        </Link>
      </div>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Discover Our{" "}
              <span className="text-green-600">Unique Features</span> and
              Benefits
            </h3>
            <p className="mb-4">
              Explore the benefits of connecting with top experts across various
              industries. Get personalized Expertship, career advice, and
              more—all in one platform.
            </p>
            <Link href={"/allexperts"}>
              <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                Explore
              </button>
            </Link>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Why Choose{" "}
              <span className="text-green-600">ExpertInTheCity?</span>
            </h3>
            <p className="mb-4">
              We ensure you connect with verified professionals. Aspiring or
              experienced, this is your gateway to impactful learning and
              growth.
            </p>
            <Link href={"/about"}>
              <button className="bg-white text-black px-6 py-2 border border-black rounded hover:bg-gray-200">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Connect with Your Ideal <span className="text-green-600">Expert</span>
        </h2>
        <p className="mb-8">
          Join our community to find expert Experts ready to guide you in your
          learning journey.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={"/signup"}>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Sign Up
            </button>
          </Link>
          <Link href={"/login"}>
            <button className="bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-200">
              Log In
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
