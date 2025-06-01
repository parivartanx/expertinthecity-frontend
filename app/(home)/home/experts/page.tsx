"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiUserAdd } from "react-icons/hi";

export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">
            Connect with Top <span className="text-green-400">Experts</span> in
            Your Field
          </h1>
          <p className="mb-6">
            Discover a diverse range of experts who can help you level up your
            career, hobby, or personal growth journey.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
              Join Now
            </button>
            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet Our <span className="text-green-600">Experts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <div key={index} className="border rounded-lg shadow-md p-4">
              <Image
                src={expert.image}
                alt={expert.title}
                width={600}
                height={400}
                className="rounded mb-4 object-cover h-48 w-full"
              />
              <h3 className="text-xl font-semibold mb-2">{expert.title}</h3>
              <p className="text-sm mb-4">{expert.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-green-700 font-medium mb-4">
                {expert.tags.map((tag, idx) => (
                  <span key={idx} className="bg-green-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-green-600 hover:underline">
                View profile →
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
            View All
          </button>
        </div>
      </section>

      <div className="flex w-full my-2 items-center justify-center bg-gray-100">
        <div
          className="inline-flex items-center gap-2 px-6 py-3  text-black font-semibold  hover:scale-90  transition-all duration-300 cursor-pointer"
          onClick={() => {
            router.push("/home/register");
          }}
        >
          <HiUserAdd className="text-xl" />
          <span>Join as Expert</span>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Discover Our{" "}
              <span className="text-green-600">Unique Features</span> and
              Benefits
            </h3>
            <p className="mb-4">
              Explore the benefits of connecting with top experts across various
              industries. Get personalized Expertship, career advice, and
              more—all in one platform.
            </p>
            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              Explore
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Why Choose{" "}
              <span className="text-green-600">ExpertInTheCity?</span>
            </h3>
            <p className="mb-4">
              We ensure you connect with verified professionals. Aspiring or
              experienced, this is your gateway to impactful learning and
              growth.
            </p>
            <button className="bg-white text-black px-6 py-2 border border-black rounded hover:bg-gray-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Connect with Your Ideal <span className="text-green-600">Expert</span>
        </h2>
        <p className="mb-8">
          Join our community to find expert Experts ready to guide you in your
          learning journey.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Sign Up
          </button>
          <button className="bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-200">
            Log In
          </button>
        </div>
      </section>
    </main>
  );
}

const experts = [
  {
    title: "Creative Writing",
    description:
      "Unlock your potential in global writing with Expertship from experienced professionals.",
    tags: ["Writing", "Short Stories", "Professional Coaching"],
    image:
      "https://plus.unsplash.com/premium_photo-1664372145543-d60ba2756a7e?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Hair Styling Expertise",
    description:
      "Enhance your skills in modern hair design and salon trends with pro-level coaching.",
    tags: ["Hair Styling", "Salon Practice"],
    image:
      "https://plus.unsplash.com/premium_photo-1661668935701-2429eb4da878?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFpciUyMHN0eWxpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Music Production",
    description: "Learn the art of music creation from industry professionals.",
    tags: ["Production", "Technology", "Session Process"],
    image:
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWMlMjBwcm9kdWN0aW9ufGVufDB8fDB8fHww",
  },
  {
    title: "Skincare Guidance",
    description:
      "Get access to skincare professionals to build custom routines.",
    tags: ["Creative Routine", "Skin Coaching Techniques"],
    image:
      "https://images.unsplash.com/photo-1674867688579-f46e18cd57f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNraW4lMjBjYXJlJTIwZ3VpZGFuY2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Yoga Instruction",
    description:
      "Discover new vitality through personal virtual yoga sessions.",
    tags: ["Wellness", "Mindfulness Practice", "Well-Being"],
    image:
      "https://plus.unsplash.com/premium_photo-1669446008800-9a124b0fd3a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Engineering Solutions",
    description:
      "Collaborate with experts to tackle complex challenges effectively.",
    tags: ["Innovation", "Systems Design", "Project Management"],
    image:
      "https://images.unsplash.com/photo-1727522974631-c8779e7de5d2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVuZ2luZWVyaW5nJTIwc29sdXRvbnN8ZW58MHx8MHx8fDA%3D",
  },
];
