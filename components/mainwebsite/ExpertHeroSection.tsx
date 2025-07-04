"use client";

import Link from "next/link";
import { HiUserAdd, HiSearch, HiLightningBolt, HiStar, HiShieldCheck, HiOfficeBuilding, HiAcademicCap, HiBriefcase, HiUserGroup, HiCode, HiChartBar, HiHeart, HiMusicNote, HiCamera, HiPencilAlt, HiCurrencyDollar, HiScale, HiLightBulb, HiPresentationChartLine, HiBeaker, HiBookOpen, HiCog, HiGlobe, HiSparkles } from "react-icons/hi";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useCategoriesStore } from "@/lib/mainwebsite/categories-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ExpertHeroSection = () => {
  const containerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const router = useRouter();
  const { searchSuggestions } = useAllExpertsStore();
  const { categories, fetchAllCategories, isLoading: categoriesLoading } = useCategoriesStore();

  // State for search results
  const [searchResults, setSearchResults] = useState<{
    experts: any[];
    categories: any[];
  }>({ experts: [], categories: [] });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Fetch categories on component mount
  useEffect(() => {
    if (categories.length === 0) {
      fetchAllCategories();
    }
  }, [fetchAllCategories, categories.length]);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim() && searchFocused) {
        setIsSearchLoading(true);
        try {
          const results = await searchSuggestions(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          setSearchResults({ experts: [], categories: [] });
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setSearchResults({ experts: [], categories: [] });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchFocused, searchSuggestions]);

  // Helper function to get category icon component
  const getCategoryIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      HiAcademicCap: HiAcademicCap,
      HiCode: HiCode,
      HiChartBar: HiChartBar,
      HiPresentationChartLine: HiPresentationChartLine,
      HiCurrencyDollar: HiCurrencyDollar,
      HiHeart: HiHeart,
      HiPencil: HiPencilAlt,
      HiTrendingUp: HiLightningBolt,
      HiUserGroup: HiUserGroup,
      HiBriefcase: HiBriefcase,
    };

    const IconComponent = iconMap[iconName] || HiAcademicCap;
    return <IconComponent className="text-xl" />;
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const categoryIcons: { [key: string]: any } = {
      "Career Coaching": HiAcademicCap,
      "Technology": HiCode,
      "Business Strategy": HiChartBar,
      "Marketing": HiPresentationChartLine,
      "Finance": HiCurrencyDollar,
      "Health & Wellness": HiHeart,
      "Education": HiAcademicCap,
      "Design": HiPencilAlt,
      "Sales": HiLightningBolt,
      "Leadership": HiUserGroup,
      "Consulting": HiBriefcase,
      "Coaching": HiAcademicCap,
      "Personal Development": HiLightBulb,
      "Creative Arts": HiSparkles,
      "Media": HiCamera,
      "Writing": HiPencilAlt,
      "Law": HiScale,
      "Science": HiBeaker,
      "Research": HiBookOpen,
      "Engineering": HiCog,
      "Language": HiGlobe,
    };

    return categoryIcons[categoryName] || HiAcademicCap;
  };

  const expertIcons = [
    { icon: <HiAcademicCap className="text-4xl" />, label: "Education" },
    { icon: <HiCode className="text-4xl" />, label: "Technology" },
    { icon: <HiChartBar className="text-4xl" />, label: "Business" },
    { icon: <HiHeart className="text-4xl" />, label: "Health" },
    { icon: <HiMusicNote className="text-4xl" />, label: "Arts" },
    { icon: <HiCamera className="text-4xl" />, label: "Media" },
    { icon: <HiPencilAlt className="text-4xl" />, label: "Writing" },
    { icon: <HiUserGroup className="text-4xl" />, label: "Coaching" },
    { icon: <HiCurrencyDollar className="text-4xl" />, label: "Finance" },
    { icon: <HiScale className="text-4xl" />, label: "Law" },
    { icon: <HiLightBulb className="text-4xl" />, label: "Consulting" },
    { icon: <HiPresentationChartLine className="text-4xl" />, label: "Marketing" },
    { icon: <HiBeaker className="text-4xl" />, label: "Science" },
    { icon: <HiBookOpen className="text-4xl" />, label: "Research" },
    { icon: <HiCog className="text-4xl" />, label: "Engineering" },
    { icon: <HiGlobe className="text-4xl" />, label: "Language" },
    { icon: <HiSparkles className="text-4xl" />, label: "Design" },
    { icon: <HiBriefcase className="text-4xl" />, label: "Career" }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/allexperts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* City Skyline Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/city-skyline.jpg"
          alt="City Skyline"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/60 to-neutral-900/90" />
      </div>

      {/* Team Image Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/70 to-neutral-900/90" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6"
          >
            Your City's Expert Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-4 sm:mb-6"
          >
            Find Your{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                Local Expert
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
          >
            Connect with verified experts in your city. From career guidance to personal development,
            find the perfect mentor to help you grow and succeed.
          </motion.p>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
          >
            <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for experts in your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 backdrop-blur-sm text-sm sm:text-base"
                />

                {/* Search Results Dropdown */}
                {searchFocused && (searchResults.experts.length > 0 || searchResults.categories.length > 0 || isSearchLoading) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {isSearchLoading ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                      </div>
                    ) : (
                      <>
                        {searchResults.experts.length > 0 && (
                          <div className="p-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              Experts
                            </h3>
                            <div className="space-y-2">
                              {searchResults.experts.map((expert) => (
                                <div
                                  key={expert.id}
                                  className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                                  onClick={() => {
                                    router.push(`/experts/${expert.id}`);
                                    setSearchFocused(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={expert.image} alt={expert.name} />
                                    <AvatarFallback>
                                      {expert.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {expert.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {expert.title}
                                    </p>
                                  </div>
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {expert.categories?.[0] || "Expert"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.categories.length > 0 && (
                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                              Categories
                            </h3>
                            <div className="space-y-2">
                              {searchResults.categories.map((category) => (
                                <div
                                  key={category.id}
                                  className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md cursor-pointer transition-colors"
                                  onClick={() => {
                                    router.push(`/categories/${category.id}`);
                                    setSearchFocused(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    {getCategoryIconComponent(category.icon)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {category.name}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* View All Results Button */}
                        {(searchResults.experts.length > 0 || searchResults.categories.length > 0) && (
                          <div className="p-3 border-t border-gray-100">
                            <button
                              className="w-full text-sm text-green-600 hover:text-green-700 font-medium py-2 hover:bg-green-50 rounded-md transition-colors"
                              onClick={() => {
                                handleSearch(searchQuery);
                                setSearchFocused(false);
                              }}
                            >
                              View all results for "{searchQuery}"
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSearch(searchQuery)}
                className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <HiSearch className="text-xl" />
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-8 sm:mb-12 px-2 sm:px-0"
          >
            {categoriesLoading ? (
              // Loading skeleton for categories
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/10 border border-white/20 animate-pulse"
                >
                  <div className="w-16 sm:w-20 h-4 bg-white/20 rounded"></div>
                </motion.div>
              ))
            ) : (
              categories.slice(0, 8).map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSearch(category.name)}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 border border-white/20 hover:border-green-500/50 text-xs sm:text-base whitespace-nowrap"
                >
                  {category.name}
                </motion.button>
              ))
            )}
          </motion.div>

          {/* Expert Icons Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="relative max-w-6xl mx-auto mb-8 sm:mb-12 overflow-hidden px-4 sm:px-0"
          >
            <div className="flex gap-4 sm:gap-8 animate-scroll">
              {categoriesLoading ? (
                // Loading skeleton for expert icons
                Array.from({ length: 8 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex-shrink-0 flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl bg-white/5 border border-white/10 min-w-[100px] sm:min-w-[140px] animate-pulse"
                  >
                    <div className="text-green-400 text-3xl sm:text-5xl">
                      <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="w-16 h-3 bg-white/20 rounded"></div>
                  </motion.div>
                ))
              ) : (
                <>
                  {categories.slice(0, 9).map((category, index) => {
                    const IconComponent = getCategoryIcon(category.name);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        onClick={() => handleSearch(category.name)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors duration-300 min-w-[100px] sm:min-w-[140px] cursor-pointer"
                      >
                        <div className="text-green-400 text-3xl sm:text-5xl">
                          <IconComponent />
                        </div>
                        <span className="text-xs sm:text-sm text-white/70 font-medium text-center">{category.name}</span>
                      </motion.div>
                    );
                  })}
                  {/* Duplicate set for seamless scrolling */}
                  {categories.slice(0, 9).map((category, index) => {
                    const IconComponent = getCategoryIcon(category.name);
                    return (
                      <motion.div
                        key={`${category.id}-duplicate`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        onClick={() => handleSearch(category.name)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors duration-300 min-w-[100px] sm:min-w-[140px] cursor-pointer"
                      >
                        <div className="text-green-400 text-3xl sm:text-5xl">
                          <IconComponent />
                        </div>
                        <span className="text-xs sm:text-sm text-white/70 font-medium text-center">{category.name}</span>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0"
          >
            {[
              {
                icon: <HiStar className="text-2xl sm:text-3xl text-yellow-400" />,
                title: "Verified Experts",
                description: "All experts are thoroughly vetted and verified"
              },
              {
                icon: <HiLightningBolt className="text-2xl sm:text-3xl text-green-400" />,
                title: "Quick Response",
                description: "Get matched with experts within 24 hours"
              },
              {
                icon: <HiShieldCheck className="text-2xl sm:text-3xl text-blue-400" />,
                title: "Secure Platform",
                description: "Safe and secure communication platform"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors duration-300"
              >
                {item.icon}
                <div className="text-left">
                  <h3 className="text-white font-semibold text-sm sm:text-base">{item.title}</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4 sm:px-0"
          >
            <Link href="/allexperts" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 sm:px-10 py-3 sm:py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 text-base sm:text-lg"
              >
                <HiUserAdd className="text-xl sm:text-2xl" />
                Find an Expert
              </motion.button>
            </Link>
            <Link href="/experts" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 sm:px-10 py-3 sm:py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors duration-200 flex items-center justify-center gap-3 border border-white/20 text-base sm:text-lg"
              >
                <HiLightningBolt className="text-xl sm:text-2xl" />
                Learn More - Experts
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Curved White Bottom Section */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] overflow-hidden z-[1]">
        <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#ffffff" d="M0,60 C240,10 480,110 720,60 C960,10 1200,110 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ExpertHeroSection;
