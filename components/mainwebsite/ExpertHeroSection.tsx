import { useState } from "react";
import { FaLocationArrow, FaSearch, FaUserPlus } from "react-icons/fa";

const floatingImages = [
  "https://cdn.pixabay.com/photo/2024/09/12/21/20/ai-generated-9043367_1280.png",
  "https://plus.unsplash.com/premium_photo-1661274178695-441693a23b35?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fG1lbnRvcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://cdn.pixabay.com/photo/2024/05/02/16/05/watchmaker-8735031_1280.jpg",
  "https://cdn.pixabay.com/photo/2019/10/17/09/41/hair-4556496_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/11/01/14/33/film-512132_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/11/13/08/37/pc-5737958_1280.jpg",
];

const ExpertHeroSection = () => {
  const [serviceType, setServiceType] = useState("need");

  return (
    <div className="relative min-h-screen flex flex-col md:flex-col lg:flex-row border-t border-gray-100 bg-white overflow-hidden">
      {/* Floating Images for large screens */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {/* Randomly placed images */}
        {floatingImages.map((src, i) => {
          // Positions for each image (you can tweak for better randomness)
          const positions = [
            "top-10 left-5",
            "top-10 right-10",
            "bottom-20 left-20",
            "bottom-20 right-20",
            "top-1/3 right-48",
            "top-1/3 left-48",
          ];
          const rotation = [
            "-rotate-6",
            "rotate-3",
            "-rotate-3",
            "rotate-6",
            "-rotate-12",
            "rotate-12",
          ];

          return (
            <img
              key={i}
              src={src}
              alt={`floating-${i}`}
              className={`absolute w-32 h-32 object-cover rounded-lg shadow-lg border border-gray-300 ${positions[i]} ${rotation[i]}`}
              style={{ zIndex: 0 }}
              loading="lazy"
            />
          );
        })}
      </div>

      {/* Content Section */}
      <div className="relative z-10 md:w-full lg:w-1/2 flex flex-col items-center justify-center p-10 text-black w-full mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 leading-tight text-center">
          Unlock Your Earning Potential with{" "}
          <span className="text-green-500">Expert</span> Guidance
        </h1>

        <p className="mb-10 text-gray-600 text-lg font-light text-center">
          Discover a world of knowledge with ExpertInTheCity, where skilled
          professionals are ready to guide you in various fields. Whether you're
          looking to learn teaching, music, or wellness, our platform connects
          you with the right mentor to achieve your goals.
        </p>

        {/* Toggle Buttons */}
        <div className="flex gap-6 mb-8 justify-center">
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
                      : "bg-black/50  hover:bg-opacity-40"
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
          className="w-full flex flex-col gap-4 mb-8"
        >
          {/* Service Input */}
          <input
            type="text"
            placeholder={
              serviceType === "need"
                ? "What service do you need?"
                : "What service do you provide?"
            }
            className="flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400
                text-gray-900 placeholder-gray-400 transition"
            required
          />

          {/* Location Input with icon */}
          <div className="relative flex-1">
            <FaLocationArrow className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Location"
              className="w-full pl-12 pr-5 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400
                  text-gray-900 placeholder-gray-400 transition"
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

      {/* Big Image Below Content on small screens */}
      {/* <div
        className="w-full lg:hidden h-64 bg-cover bg-center relative mt-10 rounded-lg shadow-lg"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2024/09/12/21/20/ai-generated-9043367_1280.png)",
        }}
      > */}
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
      </div> */}
    </div>
  );
};

export default ExpertHeroSection;
