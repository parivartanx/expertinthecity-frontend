"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const blogCards = [
    {
      title: "How to Make the Most of Your ExpertInTheCity Account",
      description:
        "From set-up guides to tracking sessions, here’s how to use your account for maximum growth.",
      category: "Platform Tips",
      author: "Jane Doe",
      date: "11 Apr 2024",
      timeToRead: "5 min read",
      img: "https://images.unsplash.com/photo-1553559707-0d8e571f58e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVudG9yfGVufDB8fDB8fHww",
    },
    {
      title: "Master Your Mentorship Journey",
      description:
        "Key strategies to enhance your mentorship experience and create lasting impact.",
      category: "Teaching & Learning",
      author: "John Smith",
      date: "18 Apr 2024",
      timeToRead: "6 min read",
      img: "https://images.unsplash.com/photo-1683208231012-0995e510b219?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const featuredCards = [
    {
      title: "How to Choose the Right Mentor",
      description:
        "Get tips from top coaches on how to identify and engage with the right mentor.",
      img: "https://plus.unsplash.com/premium_photo-1666299431654-b532de094d5a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1lbnRvcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      title: "Top Learning Hacks from Experts",
      description:
        "Boost your productivity with these science-backed strategies used by pros.",
      img: "https://plus.unsplash.com/premium_photo-1668383778560-4774a0a90565?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fG1lbnRvcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      title: "Real Stories of Transformational Mentorship",
      description:
        "Read real experiences that showcase the power of mentorship done right.",
      img: "https://images.unsplash.com/photo-1746712241471-614b914f9c23?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fG1lbnRvcnxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
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
          {blogCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-0 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="md:w-1/3 w-full  relative h-full">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-green-700 font-semibold text-xs mb-1">
                    {card.category}
                  </div>
                  <h2 className="font-bold text-lg mb-2">{card.title}</h2>
                  <p className="text-neutral-700 text-sm mb-4">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>By {card.author}</span>
                  <span>·</span>
                  <span>{card.date}</span>
                  <span>·</span>
                  <span>{card.timeToRead}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
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
      </section>

      {/* Featured/Explore Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Explore Ideas, Insights & Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex flex-col"
            >
              <div className="w-full h-32 relative mb-4 rounded overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-neutral-700 text-sm mb-4">
                {card.description}
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
