"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const featuredStories = [
  {
    img: "https://images.unsplash.com/photo-1746712241502-61605ae5fb5d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fG1lbnRvcnxlbnwwfHwwfHx8MA%3D%3D",
    quote:
      "ExpertInTheCity transformed my home renovation experience. I found an incredible contractor who completed the project on time and within budget. The platform made it easy to communicate and track progress every step of the way.",
    name: "Emma Wilson",
    location: "New York, NY",
    rating: 5,
  },
  {
    img: "https://images.unsplash.com/photo-1735825764478-674bb8df9d4a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "As someone who recently moved to a new city, ExpertInTheCity was a lifesaver. I needed to find reliable service providers quickly, and the platform connected me with top-rated professionals in my area.",
    name: "Michael Chen",
    location: "San Francisco, CA",
    rating: 5,
  },
];

const homeServices = [
  {
    title: "Quick and Professional Service",
    quote:
      "Glen from ExpertInTheCity arrived promptly and had my leaking pipe under an hour. He was professional, knowledgeable, and charged a fair price.",
    name: "Sarah Johnson",
    profession: "Plumbing Repair",
    rating: 5,
  },
  {
    title: "Exceptional Cleaning Service",
    quote:
      "I've tried several cleaning services before, but the cleaner I found through ExpertInTheCity was by far the best.",
    name: "David Thompson",
    profession: "House Cleaning",
    rating: 5,
  },
  {
    title: "Reliable and Skilled Electrician",
    quote:
      "The electrician I hired through ExpertInTheCity was fantastic. He arrived on time, installed new lighting, and even gave me tips.",
    name: "Jennifer Lee",
    profession: "Electrical Work",
    rating: 5,
  },
];

const professionalServices = [
  {
    title: "Expert Financial Advice",
    quote:
      "The accountant I found through ExpertInTheCity saved me thousands on my taxes. He explained everything clearly.",
    name: "Robert Garcia",
    profession: "Finance Consultant",
    rating: 5,
  },
  {
    title: "Knowledgeable Attorney",
    quote:
      "I needed legal advice for my small business, and the attorney I connected with through ExpertInTheCity provided excellent guidance.",
    name: "Lisa Parker",
    profession: "Legal Consultant",
    rating: 5,
  },
  {
    title: "Transformed My Business",
    quote:
      "The marketing consultant I hired through ExpertInTheCity helped me completely revamp my business strategy.",
    name: "James Wilson",
    profession: "Marketing Strategist",
    rating: 5,
  },
];

const videoTestimonials = [
  {
    img: "/images/video1.jpg",
    title: "How ExpertInTheCity Helped Renovate My Home",
    description:
      "Emma shares her experience working with contractors found through our platform",
  },
  {
    img: "/images/video2.jpg",
    title: "Finding the Perfect Music Teacher",
    description:
      "Michael discusses how he found a piano instructor for his daughter",
  },
];

export default function TestimonialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process the testimonial data (e.g., send to an API)
    console.log("Testimonial Submitted:", { name, email, experience });
    // Reset form and close modal
    setName("");
    setEmail("");
    setExperience("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Customer Testimonials
      </h1>
      <p className="text-center text-gray-600 mb-12">
        See what our customers have to say about their experiences with
        ExpertInTheCity service providers.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Stories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStories.map((story, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <Image
                src={story.img}
                alt={story.name}
                width={300}
                height={200}
                className="rounded w-full object-cover mb-3"
              />
              <p className="text-sm italic">"{story.quote}"</p>
              <p className="font-semibold mt-2">{story.name}</p>
              <p className="text-gray-500 text-sm">{story.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Home Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeServices.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="font-bold mb-1">{item.title}</p>
              <p className="text-sm italic mb-2">"{item.quote}"</p>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.profession}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Professional Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalServices.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="font-bold mb-1">{item.title}</p>
              <p className="text-sm italic mb-2">"{item.quote}"</p>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.profession}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center border-t pt-8 mt-8">
        <h3 className="text-lg font-semibold mb-2">Share Your Experience</h3>
        <p className="text-gray-600 mb-4">
          Had a great experience with one of our service providers? We'd love to
          hear about it! Submit your testimonial and it could be featured on our
          website.
        </p>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Submit Your Story
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Submit Your Testimonial
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Experience
                </label>
                <textarea
                  id="experience"
                  rows={4}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-semibold"
              >
                Submit Testimonial
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
