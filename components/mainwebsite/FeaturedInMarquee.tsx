"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

const featuredLogos = [
  { src: "/logos/australian.svg", alt: "The Australian" },
  { src: "/logos/quora.svg", alt: "Quora" },
  { src: "/logos/reddit.svg", alt: "Reddit" },
  { src: "/logos/forbes.png", alt: "Forbes" },
  { src: "/logos/daily-news.svg", alt: "DailyNews" },
];

export default function FeaturedInMarquee() {
  return (
    <section className=" py-12 px-6 w-full">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-3 text-gray-700"> As Featured In</h2>
        <div className="border-t border-b border-gray-200 py-6">
          <Marquee
            gradient={true}
            gradientWidth={80}
            speed={40}
            pauseOnHover={true}
          >
            {featuredLogos.map((logo, index) => (
              <div
                key={index}
                className="mx-10 flex items-center justify-center min-w-[150px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={60}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
