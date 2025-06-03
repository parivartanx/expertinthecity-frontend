"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiUserAdd } from "react-icons/hi";

export default function ExpertsPage() {
  const router = useRouter();
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 to-neutral-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Decorative Elements */}
            <div className="flex justify-center">
              <div className="w-20 h-1 bg-green-500 rounded-full" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Connect with Top{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Experts
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              Discover a diverse range of experts who can help you level up your
              career, hobby, or personal growth journey. Get personalized
              guidance from industry leaders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/home/register"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join Now
              </Link>
              <Link
                href="/home"
                className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                Explore
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              {[
                { number: "1000+", label: "Active Experts" },
                { number: "50+", label: "Categories" },
                { number: "95%", label: "Success Rate" },
                { number: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-block px-4 py-2 rounded-lg bg-neutral-900/80 backdrop-blur-sm border border-neutral-700">
                    <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 text-white"
            viewBox="0 0 1440 100"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet Our <span className="text-green-600">Experts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <div key={index} className="border rounded-lg shadow-md p-4">
              <Image
                src={expert.image}
                alt={expert.title}
                width={600}
                height={400}
                className="rounded mb-4 object-cover h-48 w-full"
              />
              <h3 className="text-xl font-semibold mb-2">{expert.title}</h3>
              <p className="text-sm mb-4">{expert.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-green-700 font-medium mb-4">
                {expert.tags.map((tag, idx) => (
                  <span key={idx} className="bg-green-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={"/home/profile"}>
                <button className="text-green-600 hover:underline">
                  View profile →
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
            View All
          </button>
        </div>
      </section>

      <div className="flex w-full my-8 items-center justify-center bg-gradient-to-r from-green-50 to-green-100 py-6">
        <Link
          href="/home/register"
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
            <Link href={"/home"}>
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
            <Link href={"/home"}>
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
          <Link href={"/auth/signup"}>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Sign Up
            </button>
          </Link>
          <Link href={"/auth/login"}>
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
