import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    category: "Education",
    title: "Maximize Your Learning Potential",
    description:
      "Unlock strategies to make the most of your mentorship experience.",
    author: "Jane Doe",
    date: "11 Jan 2022",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1745179177535-f83fb38821a2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    category: "Wellness",
    title: "The Benefits of Mindfulness",
    description: "Learn how mindfulness can transform your daily routine.",
    author: "John Smith",
    date: "10 Feb 2022",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1746003288323-89dba68721f6?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    category: "Music",
    title: "Finding Your Musical Voice",
    description: "Tips for developing your unique sound and style.",
    author: "Emily Clark",
    date: "15 Mar 2022",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1746105523293-1954154b6ccc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function BlogSection() {
  return (
    <section className="py-16 px-4 text-center bg-white">
      <p className="text-sm text-gray-600 mb-1">Blog</p>
      <h2 className="text-3xl font-semibold mb-2">
        <span className="text-green-600">Explore</span> Our Insights
      </h2>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        Discover articles to enhance your learning journey.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogPosts.map((post) => (
          <div key={post.id} className="text-left">
            <div className="w-full h-56 relative mb-4">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <p className="text-sm text-green-600 font-semibold mb-1">
              {post.category}
            </p>
            <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{post.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>👤 {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button className="px-5 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition">
          View all
        </button>
      </div>
    </section>
  );
}
