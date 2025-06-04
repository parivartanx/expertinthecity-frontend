"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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

const categories = [
  { title: "Plumbing", icon: FaWrench },
  { title: "Electrical", icon: FaBolt },
  { title: "Cleaning", icon: FaBroom },
  { title: "Gardening", icon: FaSeedling },
  { title: "Tutoring", icon: FaBook },
  { title: "Photography", icon: FaCamera },
  { title: "Personal Training", icon: FaDumbbell },
  { title: "Catering", icon: FaUtensils },
  { title: "Accounting", icon: FaChartBar },
  { title: "Legal Services", icon: FaBalanceScale },
  { title: "Web Design", icon: FaLaptopCode },
  { title: "Pet Care", icon: FaPaw },
];

const pageSize = 6;

export default function MentorCategoriesPage() {
  return (
    <div className="px-6 py-10">
      {/* Banner Section */}
      <section
        className="relative h-60 flex items-center justify-center text-center rounded-lg overflow-hidden mb-12"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/05/19/12/48/home-office-5190614_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Find Your Perfect <span className="text-green-400">Expert</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto">
            Connect with verified professionals across various fields.
          </p>
        </div>
      </section>

      {/* Discover Categories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Discover <span className="text-green-600">Experts</span> By Category
        </h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
          Browse our most requested services and find the right professional for
          your needs.
        </p>

        {/* Existing Search and Filter Section */}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/home/categories/${category.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-3">
                <category.icon />
              </div>
              <p className="text-sm font-medium text-gray-800">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

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
