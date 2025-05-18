// components/TestimonialSection.tsx
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
      text: "Sarah did an amazing job cleaning our office. She was thorough, professional, and went above and beyond our expectations. We’ve now booked her for regular cleaning.",
      time: "1 month ago",
    },
    {
      name: "Lisa Parker",
      avatar:
        "https://images.unsplash.com/photo-1745179177535-f83fb38821a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Michael rewired our entire house and did a fantastic job. He was punctual, knowledgeable, and very tidy. The price was exactly as quoted with no surprises.",
      time: "3 weeks ago",
    },
  ];

  return (
    <section className="bg-[#f5faff] py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          What Our <span className="text-green-600">Customers</span> Say
        </h2>
        <p className="mt-2 text-gray-500 max-w-xl mx-auto">
          Thousands of satisfied customers have found the perfect service
          provider through ExpertInTheCity.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md text-left"
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
      </div>
    </section>
  );
}
