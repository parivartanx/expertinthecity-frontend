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
import { HiOutlineUserGroup, HiOfficeBuilding, HiAcademicCap, HiCode, HiChartBar } from "react-icons/hi";
import { RiCustomerService2Line } from "react-icons/ri";
import { IconType } from "react-icons";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPortal } from 'react-dom';

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
  { name: "Home", href: "/", icon: BsHouseDoor },
  { name: "Experts", href: "/experts", icon: BsPeople },
  { name: "Categories", href: "/categories", icon: BsGrid },
  { name: "Chats", href: "/chats", icon: BsChatDots },
  {
    name: "More Info",
    href: "#",
    icon: BsInfoCircle,
    dropdown: true,
    items: [
      { name: "Community", href: "/community", icon: HiOutlineUserGroup },
      { name: "Testimonial", href: "/testimonial", icon: BsPeople },
      { name: "About Us", href: "/about", icon: BsInfoCircle },
      {
        name: "Contact Us",
        href: "/contact",
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
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Add state for portal
  const [mounted, setMounted] = React.useState(false);

  // Dummy search results data
  const dummyResults = {
    experts: [
      {
        id: 1,
        name: "Sarah Johnson",
        title: "Career Development Coach",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        category: "Career Coaching"
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Tech Leadership Mentor",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        category: "Technology"
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        title: "Business Strategy Consultant",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        category: "Business Strategy"
      }
    ],
    categories: [
      {
        id: 1,
        name: "Career Coaching",
        icon: <HiAcademicCap className="text-xl" />
      },
      {
        id: 2,
        name: "Technology",
        icon: <HiCode className="text-xl" />
      },
      {
        id: 3,
        name: "Business Strategy",
        icon: <HiChartBar className="text-xl" />
      }
    ]
  };

  // Filter results based on search query
  const filteredResults = {
    experts: dummyResults.experts.filter(expert => 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    categories: dummyResults.categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header
        className={`w-full px-4 py-2 flex items-center justify-between fixed top-0 z-[999] h-[60px] transition-all duration-300 ${
          pathname === "/" || pathname === "/"
            ? isScrolled
              ? "bg-white/80 backdrop-blur-md border-b border-green-200/50"
              : "bg-transparent"
            : "bg-white/80 backdrop-blur-md border-b border-green-200/50"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center gap-2">
            {/* City Icon */}
            <div className="relative">
              <HiOfficeBuilding className={`text-3xl ${(pathname === "/" || pathname === "/") && !isScrolled ? 'text-white' : 'text-green-600'} transition-colors duration-300`} />
            </div>
            
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                {/* Main "Expert" text */}
                <span 
                  className="text-2xl font-extrabold text-green-600 transition-colors duration-300"
                >
                  Expert
                </span>
                
                {/* "in" text */}
                <span 
                  className={`text-xs font-medium ${(pathname === "/" || pathname === "/") && !isScrolled ? 'text-white/90' : 'text-green-600'} -mt-1`}
                >
                  in
                </span>
              </div>
              
              {/* "THE CITY" text */}
              <span 
                className={`text-sm font-bold tracking-wider ${(pathname === "/" || pathname === "/") && !isScrolled ? 'text-white' : 'text-green-600'} -mt-1`}
              >
                THE CITY
              </span>
            </div>
          </div>
        </Link>

        {/* Search Bar - LinkedIn Style */}
        <div className="hidden lg:flex items-center ml-8">
          <div className={`relative flex items-center ${(pathname === "/" || pathname === "/") && !isScrolled ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-neutral-100 border-neutral-200'} border rounded-full px-4 py-1.5 w-[280px]`}>
            <CiSearch className={`text-xl ${(pathname === "/" || pathname === "/") && !isScrolled ? 'text-white/80' : 'text-neutral-500'}`} />
            <input
              type="text"
              placeholder="Search experts..."
              className={`w-full bg-transparent border-none outline-none px-2 text-sm ${(pathname === "/" || pathname === "/") && !isScrolled ? 'text-white placeholder-white/60' : 'text-neutral-900 placeholder-neutral-500'}`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Search Results Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-green-200/50 overflow-hidden z-50">
                <div className="p-3 border-b border-green-100">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">Experts</h3>
                  <div className="space-y-2">
                    {filteredResults.experts.map(expert => (
                      <div
                        key={expert.id}
                        className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                        onClick={() => router.push('/profile')}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={expert.avatar} alt={expert.name} />
                          <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{expert.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{expert.title}</p>
                        </div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {expert.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {filteredResults.categories.map(category => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                        onClick={() => router.push('/profile')}
                      >
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{category.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Results Button */}
                  <div className="p-3 border-t border-green-100">
                    <Link
                      href="/search"
                      className="w-full py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center gap-2 block"
                    >
                      <span>View all results</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 ml-4 font-semibold text-sm">
          {navLinks.map((link) =>
            !link.dropdown ? (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href 
                    ? (pathname === "/" || pathname === "/") && !isScrolled ? "text-white" : "text-green-600"
                    : (pathname === "/" || pathname === "/") && !isScrolled ? "text-white/80" : "text-green-600"
                } hover:text-green-600 transition px-1 flex items-center gap-2`}
              >
                <link.icon className="text-lg" />
                {link.name}
              </Link>
            ) : (
              <div key={link.name} className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className={`flex items-center gap-2 px-1 transition ${
                    showDropdown 
                      ? (pathname === "/" || pathname === "/") && !isScrolled ? "text-white" : "text-green-600"
                      : (pathname === "/" || pathname === "/") && !isScrolled ? "text-white/80" : "text-green-600"
                  } hover:text-green-600`}
                >
                  <link.icon className="text-lg" />
                  {link.name}
                  <MdKeyboardArrowDown
                    className={`text-lg transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-green-200/50 rounded-lg shadow-lg z-10 transform origin-top transition-all duration-200 ease-out">
                    {link.items?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-900 hover:bg-green-50 hover:text-green-600 transition-colors duration-150"
                      >
                        <item.icon className="text-lg" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-2 items-center">
          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden p-2 hover:bg-white/10 rounded ${pathname === "/" && !isScrolled ? 'text-white' : 'text-green-600'}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
          <div className="hidden lg:flex gap-2 ml-2">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-all">
                      <Avatar className="h-8 w-8 border-2 border-green-600">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          {getInitials(user?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm font-medium md:hidden ${pathname === "/" && !isScrolled ? 'text-white' : 'text-green-600'}`}>
                        {user?.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                    <div className="px-2 py-1.5 mb-1 border-b border-green-200">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <DropdownMenuItem
                      onClick={() => router.push("/user")}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:text-green-600 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                    >
                      <FaRegUser className="h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:text-green-600 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                    >
                      <IoIosLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout Confirmation Modal */}
                <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                  <DialogContent className="max-w-[90%] sm:max-w-[425px] z-[999999] rounded-lg shadow-lg border border-green-200">
                    <DialogHeader>
                      <DialogTitle>Confirm Logout</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to logout from your account?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-green-50 rounded-md transition-colors border border-green-200 outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowLogoutModal(false);
                          handleLogout();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                      >
                        Logout
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/" && !isScrolled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Portal */}
      {mounted && createPortal(
        <div
          className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => {
              setMobileOpen(false);
              setMobileDropdown(false);
            }}
          />
          
          {/* Drawer Content */}
          <div
            className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg flex flex-col p-4 border-r border-green-200 transform transition-transform duration-300"
            style={{
              transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="self-end mb-4 text-green-600"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <IoMdClose className="text-2xl" />
            </button>

            {/* Logo */}
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <div className="flex flex-col mb-4">
                <span className="text-lg font-extrabold text-green-600">
                  Expert
                </span>
                <span className="text-xs text-neutral-700 -mt-1 ml-[2px]">
                  In The City
                </span>
              </div>
            </Link>

            {/* Mobile Search Bar */}
            <div className="mb-4">
              <div className="relative flex items-center bg-neutral-100 border border-neutral-200 rounded-full px-4 py-1.5">
                <CiSearch className="text-xl text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search experts..."
                  className="w-full bg-transparent border-none outline-none px-2 text-sm text-neutral-900 placeholder-neutral-500"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Mobile Search Results Dropdown */}
              {searchFocused && searchQuery.trim() && (
                <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-green-200/50 overflow-hidden z-50">
                  <div className="p-3 border-b border-green-100">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Experts</h3>
                    <div className="space-y-2">
                      {filteredResults.experts.map(expert => (
                        <div
                          key={expert.id}
                          className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                          onClick={() => {
                            router.push('/profile');
                            setMobileOpen(false);
                          }}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={expert.avatar} alt={expert.name} />
                            <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{expert.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{expert.title}</p>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {expert.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Categories</h3>
                    <div className="space-y-2">
                      {filteredResults.categories.map(category => (
                        <div
                          key={category.id}
                          className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                          onClick={() => {
                            router.push('/profile');
                            setMobileOpen(false);
                          }}
                        >
                          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">{category.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Results Button */}
                    <div className="p-3 border-t border-green-100">
                      <Link
                        href="/search"
                        className="w-full py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center gap-2 block"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>View all results</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav */}
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) =>
                !link.dropdown ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? "text-green-600 bg-green-50"
                        : "text-neutral-900"
                    } hover:text-green-600 hover:bg-green-50 transition-all duration-200 text-sm font-medium px-3 py-2.5 rounded-lg flex items-center gap-2`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <link.icon className="text-lg" />
                    {link.name}
                  </Link>
                ) : (
                  <div key={link.name} className="flex flex-col gap-1">
                    <button
                      onClick={() => setMobileDropdown((prev) => !prev)}
                      className="text-neutral-900 text-sm font-medium flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
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
                            className="text-sm text-neutral-800 hover:text-green-600 hover:bg-green-50 transition-all duration-200 px-3 py-2 rounded-lg flex items-center gap-2"
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
              {pathname === "/" && !isScrolled ? (
                <>
                  <div
                    onClick={() => {
                      router.push("/user");
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Avatar className="h-8 w-8 border-2 border-green-600">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="border border-green-600 text-green-600 px-3 py-1 rounded hover:bg-green-50 flex items-center gap-2 text-sm"
                  >
                    <IoIosLogOut className="text-lg" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="border border-green-600 text-green-600 px-3 py-1 rounded hover:bg-green-50 flex items-center gap-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <IoIosLogOut className="text-lg" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FaRegUser className="text-md" />
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header;
