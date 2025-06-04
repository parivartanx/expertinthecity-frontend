"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  BsHouseDoor,
  BsPeople,
  BsGrid,
  BsChatDots,
  BsInfoCircle,
} from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiCustomerService2Line } from "react-icons/ri";
import { IconType } from "react-icons";

interface NavItem {
  name: string;
  href: string;
  icon: IconType;
  dropdown?: boolean;
  items?: {
    name: string;
    href: string;
    icon: IconType;
  }[];
}

const navLinks: NavItem[] = [
  { name: "Home", href: "/home", icon: BsHouseDoor },
  { name: "Experts", href: "/home/experts", icon: BsPeople },
  { name: "Categories", href: "/home/categories", icon: BsGrid },
  { name: "Chats", href: "/home/chats", icon: BsChatDots },
  {
    name: "More Info",
    href: "#",
    icon: BsInfoCircle,
    dropdown: true,
    items: [
      { name: "Community", href: "/home/community", icon: HiOutlineUserGroup },
      { name: "Testimonial", href: "/home/testimonial", icon: BsPeople },
      { name: "About Us", href: "/home/about", icon: BsInfoCircle },
      {
        name: "Contact Us",
        href: "/home/contact",
        icon: RiCustomerService2Line,
      },
    ],
  },
];

const Header = () => {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileDropdown, setMobileDropdown] = React.useState(false);
  const router = useRouter();

  return (
    <header className="w-full bg-white border-b border-neutral-200 px-4 py-2 flex items-center justify-between sticky top-0 z-[999] h-[60px]">
      {/* Logo */}
      <Link href="/home" className="flex flex-col leading-tight items-start">
        <span className="text-xl font-extrabold text-green-700">Expert</span>
        <span className="text-xs text-neutral-700 -mt-1 ml-[2px]">
          In The City
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-4 ml-4 font-semibold text-sm">
        {navLinks.map((link) =>
          !link.dropdown ? (
            <Link
              key={link.name}
              href={link.href}
              className={`${
                pathname === link.href ? "text-green-700" : "text-black"
              } hover:text-green-700 transition px-1 flex items-center gap-1`}
            >
              <link.icon className="text-lg lg:hidden" />
              {link.name}
            </Link>
          ) : (
            <div key={link.name} className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className={`flex items-center gap-1 px-1 transition ${
                  showDropdown ? "text-green-700" : "text-black"
                } hover:text-green-700`}
              >
                <link.icon className="text-lg lg:hidden" />
                {link.name}
                <MdKeyboardArrowDown
                  className={`text-lg transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 transform origin-top transition-all duration-200 ease-out">
                  {link.items?.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-900 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                    >
                      <item.icon className="text-lg lg:hidden" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </nav>

      {/* Search Bar */}
      {/* <div className="hidden lg:flex items-center border border-gray-400 rounded ml-4">
        <button className="text-green-700 ml-2">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 text-sm bg-neutral-50 text-black focus:outline-none rounded h-8"
        />
      </div> */}

      {/* Auth Buttons */}
      <div className=" flex gap-2 items-center">
        <div
          onClick={() => {
            router.push("/home/search");
          }}
        >
          <CiSearch className="text-2xl cursor-pointer" />
        </div>
        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-green-700 p-2 hover:bg-green-50 rounded"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <AiOutlineMenu className="text-2xl" />
        </button>
        <div className="hidden lg:flex gap-2 ml-2">
          <Link
            href="/auth/login"
            className="border border-green-700 text-green-700 px-3 py-2 rounded-3xl hover:bg-green-50 flex items-center gap-2 text-sm font-medium"
          >
            <IoIosLogOut className="text-lg" />
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="bg-green-700 text-white px-3 py-2 rounded-3xl  hover:bg-green-800 flex items-center gap-2 text-sm font-medium"
          >
            <FaRegUser className="text-md" />
            Join
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } `}
        onClick={() => {
          setMobileOpen(false);
          setMobileDropdown(false);
        }}
      >
        <div
          className="w-72 bg-white h-full shadow-lg flex flex-col p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="self-end mb-4 text-green-700"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/home" onClick={() => setMobileOpen(false)}>
            <div className="flex flex-col mb-4">
              <span className="text-lg font-extrabold text-green-700">
                Expert
              </span>
              <span className="text-xs text-neutral-700 -mt-1 ml-[2px]">
                In The City
              </span>
            </div>
          </Link>

          {/* Mobile Nav */}
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) =>
              !link.dropdown ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "text-green-700 bg-green-50"
                      : "text-neutral-900"
                  } hover:text-green-700 hover:bg-green-50 transition-all duration-200 text-sm font-medium px-3 py-2.5 rounded-lg flex items-center gap-2`}
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="text-lg" />
                  {link.name}
                </Link>
              ) : (
                <div key={link.name} className="flex flex-col gap-1">
                  <button
                    onClick={() => setMobileDropdown((prev) => !prev)}
                    className="text-neutral-900 text-sm font-medium flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="text-lg" />
                      {link.name}
                    </div>
                    <MdKeyboardArrowDown
                      className={`text-lg transition-transform duration-200 ${
                        mobileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      mobileDropdown ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="ml-3 flex flex-col gap-1">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-sm text-neutral-800 hover:text-green-700 hover:bg-green-50 transition-all duration-200 px-3 py-2 rounded-lg flex items-center gap-2"
                          onClick={() => setMobileOpen(false)}
                        >
                          <item.icon className="text-lg" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50 flex items-center gap-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              <IoIosLogOut className="text-lg" />
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 flex items-center gap-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              <FaRegUser className="text-md" />
              Join
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
