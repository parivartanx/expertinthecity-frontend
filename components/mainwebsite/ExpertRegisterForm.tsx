"use client";
import Link from "next/link";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaUpload } from "react-icons/fa";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useExpertStore } from "@/lib/mainwebsite/expert-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";

const steps = [
  "Personal Information",
  "Professional Details",
  "Portfolio & Expertise",
  "Services & Availability",
  "Preferences",
  "Follow Users",
];

const defaultInterests = [
  "Technology",
  "Science",
  "Art",
  "Business",
  "Health",
  "Sports",
  "Music",
  "Travel",
  "Finance",
  "Education",
  "Design",
  "Marketing",
  "AI/ML",
  "Writing",
  "Photography",
  "Cooking",
  "Fitness",
  "Gaming",
  "Fashion",
  "Nature",
  "Volunteering",
];

const suggestedUsers = [
  {
    id: 1,
    name: "Priya Mehta",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    title: "Certified Financial Planner",
  },
  {
    id: 2,
    name: "John Carter",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    title: "Investment Strategist",
  },
  {
    id: 3,
    name: "Amit Shah",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    title: "Mutual Funds Advisor",
  },
];

const ExpertRegisterForm = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, initializeAuth } = useAuthStore();
  const { createExpertProfile, isLoading, error } = useExpertStore();
  const { profile } = useUserStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    location: string;
    category: string;
    bio: string;
    experience: string;
    certifications: string;
    profilePhoto: string | null;
    portfolioFiles: any[];
    portfolioMedia: any[];
    linkedin: string;
    website: string;
    instagram: string;
    pricing: string;
    availability: string[];
    agree: boolean;
  }>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    location: "",
    category: "",
    bio: "",
    experience: "",
    certifications: "",
    profilePhoto: null,
    portfolioFiles: [],
    portfolioMedia: [],
    linkedin: "",
    website: "",
    instagram: "",
    pricing: "",
    availability: [],
    agree: false,
  });
  const [uploading, setUploading] = useState(false);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Verify session if user appears to be authenticated
  useEffect(() => {
    const verifySession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (isAuthenticated && accessToken && refreshToken && !user) {
        // User appears to be authenticated but we don't have user data
        // This might happen if the page was refreshed
        try {
          // Try to get user profile to verify session
          const response = await axios.get("/API/users/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.data) {
            // Session is valid, update user data
            useAuthStore.getState().setUser(
              response.data,
              accessToken,
              refreshToken
            );
          }
        } catch (error) {
          console.log("Session verification failed, clearing auth state");
          // Session is invalid, clear auth state
          useAuthStore.getState().logout();
        }
      }
    };

    verifySession();
  }, [isAuthenticated, user]);

  // Auto-fill form if user is authenticated and profile is available
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || profile?.name || "",
        email: user.email || profile?.email || "",
        bio: profile?.bio || "",
        location:
          (typeof profile?.location === 'string' ? profile.location : 
           (profile?.location && typeof profile.location === 'object' && profile.location !== null && 
            (profile.location as { city?: string; state?: string; country?: string; postalCode?: string }).city)) ||
          "",
        profilePhoto: null,
      }));
      if (profile?.interests && profile.interests.length > 0) {
        setSelectedInterests(profile.interests);
      }
    }
  }, [isAuthenticated, user, profile]);

  const handleGoogleLogin = async () => {
    try {
      // Implement Google login logic here
      // After successful login, move to professional details
      setStep(1);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleRegularLogin = async () => {
    try {
      // Clear any previous errors
      setErrorMessage(null);

      // Validate form data
      if (!form.email || !form.password) {
        setErrorMessage("Please enter both email and password");
        return;
      }

      // Check if user is already authenticated and has valid tokens
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (isAuthenticated && user && accessToken && refreshToken) {
        console.log("User already authenticated with valid tokens, proceeding to next step");
        setStep(1);
        return;
      }

      // Only attempt login if not already authenticated or missing tokens
      console.log("Attempting login with:", { email: form.email });
      await login(form.email, form.password);

      // If login successful, move to next step
      console.log("Login successful, moving to next step");
      setStep(1);
    } catch (error: any) {
      console.error("Login failed:", error);

      // Get error message from auth store or use fallback
      const authError = useAuthStore.getState().error;
      const errorMessage = authError || error?.response?.data?.message || error?.message || "Login failed. Please check your credentials.";

      // Show user-friendly error message
      setErrorMessage(errorMessage);

      // Clear the error from store
      useAuthStore.getState().clearError();
    }
  };

  // Helper for checkbox
  const toggleAvailability = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  // File upload handlers
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setForm((f) => ({ ...f, portfolioFiles: Array.from(files) }));
    setFilePreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
  };
  const handleMediaUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setForm((f) => ({ ...f, portfolioMedia: Array.from(files) }));
    setMediaPreviews(
      Array.from(files).map((file) => URL.createObjectURL(file))
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handlePreferencesSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch("/API/users/profile", {
        interests: selectedInterests,
      });
      setStep(5); // Move to follow users step
    } catch (err) {
      alert("Failed to update preferences.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = (id: number) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Submit application handler
  const handleSubmitApplication = async () => {
    setLoading(true);
    try {
      // Build payload according to ExpertProfile interface
      const payload = {
        name: form.fullName,
        email: form.email,
        password: form.password,
        bio: form.bio,
        avatar: typeof form.profilePhoto === 'string' ? form.profilePhoto : undefined, // Only pass string or undefined
        interests: selectedInterests,
        tags: [], // Add tags if you collect them
        location: {
          address: form.location,
          country: "", // Add country if collected
          pincode: "", // Add pincode if collected
        },
        expertDetails: {
          headline: form.category,
          summary: form.bio,
          expertise: [form.category],
          experience: Number(form.experience) || undefined,
          about: form.bio,
          availability: form.availability.join(", "),
          // Add more fields as needed from form
        },
      };
      await createExpertProfile(payload);
      setStep(4); // Move to next step (preferences)
    } catch (err) {
      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user interacts with form
  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 md:px-0 overflow-y-auto">
      <Link href={"/experts"}>
        <button className="flex items-center text-sm text-gray-500 mb-4 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Become a Provider
        </button>
      </Link>
      <h1 className="text-3xl font-bold mb-1">Register as an Expert</h1>
      <p className="text-gray-500 mb-6">
        Complete the form below to join our network of professionals
      </p>
      {/* Tabs */}
      <div className="flex mb-6 border rounded-lg overflow-hidden bg-gray-50">
        {steps.map((s, i) => (
          <button
            key={s}
            className={`flex-1 py-2 px-2 text-sm md:text-base font-medium transition-colors duration-200 ${step === i
              ? "bg-white text-black border-b-2 border-green-600"
              : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={() => {
              setStep(i);
              clearError();
            }}
            type="button"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6 md:p-8">
        {/* Step 1: Personal Information */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold mb-1">Personal Information</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Please provide your basic contact information. This will be used
              to create your account.
            </p>

            {!isAuthenticated && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      or continue with email
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="Enter your full name"
                disabled={isAuthenticated}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  clearError();
                }}
                type="email"
                placeholder="Enter your email address"
                disabled={isAuthenticated}
                required
              />
            </div>
            {!isAuthenticated && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    clearError();
                  }}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="Enter your phone number"
                disabled={isAuthenticated}
              />
            </div>
            {/* Error Display */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
            <div className="flex justify-end">
              {!isAuthenticated ? (
                <button
                  onClick={handleRegularLogin}
                  disabled={!form.email || !form.password || isLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login & Continue"}
                </button>
              ) : (
                <button
                  onClick={() => setStep(1)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Next Step
                </button>
              )}
            </div>
          </>
        )}
        {/* Step 2: Professional Details */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-1">Professional Details</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Tell us about your professional background and expertise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="Enter your location"
                  />
                  <span className="text-green-600 text-xl">
                    <FaCheckCircle />
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Primary Expertise Category
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="">Select a category</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Professional Bio
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 min-h-[60px]"
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                placeholder="Tell potential clients about yourself and your expertise..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Years of Experience
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 min-h-[60px]"
                value={form.experience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experience: e.target.value }))
                }
                placeholder="Highlight your expertise, approach, and what makes you unique."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Qualifications & Certifications
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 min-h-[60px]"
                value={form.certifications}
                onChange={(e) =>
                  setForm((f) => ({ ...f, certifications: e.target.value }))
                }
                placeholder="List any relevant qualifications, certifications, or credentials..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl text-gray-400 border">
                  <FaUpload />
                </div>
                <button className="px-4 py-2 border rounded-lg font-medium">
                  Upload Photo
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Upload a professional photo. JPG or PNG format, max 5MB.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 border rounded-lg font-medium"
                onClick={() => setStep(0)}
              >
                Previous Step
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => setStep(2)}
              >
                Next Step
              </button>
            </div>
          </>
        )}
        {/* Step 3: Portfolio & Expertise */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-1">Portfolio & Expertise</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Showcase your work and connect your professional profiles to build
              credibility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Upload Files */}
              <div
                className="border rounded-lg flex flex-col items-center justify-center py-8 relative group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-green-500 bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
              >
                <FaUpload className="text-3xl text-gray-400 mb-2 group-hover:text-green-600 transition-colors" />
                <div className="font-semibold mb-1">Upload Files</div>
                <div className="text-xs text-gray-500 mb-2">
                  Drag and drop files or click to browse
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                  tabIndex={-1}
                />
                {/* File Previews */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {filePreviews.map((src, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-white border rounded flex items-center justify-center overflow-hidden shadow-sm"
                    >
                      <span className="text-xs text-gray-500 text-center px-1 break-all">
                        {form.portfolioFiles[i]?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Upload Media */}
              <div
                className="border rounded-lg flex flex-col items-center justify-center py-8 relative group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-green-500 bg-gray-50"
                onClick={() => mediaInputRef.current?.click()}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    mediaInputRef.current?.click();
                }}
              >
                <FaUpload className="text-3xl text-gray-400 mb-2 group-hover:text-green-600 transition-colors" />
                <div className="font-semibold mb-1">Upload Media</div>
                <div className="text-xs text-gray-500 mb-2">
                  Add images or videos of your work
                </div>
                <input
                  ref={mediaInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleMediaUpload}
                  tabIndex={-1}
                />
                {/* Media Previews */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {mediaPreviews.map((src, i) =>
                    src.match(/video/) ? (
                      <video
                        key={i}
                        src={src}
                        className="w-16 h-16 object-cover rounded"
                        controls
                      />
                    ) : (
                      <img
                        key={i}
                        src={src}
                        alt="media"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Add examples of your work to showcase your skills and experience.
              You can upload documents, images, or videos.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Social & Professional Links
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 mb-2"
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.linkedin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, linkedin: e.target.value }))
                }
              />
              <input
                className="w-full border rounded-lg px-3 py-2 mb-2"
                placeholder="https://yourwebsite.com"
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://twitter.com/yourusername"
                value={form.instagram}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instagram: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border rounded-lg font-medium"
                onClick={() => setStep(1)}
              >
                Previous Step
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => setStep(3)}
              >
                Next Step
              </button>
            </div>
          </>
        )}
        {/* Step 4: Services & Availability */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-1">Services & Availability</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Select the specific services you offer and set your availability.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Pricing Information
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 min-h-[60px]"
                value={form.pricing}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pricing: e.target.value }))
                }
                placeholder="Describe your pricing structure, rates, or packages..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.availability.includes(day)}
                      onChange={() => toggleAvailability(day)}
                      className="accent-green-600"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4 flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <div>
                <div className="font-semibold">Almost Done!</div>
                <div className="text-xs text-gray-500">
                  After submission our team will review your application within
                  2-3 business days. You'll receive an email notification once
                  your profile is approved
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) =>
                  setForm((f) => ({ ...f, agree: e.target.checked }))
                }
                className="accent-green-600"
              />
              <span className="text-sm">
                I Agree to the{" "}
                <span className="text-green-600 underline">
                  Terms of Services
                </span>{" "}
                and{" "}
                <span className="text-green-600 underline">Privacy Policy</span>
              </span>
            </label>
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border rounded-lg font-medium"
                onClick={() => setStep(2)}
              >
                Previous Step
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                disabled={!form.agree || loading || isLoading}
                onClick={handleSubmitApplication}
              >
                {loading || isLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </>
        )}
        {/* Step 5: Preferences */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-bold mb-1">Select Your Interests</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Choose your interests to personalize your experience.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {defaultInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 ${selectedInterests.includes(interest)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-100"
                    }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={handlePreferencesSubmit}
                disabled={loading || selectedInterests.length === 0}
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </>
        )}
        {/* Step 6: Follow Users */}
        {step === 5 && (
          <>
            <h2 className="text-xl font-bold mb-1">
              Suggested Users to Follow
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Follow users to get updates and build your network.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 bg-gray-50 border rounded-lg p-4"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.title}</div>
                  </div>
                  <button
                    className={`px-4 py-1 rounded-full font-medium text-sm transition-all duration-200 ${following.includes(user.id)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-green-100"
                      }`}
                    onClick={() => handleFollowToggle(user.id)}
                  >
                    {following.includes(user.id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => router.push("/")}
              >
                Finish & Go to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertRegisterForm;
