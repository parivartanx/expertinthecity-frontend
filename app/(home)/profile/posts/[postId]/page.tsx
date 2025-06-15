"use client";
import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

// This would typically come from an API or database
const getPostData = (postId: string) => {
  const posts = {
    "post-1": {
      id: "post-1",
      author: "Sarah Johnson",
      time: "almost 2 years ago",
      text: "Excited to announce that I'm now offering online piano lessons for students worldwide! Whether you're a beginner or looking to advance your skills, I'd love to help you on your musical journey. Contact me for availability and rates.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      likes: 24,
      comments: 1,
    },
    "post-2": {
      id: "post-2",
      author: "Sarah Johnson",
      time: "almost 2 years ago",
      text: "Just wrapped up our spring recital! So proud of all my students who performed today. Their hard work and dedication really shone in their performances. Here are some key highlights from the event.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww",
      likes: 15,
      comments: 3,
    },
  };
  return posts[postId as keyof typeof posts];
};

export default function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const post = getPostData(params.postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
          <Link
            href="/profile"
            className="text-green-600 hover:underline mt-4 inline-block"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments((prev) => [...prev, comment]);
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
        {/* Back button */}
        <div className="p-4 border-b">
          <Link href="/profile" className="text-green-600 hover:underline">
            ← Back to Profile
          </Link>
        </div>

        {/* Post content */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
              alt={post.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{post.author}</h2>
              <p className="text-xs text-gray-500">{post.time}</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{post.text}</p>

          <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />

          {/* Interaction buttons */}
          <div className="flex items-center gap-6 border-t border-b py-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            >
              <Heart className={isLiked ? "fill-current" : ""} />
              <span>{post.likes + likes} Likes</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <MessageCircle />
              <span>{post.comments + comments.length} Comments</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <Share2 />
              <span>Share</span>
            </button>
          </div>

          {/* Comments section */}
          <div className="mt-4">
            <h3 className="font-semibold mb-4">Comments</h3>

            {/* Comment form */}
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                  alt="Your profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-sm">You</p>
                    <p className="text-sm text-gray-700">{comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
