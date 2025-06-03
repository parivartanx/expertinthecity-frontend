import React from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const ExpertEarningsCard = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-3xl p-8 md:p-12 w-full gap-10 mx-auto mt-10">
      {/* Left Content */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h3 className="text-green-500 font-semibold text-sm uppercase">
          Be The Expert
        </h3>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
          Experts Like You{" "}
          <span className="text-green-500">Are Earning Big</span>
        </h1>
        <p className="text-gray-700 mt-4 text-lg">
          Whether you're a designer, developer, or marketer – our platform
          connects you with premium clients ready to pay for top talent.
        </p>
        <div className="flex gap-10 mt-6 text-green-600 font-semibold text-lg">
          <div>
            <div className="text-2xl font-bold">5000+</div>
            <div className="text-sm text-gray-600">Active Clients</div>
          </div>
          <div>
            <div className="text-2xl font-bold">60%</div>
            <div className="text-sm text-gray-600">Higher Avg. Earnings</div>
          </div>
        </div>
      </div>

      {/* Right Card */}
      <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* Services Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Select Service
          </label>
          <div className="relative">
            <select className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Web Development</option>
              <option>Graphic Design</option>
              <option>Marketing Strategy</option>
              <option>SEO Optimization</option>
              <option>App UI/UX</option>
            </select>
            <ChevronDown className="absolute top-2.5 right-3 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Years of Experience
          </label>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 w-[50%] rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">5 years selected</p>
        </div>

        {/* Earnings */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium">Based on our data...</p>
          <h2 className="text-3xl font-bold text-gray-900">
            $120,000{" "}
            <span className="text-lg font-medium text-gray-700">in 1 year</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            That’s $500 a day — all from doing what you love.
          </p>
        </div>

        <Link href={"/home/register"}>
          <button className="mt-6 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition">
            Start Earning Today
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ExpertEarningsCard;
