"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center">
      {/* Full screen background for smaller screens */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center z-0 md:hidden" />
      {/* Overlay for smaller screens */}
      <div className="absolute inset-0 bg-black/40 z-0 md:hidden" />

      <div
        className="absolute top-4 right-4 z-[1000] text-white bg-neutral-800 p-1   md:text-white  rounded-full  md:text-md cursor-pointer hover:opacity-80 transition-all ease-in-out duration-300"
        onClick={() => router.push("/home")}
      >
        <IoCloseOutline />
      </div>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-screen-lg mx-auto rounded-xl shadow-xl overflow-hidden">
          {/* Background Side (Left on md and up) */}
          <div className="hidden md:flex md:w-1/2 bg-[url('https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center relative  flex-col justify-end p-8 text-white ">
            <div className="absolute inset-0 bg-black/40  z-0"></div>
            <div className="relative z-10 text-left space-y-4 w-full ">
              <p className="text-lg italic relative h-full">
                "Welcome back! Continue your journey with your trusted mentors."
              </p>
              {/* Optional: Add author/source if desired */}
            </div>
          </div>

          {/* Form Side (Right on md and up) */}
          <div className="w-full md:w-1/2 bg-white p-8 flex flex-col items-center text-neutral-900">
            <h2 className="text-2xl font-bold mb-1 text-center">
              Welcome back
            </h2>
            <p className="text-sm text-neutral-600 mb-6 text-center">
              Sign in to continue to ExpertInTheCity.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()} // Add onSubmit handler if needed
              className="w-full flex flex-col gap-4 mb-4 text-left"
            >
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Sign In
              </button>
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
                className="w-full flex items-center justify-center gap-2 border border-neutral-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                type="button"
              >
                <span className="mr-2">
                  <FcGoogle className="h-5 w-5" />
                </span>
                Sign in with Google
              </button>
              <div className="text-center text-sm mt-4">
                <a
                  href="#"
                  className="font-medium text-green-700 hover:text-green-600"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="text-center text-sm text-neutral-600 mt-4">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-green-700 hover:text-green-600"
                >
                  Sign up for free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
