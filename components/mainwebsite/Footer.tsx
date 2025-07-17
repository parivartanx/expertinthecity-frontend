"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaWrench,
  FaBolt,
  FaBroom,
  FaSeedling,
  FaBook,
  FaCamera,
  FaDumbbell,
  FaUtensils,
  FaChartBar,
  FaGavel,
  FaLaptopCode,
  FaPaw,
} from "react-icons/fa6";
import Link from "next/link";
import { useEffect } from "react";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import type { IconType } from "react-icons";

export default function Footer() {
  const {
    categories,
    isLoaded,
    isLoading,
    error,
    fetchAllCategories,
  } = useCategoriesStore();

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      fetchAllCategories();
    }
  }, [isLoaded, isLoading, fetchAllCategories]);

  const iconMap: Record<string, IconType> = {
    Plumbing: FaWrench,
    Electrical: FaBolt,
    Cleaning: FaBroom,
    Gardening: FaSeedling,
    Tutoring: FaBook,
    Photography: FaCamera,
    "Personal Training": FaDumbbell,
    Catering: FaUtensils,
    Accounting: FaChartBar,
    "Legal Services": FaGavel,
    "Web Design": FaLaptopCode,
    "Pet Care": FaPaw,
  };

  let categoriesFirst: typeof categories = [];
  let categoriesMore: typeof categories = [];

  if (categories.length <= 6) {
    // Split as evenly as possible
    const half = Math.ceil(categories.length / 2);
    categoriesFirst = categories.slice(0, half);
    categoriesMore = categories.slice(half);
  } else {
    // Show 5 in first, rest in more
    categoriesFirst = categories.slice(0, 5);
    categoriesMore = categories.slice(5);
  }

  return (
    <footer className="bg-white text-black border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-6 gap-10 text-sm">
        {/* Logo + Description */}
        <div className="space-y-4">
          <div className="text-green-600 font-bold text-2xl">Expert</div>
          <div className="text-sm text-green-600 font-medium">In The City</div>
          <p className="text-gray-700">
            Connect with trusted local service professionals for any job you
            need done.
          </p>
          <div className="flex space-x-3 text-green-600 text-lg">
            <FaFacebookF className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaXTwitter className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
            <FaYoutube className="cursor-pointer" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-2">Categories</h4>
          {isLoading && <div>Loading categories...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <ul className="space-y-1 text-gray-700">
            {categoriesFirst.map((category) => {
              const Icon = iconMap[category.name] || FaWrench;
              return (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="hover:text-green-600 flex items-center gap-2"
                  >
                    <Icon className="text-sm" />
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* More Categories */}
        <div>
          <h4 className="font-semibold mb-2">More Categories</h4>
          {isLoading && <div>Loading categories...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <ul className="space-y-1 text-gray-700">
            {categoriesMore.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  className="hover:text-green-600 flex items-center gap-2"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Account */}
        <div>
          <h4 className="font-semibold mb-2">Legal & Account</h4>
          <ul className="space-y-1 text-gray-700">
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-green-600"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-green-600"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-green-600">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-green-600">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1 text-gray-700">
            <li>
              <Link href="/about" className="hover:text-green-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-600">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Join */}
        <div>
          <h4 className="font-semibold mb-2">Join</h4>
          <p className="text-gray-700 mb-2">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <div className="flex mb-2">
            <input
              type="email"
              placeholder="Your email here"
              className="border border-gray-300 px-3 py-2 rounded-l w-full outline-none"
            />
            <button className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700">
              Join
            </button>
          </div>
          <p className="text-xs text-gray-600">
            By joining, you consent to our{" "}
            <Link
              href="/privacy-policy"
              className="text-green-600 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and receive updates.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t text-sm text-gray-600 py-4 px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <p>© 2024 ExpertInTheCity. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0 text-green-600">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/cookie-policy" className="hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
