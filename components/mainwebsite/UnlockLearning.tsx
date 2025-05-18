// components/UnlockLearning.tsx
export default function UnlockLearning() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Heading */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Unlock Your <span className="text-green-700">Learning</span> <br />{" "}
            Potential
          </h2>
        </div>

        {/* Right: Paragraph + Buttons */}
        <div className="max-w-xl text-center md:text-left">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Dive into a world of knowledge with our expert mentors. Whether
            you&apos;re looking to learn a new skill or enhance your existing
            talents, we have the right expert for you.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <button className="bg-green-700 text-white text-sm px-5 py-2 rounded hover:bg-green-800 transition">
              Find an Expert
            </button>
            <button className="border border-green-700 text-green-700 text-sm px-5 py-2 rounded hover:bg-green-50 transition">
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
