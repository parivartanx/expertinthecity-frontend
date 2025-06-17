"use client";

import React from "react";
import { motion } from "framer-motion";
import ExpertRegisterForm from "@/components/mainwebsite/ExpertRegisterForm";
import CareerEarningsCard from "@/components/mainwebsite/CareerEarningsCard";
import {
  HiAcademicCap,
  HiLightningBolt,
  HiCurrencyDollar,
  HiUserGroup,
  HiClock,
  HiGlobeAlt,
} from "react-icons/hi";

const benefits = [
  {
    icon: HiAcademicCap,
    title: "Share Your Expertise",
    description:
      "Turn your knowledge into a rewarding career by helping others learn and grow.",
  },
  {
    icon: HiLightningBolt,
    title: "Flexible Schedule",
    description:
      "Work on your own terms, choose your hours, and maintain work-life balance.",
  },
  {
    icon: HiCurrencyDollar,
    title: "Competitive Earnings",
    description:
      "Earn what you deserve with our transparent and competitive pricing model.",
  },
  {
    icon: HiUserGroup,
    title: "Global Community",
    description:
      "Connect with learners worldwide and build your professional network.",
  },
  {
    icon: HiClock,
    title: "Continuous Growth",
    description:
      "Access resources and training to enhance your teaching skills.",
  },
  {
    icon: HiGlobeAlt,
    title: "Global Reach",
    description:
      "Teach students from around the world and expand your influence.",
  },
];

const advantages = [
  {
    title: "Professional Development",
    points: [
      "Access to exclusive training resources",
      "Regular workshops and webinars",
      "Mentorship opportunities",
      "Career advancement pathways",
    ],
  },
  {
    title: "Financial Benefits",
    points: [
      "Competitive hourly rates",
      "Secure payment system",
      "Regular payout schedule",
      "Performance bonuses",
    ],
  },
  {
    title: "Community Support",
    points: [
      "24/7 technical support",
      "Expert community forums",
      "Regular networking events",
      "Collaboration opportunities",
    ],
  },
];

const BecomeAnExpertPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Become an <span className="text-green-600">Expert</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your knowledge, earn money, and make a difference in
              people's lives. Join our community of experts and start your
              journey today.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <benefit.icon className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Career Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <CareerEarningsCard />
          </motion.div>

          {/* Advantages Section */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Why Choose{" "}
              <span className="text-green-600">Expert in the City</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-4 text-green-600">
                    {advantage.title}
                  </h3>
                  <ul className="space-y-3">
                    {advantage.points.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1 + i * 0.1,
                        }}
                        className="flex items-center text-gray-600"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Registration Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-sm p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
              <p className="text-gray-600">
                Fill out the form below to begin your application process
              </p>
            </div>
            <ExpertRegisterForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeAnExpertPage;
