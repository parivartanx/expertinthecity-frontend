"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What services are offered on the platform?",
    answer:
      "We offer 200+ at-home services including beauty, appliance repair, cleaning, wellness, and more — provided by trained professionals.",
  },
  {
    question: "Are professionals background verified?",
    answer:
      "Yes, every expert undergoes ID verification, skill assessment, and training to ensure trusted and high-quality service.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Of course! Bookings can be modified or cancelled directly from your dashboard, at least 1 hour before the scheduled time.",
  },
  {
    question: "Is the service safe for homes and families?",
    answer:
      "Absolutely. We maintain strict hygiene protocols, enforce safety checks, and track all service visits in real-time.",
  },
  {
    question: "How are prices calculated?",
    answer:
      "We offer transparent upfront pricing. Some services are fixed-price while others depend on assessment or time spent on-site.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="flex items-center justify-between  mx-auto w-full md:max-w-7xl gap-10 px-4 flex-col">
        <div>
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to know before booking a service.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white rounded-xl shadow-sm transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-t-xl"
              >
                <span className="text-lg text-gray-900 font-medium">
                  {item.question}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-6 pb-5 text-gray-700 text-base transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
