"use client";
import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle, X } from "lucide-react";
import { FaEdit, FaImage, FaPaperclip } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("About");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatModalStep, setChatModalStep] = useState("initial"); // 'initial', 'input', 'captcha', 'sending'
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [postText, setPostText] = useState("");
  const router = useRouter();

  // Placeholder for expert data - replace with actual data fetching
  const expert = {
    name: "Sarah Johnson",
    specialty: "Piano Instructor & Music Theory Specialist",
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

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
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <textarea
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-green-100 focus:border-green-600 min-h-[48px] resize-none bg-gray-50"
                  placeholder="Share your expertise or updates..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm font-medium">
                    <FaImage className="text-lg" /> Photo
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm font-medium">
                    <FaPaperclip className="text-lg" /> Attachment
                  </button>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
                  disabled={!postText.trim()}
                >
                  Post
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-700">
                Professional pianist with over 15 years of teaching experience.
                Specializing in classical piano and music theory for all ages
                and skill levels. I believe in creating a supportive and
                engaging learning environment where students can develop their
                musical abilities while enjoying the process.
              </p>
            </div>
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
          </div>
        );
      case "Services":
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
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">Work Portfolio</h2>
            {/* Add portfolio items here */}
            <p className="text-sm text-gray-700">
              Portfolio content goes here.
            </p>
          </div>
        );
      case "Reviews":
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

  return (
    <div className="bg-gray-100 min-h-screen p-4">
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
        <div className="flex flex-col md:flex-row p-6 md:items-start md:justify-between gap-4 md:gap-8 relative">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white -mt-12 object-cover"
            />
            <div>
              <div className="flex items-center justify-start gap-2 md:gap-4 flex-col  md:flex-row">
                <h1 className="text-2xl font-bold">Sarah Johnson</h1>
                {/* Follow Button */}
                <button
                  className={`px-2 py-1 rounded-lg ${
                    isFollowing
                      ? "bg-gray-300 text-gray-800"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>

              <p className="text-green-600 font-semibold mt-2">
                Piano Instructor & Music Theory Specialist
              </p>
              <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center mt-1">
                <span>New York, NY</span>
                <span className="text-yellow-500">★ 4.9 (124 reviews)</span>
                <span>128 followers</span>
                <span>543 profile views</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Piano",
                  "Music Theory",
                  "Composition",
                  "Sight Reading",
                  "Performance",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button
            className="flex items-center justify-center top-6 right-6 bg-white border border-green-600 text-green-600 px-4 py-1 rounded-2xl font-semibold gap-2  hover:bg-green-50 transition-all"
            onClick={() => {
              router.push("/home/edit");
            }}
          >
            <FaEdit className="text-lg" /> Edit Profile
          </button>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid md:grid-cols-3 gap-6 p-6 pt-0">
          {/* Left Column: About Text, Stats, and Action Buttons */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-700">
              Professional pianist with over 15 years of teaching experience.
              Specializing in classical piano and music theory for all ages and
              skill levels. I believe in creating a supportive and engaging
              learning environment where students can develop their musical
              abilities while enjoying the process.
            </p>
            {/* Info Blocks */}
            <div className="text-sm space-y-4 mt-4 md:mt-0">
              <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                <p className="font-semibold">156</p>
                <p className="text-gray-600">Jobs Completed</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg shadow flex justify-between items-center gap-2">
                <p className="font-semibold">January 2020</p>
                <p className="text-gray-600">Member Since</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                onClick={handleMessageClick}
              >
                Message
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-lg">
                Contact
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-lg">
                Book Appointment
              </button>
            </div>
          </div>

          {/* Right Column: Tabs and Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b py-2">
              <div className="flex gap-8 text-gray-600 text-sm">
                {["About", "Services", "Portfolio", "Reviews"].map((tab) => (
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
              {activeTab === "About" && (
                <>
                  {/* Add Post UI - Only here, above posts */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <textarea
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-100 focus:border-green-600 min-h-[48px] resize-none bg-gray-50"
                        placeholder="Share your expertise or updates..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm font-medium">
                          <FaImage className="text-lg" /> Photo
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm font-medium">
                          <FaPaperclip className="text-lg" /> Attachment
                        </button>
                      </div>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
                        disabled={!postText.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                  {/* Posts section */}
                  <div className="space-y-6 mt-6">
                    <div className="border rounded-lg shadow-md">
                      <div className="p-4">
                        <h3 className="font-semibold">Sarah Johnson</h3>
                        <p className="text-xs text-gray-500">
                          almost 2 years ago
                        </p>
                        <p className="mt-2 text-sm">
                          Excited to announce that I'm now offering online piano
                          lessons for students worldwide! Whether you're a
                          beginner or looking to advance your skills, I'd love
                          to help you on your musical journey. Contact me for
                          availability and rates.
                        </p>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                        className="w-full h-72 object-cover rounded-b-lg mt-2"
                        alt="Piano post"
                      />
                      <div className="p-4 flex items-center gap-4 text-gray-500 text-sm">
                        <span>24 likes</span>
                        <span>1 comment</span>
                      </div>
                    </div>
                    <div className="border rounded-lg shadow-md">
                      <div className="p-4">
                        <h3 className="font-semibold">Sarah Johnson</h3>
                        <p className="text-xs text-gray-500">
                          almost 2 years ago
                        </p>
                        <p className="mt-2 text-sm">
                          Just wrapped up our spring recital! So proud of all my
                          students who performed today. Their hard work and
                          dedication really shone in their performances. Here
                          are some key highlights from the event.
                        </p>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                        className="w-full h-72 object-cover rounded-b-lg mt-2"
                        alt="Recital post"
                      />
                      <div className="p-4 flex items-center gap-4 text-gray-500 text-sm">
                        <span>24 likes</span>
                        <span>1 comment</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeTab === "Services" && renderContent()}
              {activeTab === "Portfolio" && renderContent()}
              {activeTab === "Reviews" && renderContent()}
            </div>
          </div>
        </div>
      </div>

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
