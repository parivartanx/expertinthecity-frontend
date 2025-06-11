"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How do clients find me?",
    answer:
      "Clients browse or search based on category, location, or keywords. Your profile appears when your expertise matches their needs.",
  },
  {
    question: "Is it really free to list myself?",
    answer:
      "Yes, listing your profile is completely free during our beta phase. There are no platform fees or commissions.",
  },
  {
    question: "Can I offer in-person sessions as well as virtual ones?",
    answer:
      "Yes. You can specify if you're available for in-person, virtual, or both types of sessions.",
  },
  {
    question: "Can I join if I live outside India or the UAE?",
    answer:
      "Yes. While the platform currently focuses on India and the UAE, experts from anywhere can join and offer services globally.",
  },
  {
    question: "Do I need any certification or license to join?",
    answer:
      "Only if your profession requires one legally (e.g., financial advisors, lawyers, medical professionals). Otherwise, it's optional.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "That's entirely up to you. You can offer just a few hours a week or build a full-time schedule.",
  },
  {
    question: "Can I control who I work with?",
    answer:
      "Yes. You choose who to respond to and who to accept bookings from. No forced connections.",
  },
  {
    question: "Can I keep my profile private?",
    answer:
      "Yes. You can make your profile public, private, or only visible to users you approve.",
  },
  {
    question: "What if I don't have prior consulting experience?",
    answer:
      "That's okay. If you have expertise and want to help others, this is a great place to start.",
  },
  {
    question: "What types of experts are welcome?",
    answer:
      "From finance and law to fitness, coaching, art, and IT—if you have marketable knowledge or skill, you can join.",
  },
  {
    question: "How will I be paid?",
    answer:
      "You and your clients agree on terms directly. You keep what you earn, with no platform commission.",
  },
  {
    question: "Do I have to handle my own bookings?",
    answer:
      "You control your availability and can use third-party tools or manual scheduling. We may introduce built-in scheduling soon.",
  },
  {
    question: "Is this a job board?",
    answer:
      "No. This is a platform to promote your expertise, attract clients, and offer paid sessions—not a job application site.",
  },
  {
    question: "Can I list multiple areas of expertise?",
    answer:
      "Yes. You can highlight your primary niche but also tag yourself in additional relevant categories.",
  },
  {
    question: "What makes this platform different from others?",
    answer:
      "There are no commissions, no paid ads, and no aggressive sales tactics—just visibility for professionals on their own terms.",
  },
  {
    question: "What if I travel often or work remotely?",
    answer:
      "That's perfect. You can work from anywhere as long as you have internet access.",
  },
  {
    question: "Can I use this alongside my current job?",
    answer:
      "Yes. Many users start by offering services part-time, on weekends, or after hours.",
  },
  {
    question: "What happens after I sign up?",
    answer:
      "You'll create a profile, choose your categories, and can start receiving inquiries once approved.",
  },
  {
    question: "Will I receive training or onboarding support?",
    answer:
      "Yes. You'll receive onboarding emails and resources to help you optimize your profile and start strong.",
  },
  {
    question: "How do I make my profile stand out?",
    answer:
      "By clearly describing your niche, experience, and outcomes. We'll also share tips and examples during onboarding.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="w-full py-12 bg-gradient-to-b from-white to-gray-100">
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
                className={`text-gray-700 text-base transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "px-6 pb-5 max-h-96 opacity-100"
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
