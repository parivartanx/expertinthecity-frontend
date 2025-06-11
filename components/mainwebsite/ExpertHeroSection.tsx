import { useState } from "react";
import { FaLocationArrow, FaSearch, FaUserPlus } from "react-icons/fa";

const stats = [
  { number: "10K+", label: "Experts" },
  { number: "50+", label: "Categories" },
  { number: "100+", label: "Cities" },
  { number: "24/7", label: "Support" },
];

const ExpertHeroSection = () => {
  const [serviceType, setServiceType] = useState("need");

  return (
    <div className="relative min-h-screen md:min-h-[110vh] flex flex-col justify-center border-t border-gray-100 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/50 to-neutral-900/80" />
      </div>

      {/* Floating Images for large screens */}

      {/* Content Section */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center p-10 text-white mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 leading-tight text-center">
          Turn Your Expertise into Income. <br />
          <span className="text-green-400">On Your Term !</span>
        </h1>
        <p className="mb-6 text-neutral-200 text-lg font-light text-center max-w-2xl">
          Whether you're building a weekend side hustle, creating a Plan B, or
          stepping into freedom from the 9-to-5—this is your platform to grow.
        </p>
        {/* Toggle Buttons */}
        <div className="flex gap-6 mb-4 justify-center">
          {["need", "provide"].map((type) => {
            const isActive = serviceType === type;
            return (
              <button
                key={type}
                onClick={() => setServiceType(type)}
                className={`relative px-6 py-3 rounded-lg font-semibold transition text-white
                  ${
                    isActive
                      ? "bg-green-600 shadow-lg"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {type === "need" ? "I need a service" : "I provide a service"}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-green-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Search Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-xl flex flex-col gap-4 mb-8"
        >
          {/* Service Input */}
          <input
            type="text"
            placeholder={
              serviceType === "need"
                ? "What service do you need?"
                : "What service do you provide?"
            }
            className="flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-400 transition"
            required
          />
          {/* Location Input with icon */}
          <div className="relative flex-1">
            <FaLocationArrow className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Location"
              className="w-full pl-12 pr-5 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-400 transition"
              required
            />
          </div>
          {/* Action Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-8 flex items-center justify-center gap-3 transition-shadow shadow-md py-3"
          >
            {serviceType === "need" ? <FaSearch /> : <FaUserPlus />}
            {serviceType === "need" ? "Find Experts" : "Register as Expert"}
          </button>
        </form>
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Home Services",
            "Professional Services",
            "Health & Wellness",
            "Events",
            "Education",
            "Beauty",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-white bg-opacity-90 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm cursor-default select-none border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Wave with Responsive Stats overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-40">
        <svg
          className="w-full h-24 md:h-28 lg:h-32 text-white"
          viewBox="0 0 1440 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C150,120 350,0 500,60 C650,120 850,0 1000,60 C1150,120 1350,0 1440,60 L1440,120 L0,120 Z" />
        </svg>
        {/* Stats overlayed on the curve for md+ screens */}
        <div className="hidden md:flex absolute w-full bottom-4 left-0 justify-center">
          <div className="max-w-4xl w-full grid grid-cols-4 gap-8 mx-auto px-2 md:px-0">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 shadow-lg">
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold text-green-400 mb-0.5 md:mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Stats below the curve for mobile screens */}
      <div className="md:hidden w-full flex justify-center bg-white pb-6 pt-2 ">
        <div className="flex gap-3 overflow-x-auto px-2 z-[99]">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center min-w-[110px]">
              <div className="inline-block px-3 py-2 rounded-lg bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 shadow-lg">
                <div className="text-lg font-bold text-green-400 mb-0.5">
                  {stat.number}
                </div>
                <div className="text-xs text-neutral-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertHeroSection;
