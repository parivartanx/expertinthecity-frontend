"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Experts", href: "/experts" },
  { name: "Categories", href: "/categories" },
  {
    name: "More Info",
    href: "#",
    dropdown: true,
    items: [
      { name: "About", href: "/about" },
      { name: "Contact us", href: "/contact" },
      { name: "Blog", href: "/home/blog" },
      { name: "Testimonial", href: "/testimonial" },
    ],
  },
];

const Header = () => {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="w-full bg-white border-b border-neutral-100 px-2 md:px-4 py-2 flex items-center justify-between sticky top-0 z-50 h-[56px] md:h-[60px]">
      {/* Logo */}
      <Link
        href="/"
        className="flex flex-col leading-tight items-start min-w-[90px]"
      >
        <span className="text-lg md:text-xl font-extrabold text-green-700">
          Expert
        </span>
        <span className="text-[10px] md:text-xs font-normal text-neutral-700 ml-[2px] -mt-1">
          In The City
        </span>
      </Link>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4 text-[15px] font-medium items-center ml-4">
        {navLinks.map((link) =>
          !link.dropdown ? (
            <Link
              key={link.name}
              href={link.href}
              className={
                (pathname === link.href
                  ? "text-green-700 "
                  : "text-neutral-900 ") +
                "hover:text-green-700 transition px-1"
              }
            >
              {link.name}
            </Link>
          ) : (
            <div key={link.name} className="relative">
              <button
                className={
                  "flex items-center gap-1 text-neutral-900 hover:text-green-700 transition focus:outline-none px-1" +
                  (showDropdown ? " text-green-700" : "")
                }
                onClick={() => setShowDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              >
                {link.name}
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-neutral-200 rounded shadow-lg z-10 text-[15px]">
                  {link.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-neutral-900 hover:bg-green-50 hover:text-green-700"
                    >
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
      <div className="hidden md:flex items-center ml-4">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border border-neutral-400 rounded focus:outline-none focus:ring-2 focus:ring-green-200 text-sm bg-neutral-50 min-w-[120px] h-8"
        />
        <button className="-ml-7 z-10 text-green-700 hover:text-green-800">
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
      </div>
      {/* Auth Buttons */}
      <div className="hidden md:flex gap-2 ml-2">
        <Link
          href="/auth/login"
          className="border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50 font-semibold flex items-center gap-1 text-[15px]"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 17l5-5-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 font-semibold flex items-center gap-1 text-[15px]"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 16v1a4 4 0 0 1-8 0v-1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Join
        </Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded text-green-700 hover:bg-green-50 focus:outline-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="w-72 bg-white h-full shadow-lg flex flex-col p-4 relative animate-slideInLeft">
            <button
              className="absolute top-3 right-3 text-green-700 hover:bg-green-50 rounded p-1"
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
            <Link
              href="/"
              className="flex flex-col leading-tight items-start min-w-[90px] mb-4"
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-lg font-extrabold text-green-700">
                Expert
              </span>
              <span className="text-[10px] font-normal text-neutral-700 ml-[2px] -mt-1">
                In The City
              </span>
            </Link>
            <div className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) =>
                !link.dropdown ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={
                      (pathname === link.href
                        ? "text-green-700 "
                        : "text-neutral-900 ") +
                      "hover:text-green-700 transition px-1 py-1 rounded"
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <div key={link.name} className="">
                    <div className="flex items-center gap-1 text-neutral-900 font-medium mb-1">
                      {link.name}
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex flex-col gap-1">
                      {link.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-2 py-1 text-neutral-900 hover:bg-green-50 hover:text-green-700 rounded"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Link
                href="/auth/login"
                className="border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50 font-semibold flex items-center gap-1 text-[15px]"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 font-semibold flex items-center gap-1 text-[15px]"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 16v1a4 4 0 0 1-8 0v-1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Join
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
