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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 to-neutral-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Decorative Elements */}
            <div className="flex justify-center">
              <div className="w-20 h-1 bg-green-500 rounded-full" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Empowering Growth Through{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Real Human Connection
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              At ExpertInTheCity, we believe everyone deserves access to
              personalized guidance. Our platform connects learners with trusted
              mentors across fields, making true mentorship simple, personal,
              one session at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/home"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                href="/home"
                className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Active Mentors" },
                { number: "50K+", label: "Success Stories" },
                { number: "100+", label: "Cities" },
                { number: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-block px-4 py-2 rounded-lg bg-neutral-900/80 backdrop-blur-sm border border-neutral-700">
                    <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 text-white"
            viewBox="0 0 1440 100"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z" />
          </svg>
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
          <div className=" rounded-lg flex items-center justify-center">
            <img
              src="https://cdn.pixabay.com/photo/2024/05/02/16/05/watchmaker-8735031_1280.jpg"
              alt=""
              className="rounded"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Meet Our <span className="text-green-700">Team</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: "Ankit Sharma",
              role: "Chief Technology Officer",
              image:
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
              description:
                "Leading our technical vision with 15+ years of experience in software architecture and team leadership.",
              linkedin: "https://linkedin.com/in/ankit-sharma",
              twitter: "https://twitter.com/ankitsharma",
              email: "ankit@expertinthecity.com",
            },
            {
              name: "Neha Roy",
              role: "Head of Operations",
              image:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
              description:
                "Driving operational excellence and scaling our mentorship programs across multiple cities.",
              linkedin: "https://linkedin.com/in/neha-roy",
              twitter: "https://twitter.com/neharoy",
              email: "neha@expertinthecity.com",
            },
            {
              name: "Aditya Mehra",
              role: "Product Director",
              image:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
              description:
                "Shaping our product strategy with a focus on user experience and mentor-mentee matching.",
              linkedin: "https://linkedin.com/in/aditya-mehra",
              twitter: "https://twitter.com/adityamehra",
              email: "aditya@expertinthecity.com",
            },
            {
              name: "Sara Patel",
              role: "Community Lead",
              image:
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
              description:
                "Building and nurturing our community of mentors and mentees across diverse domains.",
              linkedin: "https://linkedin.com/in/sara-patel",
              twitter: "https://twitter.com/sarapatel",
              email: "sara@expertinthecity.com",
            },
          ].map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <div className="font-bold text-lg mb-1">{member.name}</div>
              <div className="text-green-700 font-medium mb-2">
                {member.role}
              </div>
              <p className="text-sm text-neutral-600 mb-4 text-center">
                {member.description}
              </p>
              <div className="flex gap-4 text-green-700 text-xl">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-green-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
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
            Our <span className="text-green-700">Global Presence</span>
          </h2>
          <p className="text-base text-neutral-700 mb-6">
            While we operate primarily in a remote-first environment, we
            maintain strategic office locations to support our growing community
            of mentors and mentees worldwide.
          </p>
          <div className="space-y-6">
            <div className="border-l-4 border-green-700 pl-4">
              <div className="text-green-700 font-semibold text-lg">
                Singapore Office
              </div>
              <div className="text-neutral-700 text-sm mb-2">
                71 Robinson Road, #14-01 Robinson 77
                <br />
                Singapore 068895
              </div>
              <div className="text-sm text-neutral-600 mb-2">
                <span className="font-medium">Hours:</span> Mon-Fri, 9:00 AM -
                6:00 PM SGT
              </div>
              <a
                href="https://maps.google.com/?q=71+Robinson+Road+Singapore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-800 text-sm inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full h-64 bg-neutral-100 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819129365884!2d103.8501!3d1.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19a936c551cd%3A0x7fb4e58ad9cd826e!2s71%20Robinson%20Rd%2C%20Singapore%20068895!5e0!3m2!1sen!2ssg!4v1647881234567!5m2!1sen!2ssg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Singapore Office Location"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
