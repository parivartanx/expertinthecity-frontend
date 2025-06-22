"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { axiosInstance } from "@/lib/mainwebsite/axios";
import { auth, googleProvider } from "@/lib/mainwebsite/firebase";
import { signInWithPopup } from "firebase/auth";

const preferences = [
  "Technology",
  "Business",
  "Healthcare",
  "Education",
  "Arts & Entertainment",
  "Sports",
  "Science",
  "Other",
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [otherPreference, setOtherPreference] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const handlePreferenceChange = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(
        selectedPreferences.filter((p) => p !== preference)
      );
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      try {
        await signup(email, password, name, "USER");
        setStep(2); // Go to preferences step
      } catch (error: any) {
        console.error("Signup failed:", error);
      }
    } else if (step === 2) {
      // Submit preferences
      setLoading(true);
      try {
        await axiosInstance.patch("/users/profile", {
          interests: selectedPreferences,
        });
        // Fetch suggested users (mock or real API)
        // Replace with your API call if available
        setSuggestedUsers([
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
        ]);
        setStep(3); // Go to follow users step
      } catch (err) {
        console.log(err);
        alert("Failed to update preferences.");
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // Optionally send follow data to API here
      router.push("/");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axiosInstance.post("/auth/google", {
        idToken,
      });
      if (response.data.status === "success") {
        const { user, accessToken, refreshToken } = response.data.data;
        useAuthStore.getState().setUser(user, accessToken, refreshToken);
        setStep(2); // Go to preferences step
      }
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        alert(error.response?.data?.message || "Failed to sign in with Google");
      }
    }
  };

  const handleFollowToggle = (id: number) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center">
      {/* Full screen background for smaller screens */}
      <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2024/06/14/06/27/office-8828993_1280.jpg')] bg-cover bg-center z-0 md:hidden" />
      {/* Overlay for smaller screens */}
      <div className="absolute inset-0 bg-black/40 z-0 md:hidden" />

      <div
        className="absolute top-4 right-4 z-[1000] text-white bg-neutral-800 p-1 md:text-white rounded-full md:text-md cursor-pointer hover:opacity-80 transition-all ease-in-out duration-300"
        onClick={() => router.push("/")}
      >
        <IoCloseOutline />
      </div>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-screen-lg mx-auto rounded-xl shadow-xl overflow-hidden">
          {/* Background Side (Left on md and up) */}
          <div className="hidden md:flex md:w-1/2 bg-[url('https://cdn.pixabay.com/photo/2024/06/14/06/27/office-8828993_1280.jpg')] bg-cover bg-center relative flex-col justify-end p-8 text-white">
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            <div className="relative z-10 text-left space-y-4 w-full">
              <p className="text-lg italic relative h-full">
                "Join our community of experts and learners. Start your journey
                today!"
              </p>
            </div>
          </div>

          {/* Form Side (Right on md and up) */}
          <div className="w-full md:w-1/2 bg-white p-8 flex flex-col items-center text-neutral-900">
            {/* Stepper - Styled minimally */}
            <div className="w-full mb-6">
              <div className="flex justify-center items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step >= 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  1
                </div>
                <div
                  className={`flex-1 h-0.5 ${
                    step >= 2 ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step >= 2
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-1 text-center">
              {step === 1
                ? "Create Your Account"
                : step === 2
                ? "Tell Us About Your Interests"
                : "Suggested Users to Follow"}
            </h2>
            <p className="text-sm text-neutral-600 mb-6 text-center">
              {step === 1
                ? "Join the network and connect with verified experts."
                : step === 2
                ? "Select topics you're interested in to personalize your experience."
                : "Follow users to get updates and build your network."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 mb-4 text-left"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="block w-full border border-neutral-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) clearError();
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="block w-full border border-neutral-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) clearError();
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-neutral-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full border border-neutral-300 rounded-md shadow-sm px-3 py-2 pr-10 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) clearError();
                      }}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-5"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agree"
                        name="agree"
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        required
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-2 text-xs text-neutral-600">
                      <label htmlFor="agree">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="font-medium text-green-700 hover:text-green-600"
                        >
                          Terms of Services
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="font-medium text-green-700 hover:text-green-600"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!agree || isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </button>
                </>
              ) : step === 2 ? (
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    {preferences.map((preference) => (
                      <label
                        key={preference}
                        className="flex items-center space-x-2 p-2 border border-neutral-300 rounded-md cursor-pointer hover:bg-neutral-50 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPreferences.includes(preference)}
                          onChange={() => handlePreferenceChange(preference)}
                          className="accent-green-600 h-4 w-4"
                        />
                        <span className="text-sm text-neutral-800">
                          {preference}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedPreferences.includes("Other") && (
                    <div className="mt-3 space-y-1">
                      <label
                        htmlFor="other-preference"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Other Preference
                      </label>
                      <input
                        id="other-preference"
                        type="text"
                        placeholder="Please specify"
                        value={otherPreference}
                        onChange={(e) => setOtherPreference(e.target.value)}
                        className="block w-full border border-neutral-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading || selectedPreferences.length === 0}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? "Saving..." : "Continue"}
                  </button>
                </div>
              ) : step === 3 ? (
                <div className="space-y-4 text-left">
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
                          <div className="text-xs text-gray-500">
                            {user.title}
                          </div>
                        </div>
                        <button
                          className={`px-4 py-1 rounded-full font-medium text-sm transition-all duration-200 ${
                            following.includes(user.id)
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-green-100"
                          }`}
                          type="button"
                          onClick={() => handleFollowToggle(user.id)}
                        >
                          {following.includes(user.id) ? "Following" : "Follow"}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800 mt-4"
                  >
                    Finish & Go to Home
                  </button>
                </div>
              ) : null}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-2"
                >
                  Back
                </button>
              )}
            </form>

            <div className="w-full">
              <div className="relative mt-4 mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-2 border border-neutral-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                type="button"
              >
                <span className="mr-2">
                  <FcGoogle className="h-5 w-5" />
                </span>
                Sign up with Google
              </button>
              <div className="text-center text-sm text-neutral-600 mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-green-700 hover:text-green-600"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
