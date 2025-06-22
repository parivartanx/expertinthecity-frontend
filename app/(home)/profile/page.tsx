"use client";
import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle, X, Edit, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";

const INTEREST_LABELS: Record<string, string> = {
  TECHNOLOGY: "Technology",
  BUSINESS: "Business",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  ARTS: "Arts",
  SCIENCE: "Science",
  ENGINEERING: "Engineering",
  LAW: "Law",
  FINANCE: "Finance",
  MARKETING: "Marketing",
  DESIGN: "Design",
  MEDIA: "Media",
  SPORTS: "Sports",
  CULINARY: "Culinary",
  LANGUAGES: "Languages",
  PSYCHOLOGY: "Psychology",
  ENVIRONMENT: "Environment",
  AGRICULTURE: "Agriculture",
  CONSTRUCTION: "Construction",
  HOSPITALITY: "Hospitality",
  RETAIL: "Retail",
  TRANSPORTATION: "Transportation",
  ENTERTAINMENT: "Entertainment",
  NON_PROFIT: "Non Profit",
  GOVERNMENT: "Government",
  OTHER: "Other",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatModalStep, setChatModalStep] = useState("initial"); // 'initial', 'input', 'captcha', 'sending'
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const { user } = useAuthStore();
  const { profile, isLoading, error, fetchUserProfile, isProfileLoaded } = useUserStore();
  const isExpert = user?.role === "EXPERT";
  const isUser = user?.role === "USER";

  // Fetch user profile on component mount
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  // Debug logging
  useEffect(() => {
    console.log("Profile Page - User Role Debug:", {
      user,
      userRole: user?.role,
      isExpert,
      isUser,
      profile,
      availableTabs: getAvailableTabs()
    });
  }, [user, isExpert, isUser, profile]);

  // Set default tab based on user role
  useEffect(() => {
    if (isUser) {
      setActiveTab("About");
    }
  }, [isUser]);

  // Placeholder for expert data - replace with actual data fetching
  const expert = {
    name: "Sarah Johnson",
    specialty: "Piano Instructor & Music Theory Specialist",
  };

  // Restore post data
  const profilePosts = [
    {
      id: "post-1",
      author: "Sarah Johnson",
      time: "almost 2 years ago",
      text: "Excited to announce that I'm now offering online piano lessons for students worldwide! Whether you're a beginner or looking to advance your skills, I'd love to help you on your musical journey. Contact me for availability and rates.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      likes: 24,
      comments: 1,
    },
    {
      id: "post-2",
      author: "Sarah Johnson",
      time: "almost 2 years ago",
      text: "Just wrapped up our spring recital! So proud of all my students who performed today. Their hard work and dedication really shone in their performances. Here are some key highlights from the event.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      likes: 15,
      comments: 3,
    },
  ];

  // Mock data for followed experts
  const followedExperts = [
    {
      id: "expert-1",
      name: "Dr. Sarah Johnson",
      specialty: "Piano Instructor & Music Theory",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      rating: 4.9,
      reviews: 124,
      location: "New York, NY"
    },
    {
      id: "expert-2",
      name: "Michael Chen",
      specialty: "Web Development & React",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      rating: 4.8,
      reviews: 89,
      location: "San Francisco, CA"
    },
    {
      id: "expert-3",
      name: "Dr. Emily Rodriguez",
      specialty: "Data Science & Machine Learning",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      rating: 4.7,
      reviews: 156,
      location: "Austin, TX"
    },
    {
      id: "expert-4",
      name: "James Wilson",
      specialty: "Digital Marketing & SEO",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      rating: 4.6,
      reviews: 67,
      location: "Chicago, IL"
    },
    {
      id: "expert-5",
      name: "Lisa Thompson",
      specialty: "Graphic Design & Branding",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      rating: 4.9,
      reviews: 203,
      location: "Los Angeles, CA"
    }
  ];

  const handleMessageClick = () => {
    setIsChatModalOpen(true);
    setChatModalStep("initial");
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setChatMessage(""); // Clear message on close
    setIsSendingChat(false); // Reset sending state
    setChatModalStep("initial"); // Reset modal step
    setCaptchaText(""); // Clear captcha
    setCaptchaInput(""); // Clear captcha input
  };

  const handleSendChat = () => {
    // In a real app, you would perform CAPTCHA verification here first
    // For now, we'll simulate sending if captcha matches (or skip if no captcha needed)

    // Basic CAPTCHA check (case-insensitive for simplicity)
    if (
      chatModalStep === "captcha" &&
      captchaInput.toLowerCase() !== captchaText.toLowerCase()
    ) {
      alert("Incorrect CAPTCHA. Please try again.");
      generateNewCaptcha(); // Generate a new CAPTCHA on failure
      setCaptchaInput(""); // Clear input
      return;
    }

    setIsSendingChat(true);
    // Here you would typically send the chat message and expert ID
    console.log(`Sending chat message to ${expert.name}:`, chatMessage);

    // Simulate sending delay
    setTimeout(() => {
      setIsSendingChat(false);
      // Handle success or failure after sending
      alert("Chat request sent!"); // Placeholder success
      handleCloseChatModal(); // Close on success
    }, 2000);
  };

  const generateNewCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setCaptchaText(result);
  };

  // Generate initial CAPTCHA when modal opens to captcha step
  useEffect(() => {
    if (chatModalStep === "captcha" && captchaText === "") {
      generateNewCaptcha();
    }
  }, [chatModalStep]); // Depend only on chatModalStep

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                {profile?.bio ? (
                  profile.bio
                ) : (
                  <>
                    No bio set.
                    <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add bio</Link>
                  </>
                )}
              </p>
            </div>
            {isExpert && (
              <div className="space-y-6">
                <div className="border rounded-lg shadow-md">
                  <div className="p-4">
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-xs text-gray-500">almost 2 years ago</p>
                    <p className="mt-2 text-sm">
                      Excited to announce that I'm now offering online piano
                      lessons for students worldwide! Whether you're a beginner or
                      looking to advance your skills, I'd love to help you on your
                      musical journey. Contact me for availability and rates.
                    </p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                    className="w-full h-48 object-cover rounded-b-lg mt-2"
                    alt="Piano post"
                  />
                </div>

                <div className="border rounded-lg shadow-md">
                  <div className="p-4">
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-xs text-gray-500">almost 2 years ago</p>
                    <p className="mt-2 text-sm">
                      Just wrapped up our spring recital! So proud of all my
                      students who performed today. Their hard work and dedication
                      really shone in their performances. Here are some key
                      highlights from the event.
                    </p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                    className="w-full h-48 object-cover rounded-b-lg mt-2"
                    alt="Recital post"
                  />
                </div>
              </div>
            )}
            {isUser && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Community Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Followers</h4>
                      <p className="text-sm text-gray-600 mt-1">{profile?._count?.followers || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Following</h4>
                      <p className="text-sm text-gray-600 mt-1">{profile?._count?.following || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Posts</h4>
                      <p className="text-sm text-gray-600 mt-1">{profile?._count?.posts || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800">Chats Initiated</h4>
                      <p className="text-sm text-gray-600 mt-1">{profile?._count?.comments || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {profile?.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                  >
                    {INTEREST_LABELS[interest] || interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case "Following":
        if (!isUser) return null;
        const followingList = profile?.following || [];
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Experts You Follow</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {followingList.length > 0
                    ? `You're following ${followingList.length} expert${followingList.length > 1 ? 's' : ''}`
                    : "You're not following any experts yet."}
                </p>
              </div>
              {followingList.length > 0 ? (
                <div className="divide-y">
                  {followingList.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.following.avatar || '/default-avatar.png'}
                          alt={item.following.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 truncate">
                                {item.following.name}
                              </h4>
                              <p className="text-xs text-gray-600 truncate">
                                {item.following.role}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors">
                                Message
                              </button>
                              <button className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full transition-colors">
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <UserPlus className="w-20 h-20 mb-4 text-green-300" />
                  <p className="text-gray-500 mb-2 text-center">You're not following any experts yet.</p>
                  <Link href="/allexperts" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold mt-2">Find Experts to Follow</Link>
                </div>
              )}
            </div>
          </div>
        );
      case "Services":
        if (!isExpert) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">Services Offered</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Private Piano Lessons (Beginner to Advanced)</li>
              <li>Music Theory Instruction</li>
              <li>Composition Coaching</li>
              <li>Performance Preparation</li>
              <li>College Audition Preparation</li>
            </ul>
          </div>
        );
      case "Portfolio":
        if (!isExpert) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2 text-primary">
              Work Portfolio
            </h2>

            <div className="space-y-4">
              {/* Portfolio Item 1 */}
              <div className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-md font-bold text-gray-800">
                  🔧 Full Stack E-Commerce Platform
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Developed a full-featured MERN stack e-commerce site with
                  admin dashboard, cart, wishlist, and checkout flow.
                </p>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  💰 Earned: ₹25,000
                </div>
              </div>

              {/* Portfolio Item 2 */}
              <div className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-md font-bold text-gray-800">
                  📊 Admin Dashboard for Analytics
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Built a responsive analytics dashboard with charts, dynamic
                  data from APIs, and user management.
                </p>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  💰 Earned: ₹18,000
                </div>
              </div>

              {/* Portfolio Item 3 */}
              <div className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-md font-bold text-gray-800">
                  🎨 Portfolio Website for Designer
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Created a sleek, animated portfolio for a client using
                  Next.js, Tailwind CSS, and Framer Motion.
                </p>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  💰 Earned: ₹10,000
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="border-t pt-4">
              <h3 className="text-md font-bold text-gray-800">
                📈 Total Earnings
              </h3>
              <p className="text-xl font-bold text-green-700">₹53,000+</p>
            </div>
          </div>
        );
      case "Reviews":
        if (!isExpert) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">Client Reviews</h2>
            {/* Add review items here */}
            <p className="text-sm text-gray-700">Reviews content goes here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Get available tabs based on user role
  const getAvailableTabs = () => {
    if (isUser) {
      return ["About", "Following"];
    }
    return ["Posts", "Services", "Portfolio", "Reviews"];
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Loading State */}
      {(isLoading || !profile) && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchUserProfile}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {!isLoading && !error && profile && (
        <div className=" mx-auto bg-white overflow-hidden rounded-2xl shadow">
          {/* Cover Image */}
          <div
            className="h-60 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://cdn.pixabay.com/photo/2016/03/09/15/29/books-1246674_1280.jpg)",
            }}
          ></div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row p-6 md:items-start md:justify-between gap-4 md:gap-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <img
                src={profile?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white -mt-12 object-cover"
              />
              <div>
                <div className="flex items-center justify-start gap-2 md:gap-4 flex-col  md:flex-row">
                  <h1 className="text-2xl font-bold">{profile?.name || user?.name || "User"}</h1>
                  {/* Show email for USER */}
                  {isUser && profile?.email && (
                    <span className="text-gray-500 text-sm">{profile.email}</span>
                  )}
                  {/* Edit Button */}
                  <Link
                    href="/profile/update"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    Update Profile
                  </Link>
                </div>

                <p className="text-green-600 font-semibold mt-2">
                  {isExpert ? (profile?.expertDetails?.headline || "Expert") : "Member"}
                </p>
                <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center mt-1">
                  <span>
                    {profile?.location && typeof profile.location === 'object' && !Array.isArray(profile.location) ? (
                      <>
                        {(profile.location as {address?: string})?.address}
                        {(profile.location as {address?: string, country?: string})?.address && (profile.location as {country?: string})?.country ? ', ' : ''}
                        {(profile.location as {country?: string})?.country}
                        {(profile.location as {pincode?: string})?.pincode && ` (${(profile.location as {pincode?: string})?.pincode})`}
                      </>
                    ) : (
                      <>
                        Location not set
                        <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add location</Link>
                      </>
                    )}
                  </span>
                  <span>{profile?._count?.followers || 0} followers</span>
                  <span>{profile?._count?.following || 0} following</span>
                  <span>{profile?._count?.posts || 0} posts</span>
                </div>
                {/* Show email and member since date for USER */}
                {isUser && (
                  <div className="mt-2 text-sm text-gray-700 flex flex-col gap-1">
                    <span>Email: <span className="font-medium">{profile.email}</span></span>
                    <span>Member since: <span className="font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span></span>
                  </div>
                )}
                {/* Show tags as badges */}
                {profile?.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Show interests as pretty badges for USER */}
                {isUser && profile?.interests && profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                      >
                        {INTEREST_LABELS[interest] || interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content: Two Columns */}
          <div className="grid md:grid-cols-3 gap-6 p-6 pt-0">
            {/* Left Column: Stats and Action Buttons (removed About section) */}
            <div className="md:col-span-1 space-y-4">
              {/* Info Blocks */}
              <div className="text-sm space-y-4 mt-4 md:mt-0">
                {isExpert ? (
                  <>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">{profile?._count?.posts || 0}</p>
                      <p className="text-gray-600">Posts</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">{profile?._count?.following || 0}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        Experts Followed
                        {(!profile?._count?.following || profile._count.following === 0) && (
                          <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add</Link>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                          : "Not set"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        Member Since
                        {!profile?.createdAt && (
                          <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add</Link>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">{profile?._count?.following || 0}</p>
                      <p className="text-gray-600">Following</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                          : "Not set"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        Member Since
                        {!profile?.createdAt && (
                          <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add</Link>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                      <p className="font-semibold">{profile?._count?.comments || 0}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        Chats Initiated
                        {(!profile?._count?.comments || profile._count.comments === 0) && (
                          <Link href="/profile/update" className="text-green-600 underline text-xs ml-2">Add</Link>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {/* Action Buttons */}
              {isExpert && (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    onClick={handleMessageClick}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Tabs and Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="border-b py-2">
                <div className="flex gap-8 text-gray-600 text-sm">
                  {availableTabs.map((tab) => (
                    <span
                      key={tab}
                      className={`cursor-pointer hover:text-black font-medium ${
                        activeTab === tab
                          ? "text-black border-b-2 border-green-600"
                          : ""
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "Posts" && isExpert && (
                  <div className="space-y-6">
                    {/* Posts section */}
                    {profilePosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/profile/posts/${post.id}`}
                        className="block hover:shadow-lg transition-shadow"
                      >
                        <div className="border rounded-lg shadow-md">
                          <div className="p-4">
                            <h3 className="font-semibold">{post.author}</h3>
                            <p className="text-xs text-gray-500">{post.time}</p>
                            <p className="mt-2 text-sm text-gray-700">
                              {post.text}
                            </p>
                          </div>
                          <img
                            src={post.image}
                            className="w-full h-72 object-cover rounded-b-lg mt-2"
                            alt="Post image"
                          />
                          {/* Optional: Add Like, Comment, Share buttons here */}
                          <div className="p-4 flex items-center gap-4 text-gray-500 text-sm">
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {activeTab === "Services" && renderContent()}
                {activeTab === "Portfolio" && renderContent()}
                {activeTab === "Reviews" && renderContent()}
                {activeTab === "About" && renderContent()}
                {activeTab === "Following" && renderContent()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Request Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCloseChatModal}
            >
              <X size={20} />
            </button>

            {chatModalStep === "initial" && (
              <div className="flex flex-col items-center text-center space-y-4 py-8">
                <MessageCircle size={48} className="text-green-600" />
                <h3 className="text-xl font-semibold">Start a Conversation</h3>
                <p className="text-gray-600 text-sm">
                  Send a chat request to {expert.name} to discuss your needs.
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold mt-4"
                  onClick={() => setChatModalStep("input")}
                >
                  Send Chat Request
                </button>
              </div>
            )}

            {chatModalStep === "input" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Send Chat Request</h3>
                <p className="text-gray-600 text-sm">
                  Send a message to {expert.name} to start a conversation.
                </p>
                <div className="flex items-center space-x-3 mt-4">
                  {/* Placeholder for expert profile image in modal */}
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-semibold">{expert.name}</p>
                    <p className="text-sm text-gray-600">{expert.specialty}</p>
                  </div>
                </div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  rows={4}
                  placeholder="Describe what you'd like to discuss..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                ></textarea>
                <p className="text-xs text-gray-500">
                  Your message will be sent as a request. The expert will be
                  able to accept or decline.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                    onClick={handleCloseChatModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                    onClick={() => setChatModalStep("captcha")}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {chatModalStep === "captcha" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Verify you're human</h3>
                <p className="text-gray-600 text-sm">
                  Please complete the CAPTCHA verification before sending your
                  request.
                </p>
                <div className="flex items-center justify-center bg-gray-200 h-16 rounded-md text-2xl font-bold tracking-widest mt-4">
                  {/* CAPTCHA Image/Text Placeholder */}
                  <span>{captchaText}</span>
                  <button
                    className="ml-4 text-gray-600 hover:text-gray-800"
                    onClick={generateNewCaptcha}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-refresh-cw"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.75L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.75L21 16"></path>
                      <path d="M21 21v-5h-5"></path>
                    </svg>
                  </button>
                </div>
                <div>
                  <label
                    htmlFor="captchaInput"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter the text above
                  </label>
                  <input
                    type="text"
                    id="captchaInput"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    placeholder="Enter CAPTCHA text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                    onClick={handleCloseChatModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                    onClick={handleSendChat}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {chatModalStep === "sending" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
                <p className="text-gray-700">Sending request...</p>
                {/* Basic CSS for loader, usually in a global CSS file */}
                <style jsx>{`
                  .loader {
                    animation: spinner 1.5s linear infinite;
                  }
                  @keyframes spinner {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
