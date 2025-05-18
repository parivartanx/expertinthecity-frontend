"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_17_40)">
      <path
        d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36 24 36C16.3 36 10 29.7 10 22C10 14.3 16.3 8 24 8C27.3 8 30.1 9.1 32.3 11.1L38.1 5.3C34.5 2 29.7 0 24 0C10.7 0 0 10.7 0 24C0 37.3 10.7 48 24 48C37.3 48 48 37.3 48 24C48 22.3 47.8 20.7 47.5 19.1H44.5Z"
        fill="#FFC107"
      />
      <path
        d="M6.3 14.7L13.7 20.1C15.7 15.7 19.5 12.5 24 12.5C26.5 12.5 28.7 13.4 30.4 14.9L37.1 8.2C33.7 5.1 29.1 3 24 3C15.6 3 8.4 8.7 6.3 14.7Z"
        fill="#FF3D00"
      />
      <path
        d="M24 45C31.1 45 37.1 40.7 39.6 34.7L32.7 29.5C31.1 32.1 27.9 33.5 24 33.5C19.5 33.5 15.7 30.3 13.7 25.9L6.3 31.3C8.4 37.3 15.6 43 24 43V45Z"
        fill="#4CAF50"
      />
      <path
        d="M47.5 19.1H44.5V20H24V28.5H36.9C36.1 31.1 34.3 33.1 32.7 34.5L39.6 39.7C43.1 36.5 45.5 31.7 45.5 26C45.5 24.7 45.3 23.4 45 22.1L47.5 19.1Z"
        fill="#1976D2"
      />
    </g>
    <defs>
      <clipPath id="clip0_17_40">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const router = useRouter();

  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1581299469822-159dd17a67d4?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center text-white py-16 px-4 flex flex-col justify-center items-center text-center min-h-screen ">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-10 z-0" />

      <div
        className="absolute top-4 right-4 z-[999] text-black text-2xl cursor-pointer hover:bg-gray-200 rounded-full p-1 transition-all ease-in-out duration-300"
        onClick={() => router.push("/")}
      >
        <IoCloseOutline />
      </div>
      <div className="fixed inset-0 flex items-center justify-center  bg-opacity-80 min-h-screen font-sans">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-sm p-7 flex flex-col items-center"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          <h2 className="text-2xl font-extrabold mb-2 text-center text-neutral-900">
            Sign Up
          </h2>
          <p className="text-base text-neutral-600 mb-6 text-center font-normal">
            Join the network. Connect with verified experts
            <br />
            across every field.
          </p>
          <form className="w-full flex flex-col gap-4 mb-2">
            <div className="text-left font-medium text-sm text-neutral-800 flex flex-col gap-1 w-full">
              <label
                htmlFor="name"
                className="font-medium text-sm text-neutral-800"
              >
                Name*
              </label>
              <input
                id="name"
                type="text"
                className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-neutral-50 text-neutral-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="text-left font-medium text-sm text-neutral-800 flex flex-col gap-1 w-full">
              <label
                htmlFor="email"
                className="font-medium text-sm text-neutral-800"
              >
                Email*
              </label>
              <input
                id="email"
                type="email"
                className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-neutral-50 text-neutral-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text-left font-medium text-sm text-neutral-800 flex flex-col gap-1 w-full">
              <label
                htmlFor="password"
                className="font-medium text-sm text-neutral-800"
              >
                Password*
              </label>
              <input
                id="password"
                type="password"
                className="border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-neutral-50 text-neutral-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <label className="flex items-start text-xs text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
                className="accent-green-600 w-4 h-4 mt-[2px]" // slight top margin fix
              />
              <span>
                I Agree to the{" "}
                <a href="#" className="text-green-700 underline font-medium">
                  Terms of Services
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-700 underline font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="bg-green-600 text-white rounded px-3 py-2 font-semibold text-base hover:bg-green-700 transition w-full mt-1"
              disabled={!agree}
            >
              Sign Up
            </button>
          </form>
          <button
            className="w-full flex items-center justify-center gap-2 border border-neutral-200 rounded py-2 text-sm font-medium bg-white hover:bg-neutral-50 transition mb-4 text-neutral-800"
            type="button"
          >
            <span className="mr-2">
              <GoogleIcon />
            </span>
            Google
          </button>
          <div className="text-sm text-neutral-700 font-normal">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-green-700 underline font-semibold hover:text-green-800"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
