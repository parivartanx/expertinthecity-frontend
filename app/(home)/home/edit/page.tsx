"use client";
import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaEnvelope,
  FaAddressCard,
} from "react-icons/fa";

const tabs = [
  { label: "Profile Info", icon: <FaUser /> },
  { label: "Contact Info", icon: <FaEnvelope /> },
  { label: "Professional", icon: <FaAddressCard /> },
  { label: "Expertise", icon: <FaUser /> },
  { label: "Notifications", icon: <FaBell /> },
  { label: "Security", icon: <FaLock /> },
];

export default function ExpertEditProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile Info");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Account Settings
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab.label
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            } transition`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        {activeTab === "Profile Info" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Profile Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input-style"
              />
              <input
                type="text"
                placeholder="Username"
                className="input-style"
              />
              <input
                type="text"
                placeholder="Designation"
                className="input-style"
              />
              <input
                type="text"
                placeholder="LinkedIn Profile URL"
                className="input-style"
              />
            </div>
            <button className="btn-green mt-6">Save Changes</button>
          </div>
        )}

        {activeTab === "Contact Info" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="email" placeholder="Email" className="input-style" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input-style"
              />
              <input type="text" placeholder="City" className="input-style" />
              <input type="text" placeholder="State" className="input-style" />
            </div>
            <button className="btn-green mt-6">Save Contact Info</button>
          </div>
        )}

        {activeTab === "Professional" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Info</h2>
            <textarea
              placeholder="Brief Bio"
              rows={4}
              className="input-style w-full"
            />
            <button className="btn-green mt-6">Save Professional Info</button>
          </div>
        )}

        {activeTab === "Expertise" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
            <input
              type="text"
              placeholder="Add skills (comma separated)"
              className="input-style w-full"
            />
            <button className="btn-green mt-6">Save Skills</button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                Email me about new messages
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Weekly newsletter
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                Notify me of profile views
              </label>
            </div>
            <button className="btn-green mt-6">Update Preferences</button>
          </div>
        )}

        {activeTab === "Security" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="input-style"
              />
              <input
                type="password"
                placeholder="New Password"
                className="input-style"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="input-style"
              />
            </div>
            <button className="btn-red mt-6">Change Password</button>
          </div>
        )}
      </div>
    </div>
  );
}
