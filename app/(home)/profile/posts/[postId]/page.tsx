"use client";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { usePostsStore } from "@/lib/mainwebsite/posts-store";

export default function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const {
    currentPost,
    comments,
    isLoading,
    error,
    fetchPostById,
    fetchComments,
    likePost,
    unlikePost,
    createComment,
  } = usePostsStore();

  const [isLiked, setIsLiked] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [optimisticComments, setOptimisticComments] = useState<string[]>([]);

  useEffect(() => {
    fetchPostById(params.postId);
    fetchComments(params.postId);
    // eslint-disable-next-line
  }, [params.postId]);

  useEffect(() => {
    if (currentPost) {
      setIsLiked(!!currentPost.isLiked);
      setOptimisticLikes(0);
    }
    setOptimisticComments([]);
  }, [currentPost]);

  if (isLoading && !currentPost) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">{error}</h1>
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

  if (!currentPost) {
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

  const handleLike = async () => {
    if (!currentPost) return;
    setIsLiked((prev) => !prev);
    setOptimisticLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) {
      await likePost(currentPost.id);
    } else {
      await unlikePost(currentPost.id);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && currentPost) {
      setOptimisticComments((prev) => [...prev, comment]);
      setComment("");
      await createComment(currentPost.id, comment);
      // fetchComments(currentPost.id); // Optionally refresh comments
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
              src={currentPost.user.avatar ||
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
              }
              alt={currentPost.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{currentPost.user.name}</h2>
              <p className="text-xs text-gray-500">{new Date(currentPost.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{currentPost.content}</p>

          {currentPost.image && (
            <img src={currentPost.image} alt="Post" className="w-full rounded-lg mb-4" />
          )}

          {/* Interaction buttons */}
          <div className="flex items-center gap-6 border-t border-b py-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-500"
                }`}
            >
              <Heart className={isLiked ? "fill-current" : ""} />
              <span>{(currentPost._count.likes || 0) + optimisticLikes} Likes</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <MessageCircle />
              <span>{(currentPost._count.comments || 0) + optimisticComments.length} Comments</span>
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
                  src={currentPost.user.avatar ||
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                  }
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
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img
                    src={c.user.avatar ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                    }
                    alt={c.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-sm">{c.user.name}</p>
                    <p className="text-sm text-gray-700">{c.content}</p>
                  </div>
                </div>
              ))}
              {/* Optimistic comments */}
              {optimisticComments.map((c, i) => (
                <div key={`optimistic-${i}`} className="flex gap-3 opacity-70">
                  <img
                    src={currentPost.user.avatar ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww"
                    }
                    alt="You"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-sm">You</p>
                    <p className="text-sm text-gray-700">{c}</p>
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
