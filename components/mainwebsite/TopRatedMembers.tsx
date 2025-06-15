import Link from "next/link";
import React from "react";

const images = [
  "https://images.unsplash.com/photo-1606738132449-e3590ddb6793?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNlcnZpY2VzfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1690303193666-418da1d99cb1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1690303193709-dedfee29c452?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1731168273756-e02cae42265b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNlcnZpY2VzfGVufDB8fDB8fHww",
  //   "https://picsum.photos/id/1006/200/200",
  //   "https://picsum.photos/id/1008/200/220",
  //   "https://picsum.photos/id/1015/200/180",
  //   "https://picsum.photos/id/1016/200/200",
];

const TopRatedMentors = () => {
  return (
    <section className="w-full px-6 py-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between">
        {/* LEFT */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">Experts</p>
          <h2 className="text-4xl font-bold mb-4">
            Meet Our <span className="text-green-600">Top-Rated</span> Experts
          </h2>
          <p className="text-gray-700 mb-8">
            Discover the best Experts in your field. Our top-rated experts are
            ready to guide you.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-semibold flex items-center gap-2 text-black">
                📈 Trending Experts
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Explore our community of skilled professionals dedicated to your
                learning journey.
              </p>
            </div>
            <div>
              <p className="font-semibold flex items-center gap-2 text-black">
                ® Top Rated
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Connect with highly-rated Experts who can elevate your skills
                and knowledge.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href={"/experts"}>
              {" "}
              <button className="border border-green-600 text-green-600 px-5 py-2 rounded hover:bg-green-50 transition">
                Explore
              </button>
            </Link>
            <Link href={"/about"}>
              {" "}
              <button className="flex items-center gap-1 text-green-600 hover:underline">
                Learn More <span>›</span>
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`mentor-${i}`}
              className="rounded-lg object-cover size-32"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedMentors;
