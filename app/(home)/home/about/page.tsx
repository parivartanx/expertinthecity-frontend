"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      className="font-sans bg-white text-neutral-900"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {/* Header */}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-900 to-neutral-700 text-white py-16 px-4 flex flex-col items-center text-center bg-[url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] relative bg-center bg-cover">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="z-[99] text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Empowering Growth Through{" "}
            <span className="text-green-500">Real Human Connection</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            At ExpertInTheCity, we believe everyone deserves access to
            personalized guidance. Our platform connects learners with trusted
            mentors across fields, making true mentorship simple, personal, one
            session at a time.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">
            About <span className="text-green-700">ExpertInTheCity</span>
          </h2>
          <p className="text-base text-neutral-700 mb-4">
            ExpertInTheCity is a mentorship platform that connects learners with
            seasoned professionals across fields like music, teaching, wellness,
            and engineering. We combine tech and a human-driven approach to
            democratize access to expertise.
          </p>
          <p className="text-base text-neutral-700">
            Our platform is not just for mentees and mentors. It also helps
            teams & other specialists build relationships, grow, and stay
            motivated. Whether youre seeking a tutor, coach, or consultant, we
            help you find the right g&apos;uide on your terms.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-48 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-700 text-4xl font-bold">[SVG]</span>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Introduce your <span className="text-green-700">team</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Ankit Sharma", "Neha Roy", "Aditya Mehra", "Sara Patel"].map(
            (name) => (
              <div
                key={name}
                className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full mb-4"></div>
                <div className="font-bold text-lg mb-1">{name}</div>
                <div className="text-green-700 font-medium mb-2">Role</div>
                <p className="text-sm text-neutral-600 mb-4 text-center">
                  Short testimonial or description about the team member and
                  their contribution.
                </p>
                <div className="flex gap-2 text-green-700 text-xl">
                  <span>[in]</span>
                  <span>[tw]</span>
                  <span>[mail]</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-8 px-4 max-w-2xl mx-auto text-center">
        <div className="text-green-700 font-bold mb-2 text-2xl">★★★★★</div>
        <p className="text-neutral-700 mb-4 text-lg">
          &apos;The platform made it easy for me to find an expert in yoga who
          truly understood my needs. Booking sessions was seamless, and the
          experience changed my approach to wellness.&apos;
        </p>
        <div className="font-semibold">Priya Mehta</div>
        <div className="text-sm text-neutral-500">UX Designer, India</div>
      </section>

      {/* Locations */}
      <section className="py-12 px-4 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">
            Our <span className="text-green-700">locations</span>
          </h2>
          <p className="text-base text-neutral-700 mb-4">
            ExpertInTheCity connects mentors and mentees across the globe. With
            our main operations remotely, we maintain collaborative offices in
            major cities for events, outreach, and local initiatives.
          </p>
          <div className="text-green-700 font-semibold">Sydney</div>
          <div className="text-neutral-700 text-sm mb-2">
            123 King Street, Sydney NSW 2000, Australia
          </div>
          <a href="#" className="text-green-700 underline text-sm">
            View Map
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-48 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-700 text-4xl font-bold">[Map]</span>
          </div>
        </div>
      </section>
    </main>
  );
}
