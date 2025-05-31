"use client";

import React, { useState } from "react";
import { MessageCircle, Calendar, Heart, FileText } from "lucide-react"; // Import icons

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("Account Settings");

  // Define the sections based on the images
  const sections = [
    "Account Settings",
    "Personal Information",
    "Portfolio & Experience", // May be less relevant for a standard user
    "Services & Availability", // May be less relevant for a standard user
    "Notifications",
    "Security Settings",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Account Settings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Account Settings Overview</h2>
            <p className="text-gray-700">
              Summary or dashboard for account settings.
            </p>
            {/* Add specific account settings content here */}
          </div>
        );
      case "Personal Information":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-gray-700">Edit your personal details.</p>
            {/* Add form fields for name, email, etc. */}
          </div>
        );
      case "Portfolio & Experience":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Portfolio & Experience</h2>
            <p className="text-gray-700">
              Manage your portfolio items and experience details.
            </p>
            {/* Add portfolio/experience management UI */}
          </div>
        );
      case "Services & Availability":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Services & Availability</h2>
            <p className="text-gray-700">
              Configure your services and availability.
            </p>
            {/* Add services/availability settings UI */}
          </div>
        );
      case "Notifications":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button className="text-sm text-green-600 hover:underline">
                Mark all as Read
              </button>
            </div>

            <div className="space-y-4">
              {/* Placeholder notifications */}
              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <MessageCircle size={20} className="text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    New chat request from Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 15, 2023, 04:00 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <Calendar size={20} className="text-green-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    Your booking with Michael Lee has been confirmed for April
                    17th at 2:00 PM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 14, 2023, 09:15 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <Heart size={20} className="text-red-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    John Smith commented on your post
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 13, 2023, 02:45 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <MessageCircle size={20} className="text-green-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    New chat request from Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 12, 2023, 09:50 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <FileText size={20} className="text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    You have a new message from Emily Davis
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 11, 2023, 07:40 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg shadow-sm">
                <Calendar size={20} className="text-green-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-800">
                    Your session with Chris Wilson has been rescheduled to April
                    20th at 11:00 AM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Apr 11, 2023, 07:40 PM
                  </p>
                </div>
                <button className="ml-auto text-green-600 text-sm font-medium">
                  View
                </button>
              </div>

              {/* Add more notification items here */}
            </div>
          </div>
        );
      case "Security Settings":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-gray-700">
              Update your password and security options.
            </p>
            {/* Add security settings UI */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {sections.map((section) => (
                <button
                  key={section}
                  className={`${
                    activeTab === section
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(section)}
                >
                  {section}
                </button>
              ))}
            </nav>
          </div>
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
