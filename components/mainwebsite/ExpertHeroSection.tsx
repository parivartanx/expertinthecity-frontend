import { useState } from "react";
import { FaLocationArrow, FaSearch, FaUserPlus } from "react-icons/fa";

const ExpertHeroSection = () => {
  const [serviceType, setServiceType] = useState("need");

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1745990652119-f13cced69b7c?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className=" md:p-8 rounded-xl md:max-w-3xl w-full text-center text-white z-[99]">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Unlock Your Potential with{" "}
          <span className="text-green-500">Expert</span> Guidance
        </h1>
        <p className="mb-6 text-gray-200">
          Discover a world of knowledge with ExpertInTheCity, where skilled
          professionals are ready to guide you in various fields. Whether you're
          looking to learn teaching, music, or wellness, our platform connects
          you with the right mentor to achieve your goals.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setServiceType("need")}
            className={`px-4 py-2 rounded-l-full border transition duration-300 cursor-pointer ${
              serviceType === "need"
                ? "bg-white text-black border-[3px]  border-green-500"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            I need a service
          </button>
          <button
            onClick={() => setServiceType("provide")}
            className={`px-4 py-2 rounded-r-full border transition duration-300 cursor-pointer ${
              serviceType === "provide"
                ? "bg-white text-black  border-[3px]  border-green-500"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            I provide a service
          </button>
        </div>

        {/* Search Form */}
        <div className="flex flex-col gap-3 mb-5 ">
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
    </div>
  );
};

export default ExpertHeroSection;
