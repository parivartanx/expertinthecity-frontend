import { useState } from "react";
import { FaLocationArrow, FaSearch, FaUserPlus } from "react-icons/fa";

const ExpertHeroSection = () => {
  const [serviceType, setServiceType] = useState("need");

  return (
    <div className="relative bg-cover bg-center min-h-screen flex flex-col items-center justify-center px-4 bg-[url(https://plus.unsplash.com/premium_photo-1669825050519-e89e6cf7c2c6?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] md:flex-row">
      {/* Overlay for the whole section */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/40 z-0" />

      {/* Content Container */}
      <div className="relative z-[99] w-full max-w-md  md:max-w-3xl p-4 md:p-8 flex flex-col items-center text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unlock Your Earning Potential with{" "}
          <span className="text-green-600">Expert</span> Guidance
        </h1>
        <p className="mb-6 text-gray-300">
          Discover a world of knowledge with ExpertInTheCity, where skilled
          professionals are ready to guide you in various fields. Whether you're
          looking to learn teaching, music, or wellness, our platform connects
          you with the right mentor to achieve your goals.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setServiceType("need")}
            className={`px-4 py-2 rounded-full border hover:bg-white transition select-none duration-300 cursor-pointer ${
              serviceType === "need"
                ? "bg-white text-black border-[3px]  border-green-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            I need a service
          </button>
          <button
            onClick={() => setServiceType("provide")}
            className={`px-4 py-2 rounded-full border transition hover:bg-white  select-none duration-300 cursor-pointer ${
              serviceType === "provide"
                ? "bg-white text-black  border-[3px]  border-green-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            I provide a service
          </button>
        </div>

        {/* Search Form - Left column on md and up */}
        <div className="w-full flex flex-col gap-3 mb-5 ">
          <input
            type="text"
            placeholder={
              serviceType === "need"
                ? "What service do you need?"
                : "What service do you provide?"
            }
            className="px-4 py-2 rounded-md text-black placeholder:text-black w-full focus:outline-none border border-gray-300 "
          />
          <div className="relative w-full">
            <FaLocationArrow className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Location"
              className="pl-10 pr-4 py-2 rounded-md  text-black placeholder:text-black w-full focus:outline-none  border border-gray-300 "
            />
          </div>
        </div>

        {/* Action Button */}
        {serviceType === "need" ? (
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 mb-6 mx-auto">
            <FaSearch /> Find Experts
          </button>
        ) : (
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 mb-6 mx-auto">
            <FaUserPlus /> Register as Expert
          </button>
        )}

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
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
              className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Background Side (Right on md and up) */}
    </div>
  );
};

export default ExpertHeroSection;
