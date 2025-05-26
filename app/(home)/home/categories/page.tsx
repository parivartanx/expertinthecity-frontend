"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const pageSize = 6;

export default function MentorCategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mentors.length / pageSize);

  const currentMentors = mentors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Find Your Perfect <span className="text-green-600">Mentor</span>
      </h1>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
        Connect with verified experts across various fields who can help you
        achieve your goals through personalized mentorship and guidance.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name, skill or keyword"
          className="w-full md:w-80 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none"
        />
        <select className="w-full md:w-52 border border-gray-300 rounded px-4 py-2 text-sm">
          <option>All Categories</option>
        </select>
        <input
          type="text"
          placeholder="Your Location"
          className="w-full md:w-52 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none"
        />
        <button className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-sm">
          More Filters
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentMentors.map((mentor) => (
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
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              View Profile
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10 gap-4 items-center">
        <button
          className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded border text-sm font-medium ${
              currentPage === index + 1
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
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
