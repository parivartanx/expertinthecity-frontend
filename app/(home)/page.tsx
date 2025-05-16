"use client";

import BlogSection from "@/components/BlogSection";
import TestimonialSection from "@/components/TestimonialSection";
import UnlockLearning from "@/components/UnlockLearning";

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

  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {/* Header */}
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1560264357-8d9202250f21?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center text-white py-16 px-4 flex flex-col justify-center items-center text-center min-h-[80vh] h-[80vh]">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-700 opacity-90 z-0" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center flex-col">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Unlock Your Potential with{" "}
            <span className="text-green-500">Expert</span> Guidance
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Join a community of learners and mentors. Get personalized advice,
            support, and insights to help you grow in every area of life.
          </p>
          <form className="flex flex-col md:flex-row gap-2 w-full max-w-xl mx-auto mb-4">
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="flex-1 px-4 py-2 rounded border border-neutral-200 text-white placeholder:text-white"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <span className="bg-green-700 text-white px-3 py-1 rounded">
              Mentorship
            </span>
            <span className="bg-white text-green-700 px-3 py-1 rounded border border-green-700">
              Career
            </span>
            <span className="bg-white text-green-700 px-3 py-1 rounded border border-green-700">
              Wellness
            </span>
            <span className="bg-white text-green-700 px-3 py-1 rounded border border-green-700">
              Business
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-2 text-center">
          Discover <span className="text-green-700">Experts</span> By Category
        </h2>
        <p className="text-lg text-neutral-500 mb-10 text-center">
          Browse our most requested services and find the right professional for
          your needs.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center mb-8">
          {[
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrical", icon: "⚡" },
            { name: "Cleaning", icon: "🧹" },
            { name: "Gardening", icon: "🌱" },
            { name: "Tutoring", icon: "📚" },
            { name: "Photography", icon: "📷" },
            { name: "Personal Training", icon: "💪" },
            { name: "Catering", icon: "🍽️" },
            { name: "Accounting", icon: "📊" },
            { name: "Legal Services", icon: "⚖️" },
            { name: "Web Design", icon: "💻" },
            { name: "Pet Care", icon: "🐾" },
          ].map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mb-1 border border-green-100">
                <span>{cat.icon}</span>
              </div>
              <span className="text-base font-semibold text-neutral-900">
                {cat.name}
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
              <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>
      <UnlockLearning />
      <BlogSection />

      <TestimonialSection />
    </main>
  );
}
