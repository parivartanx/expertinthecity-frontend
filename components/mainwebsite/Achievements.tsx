"use client";

import { FaUserTie, FaWrench, FaSmile, FaMapMarkedAlt } from "react-icons/fa";

const achievements = [
  {
    icon: <FaUserTie size={28} />,
    value: "100+",
    label: "Verified Experts",
    bg: "bg-white/10",
  },
  {
    icon: <FaWrench size={28} />,
    value: "200+",
    label: "Home Services Offered",
    bg: "bg-white/10",
  },
  {
    icon: <FaSmile size={28} />,
    value: "10K+",
    label: "Happy Customers",
    bg: "bg-white/10",
  },
  {
    icon: <FaMapMarkedAlt size={28} />,
    value: "50+",
    label: "Cities Served",
    bg: "bg-white/10",
  },
];

export default function Achievements() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-white via-slate-100 to-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-3">Our Achievements</h2>
        <p className="text-gray-600 text-lg mb-10">
          Trusted by thousands across India for professional home services.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 backdrop-blur-md bg-white/30 border border-gray-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="mb-4 text-green-600">{item.icon}</div>
              <div className="text-3xl font-semibold">{item.value}</div>
              <div className="text-sm text-gray-700 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
