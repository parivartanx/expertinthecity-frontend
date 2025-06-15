"use client";
import React, { useState } from "react";
import {
  FaSearch,
  FaUserTie,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";

const mockResults = [
  {
    name: "Aniket Chowdhury",
    title: "UI/UX Designer",
    location: "Bangalore, India",
    expertise: "Design, Figma, Prototyping",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    title: "Full Stack Developer",
    location: "Delhi, India",
    expertise: "React, Node.js, MongoDB",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul Verma",
    title: "Digital Marketer",
    location: "Mumbai, India",
    expertise: "SEO, SEM, Content Marketing",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Sara Lee",
    title: "Business Consultant",
    location: "London, UK",
    expertise: "Strategy, Operations, Growth",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const results =
    query.trim() === ""
      ? []
      : mockResults.filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.location.toLowerCase().includes(query.toLowerCase()) ||
            r.expertise.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-2 text-green-700 tracking-tight">
          Search Experts
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          Find professionals by name, skill, or location
        </p>

        {/* Search Input */}
        <div className="relative mb-10">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-green-600 text-xl" />
          <input
            type="text"
            placeholder="Search by name, skill, or location..."
            className="w-full pl-14 pr-5 py-3 rounded-2xl border border-green-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-600 text-lg shadow-sm transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Empty states */}
        {query.trim() === "" && (
          <div className="text-center text-gray-400 py-20 w-full">
            <FaSearch className="mx-auto text-5xl mb-4 text-green-100" />
            <p className="text-xl font-medium">
              Start typing to search for experts
            </p>
          </div>
        )}

        {query.trim() !== "" && results.length === 0 && (
          <div className="text-center text-gray-400 py-20 w-full">
            <p className="text-xl font-medium">
              No results found for "
              <span className="text-green-600">{query}</span>"
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => (window.location.href = "/profile")}
              className="group cursor-pointer bg-white rounded-2xl border border-green-100 hover:border-green-300 shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
            >
              <img
                src={r.avatar}
                alt={r.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-green-600 shadow-sm mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <FaUserTie className="text-green-600" /> {r.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-1 mb-1 text-sm">
                <FaBriefcase className="text-green-500" /> {r.title}
              </p>
              <p className="text-gray-600 flex items-center gap-1 text-sm">
                <FaMapMarkerAlt className="text-green-500" /> {r.location}
              </p>
              <div className="mt-2 text-green-600 font-medium text-sm italic">
                {r.expertise}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "/profile";
                }}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition-all"
              >
                View Profile <span className="text-base">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
