"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiUserAdd } from "react-icons/hi";

const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Piano Instructor & Music Theory",
    location: "New York, NY",
    rating: 4.8,
    reviews: 129,
    categories: ["Music Theory", "Composition"],
    image:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D",
    status: "Featured",
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Software Engineering Mentor",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 287,
    categories: ["Web Development", "AI/ML"],
    image:
      "https://images.unsplash.com/photo-1726066012822-d22831b628d9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8c29mdHdhcmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 3,
    name: "Emma Davis",
    title: "Certified Yoga Instructor",
    location: "Los Angeles, CA",
    rating: 4.7,
    reviews: 180,
    categories: ["Yoga", "Wellness"],
    image:
      "https://images.unsplash.com/photo-1661308411865-4fce7576bef8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHlvZ2ElMjBtZW50b2lyfGVufDB8fDB8fHww",
    status: "Featured",
  },
  {
    id: 4,
    name: "David Rodriguez",
    title: "Business Strategy Consultant",
    location: "Remote",
    rating: 4.6,
    reviews: 94,
    categories: ["Startup", "Finance"],
    image:
      "https://images.unsplash.com/photo-1551836022-b06985bceb24?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBtZW50b3J8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 5,
    name: "Jennifer Lee",
    title: "Language Tutor - Spanish & French",
    location: "Paris, France",
    rating: 4.9,
    reviews: 177,
    categories: ["Languages", "Travel"],
    image:
      "https://plus.unsplash.com/premium_photo-1661384194958-20679b63484b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFuZ2F1Z2UlMjBtZW50b3J8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    name: "Robert Kim",
    title: "Audio Engineering & Music Production",
    location: "Remote",
    rating: 4.8,
    reviews: 153,
    categories: ["Sound Design", "Studio Setup"],
    image:
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVkaW98ZW58MHx8MHx8fDA%3D",
    status: "Featured",
  },
  {
    id: 7,
    name: "Olivia Martinez",
    title: "Photography & Visual Arts Instructor",
    location: "Austin, TX",
    rating: 4.6,
    reviews: 88,
    categories: ["Photography", "Creative Arts"],
    image:
      "https://plus.unsplash.com/premium_photo-1682097066897-209d0d9e9ae5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
    status: "New",
  },
  {
    id: 8,
    name: "James Wilson",
    title: "Math & Science Tutor",
    location: "Remote",
    rating: 4.9,
    reviews: 191,
    categories: ["Mathematics", "Physics"],
    image:
      "https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVhY2hlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 9,
    name: "Sophia Patel",
    title: "Health & Wellness Coach",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 104,
    categories: ["Nutrition", "Self Care"],
    image:
      "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D",
    status: "Featured",
  },
];

export default function ExpertsPage() {
  const router = useRouter();
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
                href="/register"
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
          {mentors.map((mentor) => (
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
                {mentor.categories.map((cat, i) => (
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

const experts = [
  {
    title: "Creative Writing",
    description:
      "Unlock your potential in global writing with Expertship from experienced professionals.",
    tags: ["Writing", "Short Stories", "Professional Coaching"],
    image:
      "https://plus.unsplash.com/premium_photo-1664372145543-d60ba2756a7e?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Hair Styling Expertise",
    description:
      "Enhance your skills in modern hair design and salon trends with pro-level coaching.",
    tags: ["Hair Styling", "Salon Practice"],
    image:
      "https://plus.unsplash.com/premium_photo-1661668935701-2429eb4da878?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFpciUyMHN0eWxpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Music Production",
    description: "Learn the art of music creation from industry professionals.",
    tags: ["Production", "Technology", "Session Process"],
    image:
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWMlMjBwcm9kdWN0aW9ufGVufDB8fDB8fHww",
  },
  {
    title: "Skincare Guidance",
    description:
      "Get access to skincare professionals to build custom routines.",
    tags: ["Creative Routine", "Skin Coaching Techniques"],
    image:
      "https://images.unsplash.com/photo-1674867688579-f46e18cd57f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNraW4lMjBjYXJlJTIwZ3VpZGFuY2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Yoga Instruction",
    description:
      "Discover new vitality through personal virtual yoga sessions.",
    tags: ["Wellness", "Mindfulness Practice", "Well-Being"],
    image:
      "https://plus.unsplash.com/premium_photo-1669446008800-9a124b0fd3a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Engineering Solutions",
    description:
      "Collaborate with experts to tackle complex challenges effectively.",
    tags: ["Innovation", "Systems Design", "Project Management"],
    image:
      "https://images.unsplash.com/photo-1727522974631-c8779e7de5d2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVuZ2luZWVyaW5nJTIwc29sdXRvbnN8ZW58MHx8MHx8fDA%3D",
  },
];
