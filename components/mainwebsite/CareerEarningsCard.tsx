import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const MIN_YEARS = 1;
const MAX_YEARS = 10;
const BASE_EARNINGS = 20000;

const ExpertEarningsCard = () => {
  const [years, setYears] = useState(5);
  const earnings = years * BASE_EARNINGS;
  const barWidth = ((years - MIN_YEARS) / (MAX_YEARS - MIN_YEARS)) * 100;

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
        {/* Experience */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Years of Experience
          </label>

          <input
            type="range"
            min={MIN_YEARS}
            max={MAX_YEARS}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-2 accent-green-500"
          />
          <p className="text-sm text-gray-600 mt-1">
            {years} year{years > 1 ? "s" : ""} selected
          </p>
        </div>

        {/* Earnings */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium">Based on our data...</p>
          <h2 className="text-3xl font-bold text-gray-900">
            ${earnings.toLocaleString()}{" "}
            <span className="text-lg font-medium text-gray-700">in 1 year</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            That’s ${(earnings / 365).toFixed(0)} a day — all from doing what
            you love.
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
