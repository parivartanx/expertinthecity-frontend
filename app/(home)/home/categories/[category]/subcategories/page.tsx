"use client";

import { useRouter, useParams } from "next/navigation";

const groupedCategories = [
  {
    name: "Professional & Business Support",
    subcategories: [
      "Financial Advice & Investment Planning",
      "Tax Planning & Cross-Border Compliance",
      "Legal Consultations & Contract Help",
      "Business Mentorship & Start-Up Support",
      "Real Estate Help & Relocation Support",
      "IT Consultants & Tech Solutions",
      "Crypto & Blockchain Experts",
      "Career Counsellors & Transition Coaches",
      "Personal Branding, Resume & LinkedIn Strategy",
    ],
  },
  {
    name: "Health, Wellness & Medical Guidance",
    subcategories: [
      "General Wellness Coaching (Nutrition, Sleep, Stress)",
      "Mental Health & Emotional Resilience Coaching",
      "Fitness Trainers & Online Health Programs",
      "Yoga, Pilates & Holistic Movement Instructors",
      "Medical Experts & Health Educators (non-diagnostic or second-opinion services)",
      "Preventive Health & Lifestyle Medicine Consultants",
    ],
  },
  {
    name: "Career & Education Support",
    subcategories: [
      "Career Counselling for Students & Professionals",
      "College Admissions & Study Abroad Advisors",
      "Upskilling Mentors & Job Market Guidance",
      "CV, Cover Letter, LinkedIn & Interview Prep Experts",
    ],
  },
  {
    name: "Life & Lifestyle Guidance",
    subcategories: [
      "Travel & Relocation Consultants",
      "Parenting Coaches & Family Advisors",
      "Relationship Coaches & Conflict Mediators",
      "Life Coaching & Mindset Mentorship",
    ],
  },
  {
    name: "Creative, Art & Expression",
    subcategories: [
      "Art Mentors & Portfolio Reviewers",
      "Design & Illustration Coaching",
      "Photography & Filmmaking Mentors",
      "Writing, Blogging & Creative Content Experts",
      "Music Instructors, Producers & Vocal Coaches",
      "Dance, Theatre & Performing Arts Coaches",
    ],
  },
  {
    name: "Sports, Performance & Movement",
    subcategories: [
      "Sports Coaches (Football, Tennis, Cricket, etc.)",
      "Athlete Mindset & Performance Coaching",
      "Dance Instructors & Competitive Prep",
      "Body Mechanics, Flexibility & Strength Trainers",
    ],
  },
];

export default function SubcategoriesPage() {
  const router = useRouter();
  const params = useParams();
  const { category } = params;

  // Find the category object
  const categoryObj = groupedCategories.find(
    (cat) =>
      cat.name.toLowerCase().replace(/\s+/g, "-") ===
      decodeURIComponent(category as string)
  );

  if (!categoryObj) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Category Not Found
        </h1>
        <p className="text-neutral-600">
          Please go back and select a valid category.
        </p>
      </div>
    );
  }

  const handleSubcategoryClick = (subcategory: string) => {
    // For now, just alert. Later, route to experts page.
    router.push(
      `/home/categories/${encodeURIComponent(
        category as string
      )}/subcategories/${encodeURIComponent(
        subcategory.toLowerCase().replace(/\s+/g, "-")
      )}`
    );
  };

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center">
        {categoryObj.name}
      </h1>
      <h2 className="text-xl font-semibold mb-8 text-center text-neutral-700">
        Choose a subcategory to find your expert
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryObj.subcategories.map((subcat) => (
          <button
            key={subcat}
            onClick={() => handleSubcategoryClick(subcat)}
            className="w-full p-6 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 text-left text-green-900 font-semibold text-lg transition-colors duration-200 shadow-sm"
          >
            {subcat}
          </button>
        ))}
      </div>
    </main>
  );
}
