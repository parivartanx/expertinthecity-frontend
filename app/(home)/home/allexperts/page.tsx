import React from "react";
import { FaStar } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const experts = [
  {
    name: "John Smith",
    location: "London, UK",
    description:
      "Professional plumber with over 15 years of experience in residential and commercial plumbing services.",
    tags: ["Plumbing", "Heating", "Bathroom Installation"],
    rating: 4.9,
    reviews: 124,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Sarah Johnson",
    location: "Manchester, UK",
    description:
      "Experienced cleaner providing thorough and efficient cleaning services for homes and offices.",
    tags: ["House Cleaning", "Office Cleaning", "Deep Cleaning"],
    rating: 4.8,
    reviews: 87,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Michael Brown",
    location: "Birmingham, UK",
    description:
      "Certified electrician specializing in residential electrical services with a focus on safety and quality.",
    tags: ["Electrical Repairs", "Installations", "Inspections"],
    rating: 5.0,
    reviews: 156,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Emily Wilson",
    location: "Leeds, UK",
    description:
      "Professional painter with attention to detail and a commitment to quality workmanship.",
    tags: ["Interior Painting", "Exterior Painting", "Wallpaper Installation"],
    rating: 4.7,
    reviews: 92,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "David Thompson",
    location: "Glasgow, UK",
    description:
      "Experienced gardener offering a range of services to keep your outdoor spaces looking beautiful.",
    tags: ["Garden Maintenance", "Landscaping", "Lawn Care"],
    rating: 4.6,
    reviews: 78,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function AllExperts() {
  return (
    <div className="p-4 md:p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4 text-foreground">ALL Experts</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:overflow-y-auto bg-card rounded-lg p-4 shadow-sm">
          <Input placeholder="Your Location" className="mb-4" />
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2 text-foreground">Services</p>
              {[
                "Plumbing",
                "Electrical",
                "Cleaning",
                "Gardening",
                "Painting",
                "Carpentry",
                "Roofing",
                "HVAC",
                "Pest Control",
                "Flooring",
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2 py-1">
                  <input type="checkbox" className="rounded border-input" />
                  <label className="text-sm text-muted-foreground">
                    {service}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <p className="font-medium mb-2 text-foreground">Rating</p>
              {[5, 4, 3, 2].map((r) => (
                <div key={r} className="flex items-center space-x-2 py-1">
                  <input type="checkbox" className="rounded border-input" />
                  <label className="text-sm text-muted-foreground">
                    {r}★ & up
                  </label>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Apply Filters
            </Button>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <Input placeholder="Search Experts..." className="mb-4" />
          <div className="space-y-6">
            {experts.map((expert, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center border border-border bg-card p-4 rounded-xl gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {expert.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    📍 {expert.location}
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    {expert.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expert.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between min-w-fit">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="font-medium text-foreground">
                      {expert.rating} ({expert.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
