"use client";

import Link from "next/link";

export default function BlogPage() {
  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {/* Header */}

      {/* Hero Section */}
      <section className="bg-white py-12 px-4 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Our blog is your go-to hub for everything mentorship.
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl text-neutral-700">
          The ExpertInTheCity Blog is your knowledge hub for all things
          mentorship. We dive into personal growth, expert interviews, learning
          hacks, and platform updates—curated to support both learners and
          mentors in building real, meaningful progress.
        </p>
      </section>

      {/* Blog Cards */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-0 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="md:w-1/3 w-full h-40 bg-neutral-200"></div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-green-700 font-semibold text-xs mb-1">
                    Platform Tips
                  </div>
                  <h2 className="font-bold text-lg mb-2">
                    How to Make the Most of Your ExpertInTheCity Account
                  </h2>
                  <p className="text-neutral-700 text-sm mb-4">
                    From set-up guides to tracking sessions, here&apos;s how to
                    use your account for maximum growth.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>By Author</span>
                  <span>·</span>
                  <span>11 Apr 2024</span>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            "View all",
            "Music Mentorship",
            "Teaching & Learning",
            "Engineering Insights",
            "Wellness Coaching",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded border border-green-700 text-green-700 text-sm font-medium bg-white hover:bg-green-50 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-0 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="md:w-1/3 w-full h-32 bg-neutral-200"></div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-green-700 font-semibold text-xs mb-1">
                    Category
                  </div>
                  <h2 className="font-bold text-lg mb-2">Blog Title Example</h2>
                  <p className="text-neutral-700 text-sm mb-4">
                    Short summary of the blog post goes here. This is a
                    placeholder for the blog description.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>By Author</span>
                  <span>·</span>
                  <span>11 Apr 2024</span>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured/Explore Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Explore Ideas, Insights & Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 flex flex-col"
            >
              <div className="w-full h-32 bg-neutral-200 rounded mb-4"></div>
              <h3 className="font-bold text-lg mb-2">Featured Article Title</h3>
              <p className="text-neutral-700 text-sm mb-4">
                Discover actionable tips, expert stories, and mentorship wisdom
                from top professionals across music, teaching, wellness, and
                more.
              </p>
              <a href="#" className="text-green-700 underline font-medium">
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
