// components/TestimonialSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1567108986089-678f178e0bb6?q=80&w=2616&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "I needed a plumber urgently and found John through ExpertInTheCity. He responded quickly, fixed the issue efficiently, and charged a fair price. Highly recommended!",
      time: "2 weeks ago",
    },
    {
      name: "David Thompson",
      avatar:
        "https://images.unsplash.com/photo-1730510011921-84dcb052f4cd?q=80&w=2613&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Sarah did an amazing job cleaning our office. She was thorough, professional, and went above and beyond our expectations. We've now booked her for regular cleaning.",
      time: "1 month ago",
    },
    {
      name: "Lisa Parker",
      avatar:
        "https://images.unsplash.com/photo-1745179177535-f83fb38821a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Michael rewired our entire house and did a fantastic job. He was punctual, knowledgeable, and very tidy. The price was exactly as quoted with no surprises.",
      time: "3 weeks ago",
    },
    // Add more testimonials for demo
    {
      name: "Priya Singh",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "I found a great yoga instructor here. The process was seamless and the results were amazing!",
      time: "5 days ago",
    },
    {
      name: "Carlos Mendez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Booked a photographer for my event and the experience was top-notch. Highly recommend this platform!",
      time: "2 days ago",
    },
  ];

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slidesToShow, setSlidesToShow] = useState(1);

  // Responsive slidesToShow
  useEffect(() => {
    function handleResize() {
      setSlidesToShow(window.innerWidth >= 768 ? 3 : 1);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearTimeout(timeout);
  }, [index, testimonials.length]);

  // Scroll to active testimonial
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth =
        scrollRef.current.firstChild instanceof HTMLElement
          ? scrollRef.current.firstChild.offsetWidth
          : 320;
      scrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
    }
  }, [index, slidesToShow]);

  // Arrow navigation handlers
  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="bg-[#f5faff] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          What Our <span className="text-green-600">Customers</span> Say
        </h2>
        <p className="mt-2 text-gray-500 max-w-xl mx-auto">
          Thousands of satisfied customers have found the perfect service
          provider through{" "}
          <span className="text-green-600">
            Expert<span className="text-black">InTheCity</span>
          </span>
          .
        </p>

        <div className="mt-10 flex justify-center items-center relative">
          {/* Left Arrow */}
          <button
            className="absolute top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full p-2 text-green-600 hover:bg-green-50 disabled:opacity-40"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            style={{ left: "0.5rem" }}
          >
            <FaChevronLeft size={22} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 w-full md:w-auto overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`bg-white p-6 rounded-lg shadow-md text-left min-w-[300px] max-w-xs mx-auto flex-shrink-0 snap-center transition-transform duration-500 ${
                  i === index
                    ? "scale-105 shadow-lg border border-green-200"
                    : "scale-100 opacity-80"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <div className="text-green-500 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{t.text}</p>
                <div className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{t.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full p-2 text-green-600 hover:bg-green-50 disabled:opacity-40"
            onClick={handleNext}
            aria-label="Next testimonial"
            style={{ right: "0.5rem" }}
          >
            <FaChevronRight size={22} />
          </button>
        </div>
        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition bg-green-400 ${
                index === i ? "opacity-100" : "opacity-40"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        {/* Hide scrollbar with custom CSS */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @media (min-width: 768px) {
            .testimonial-arrow-left {
              left: -2rem !important;
            }
            .testimonial-arrow-right {
              right: -2rem !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
