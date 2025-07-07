"use client";
import { useEffect } from "react";
import { usePostsStore } from "@/lib/mainwebsite/posts-store";
import Link from "next/link";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";

export default function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { user } = useAuthStore();
  const { currentPost, isLoading, error, getPostById } = usePostsStore((state) => ({
    currentPost: state.currentPost,
    isLoading: state.isLoading,
    error: state.error,
    getPostById: state.getPostById,
  }));

  useEffect(() => {
    if (params.postId) {
      getPostById(params.postId);
    }
  }, [params.postId, getPostById]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
        {/* Back button */}
        <div className="p-4 border-b">
          <Link href="/profile" className="text-green-600 hover:underline">
            ← Back to Profile
          </Link>
        </div>
        <div className="p-4">
          {isLoading && <div className="text-gray-600">Loading post...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!isLoading && !error && currentPost && (
            <div>
              <h2 className="text-xl font-bold mb-2">{currentPost.title}</h2>
              <div className="text-gray-700 mb-4">{currentPost.content}</div>
              {currentPost.image && (
                <img src={currentPost.image} alt="Post image" className="mb-4 rounded" />
              )}
              <div className="text-sm text-gray-500 mb-2">
                By {currentPost.author?.name} on {new Date(currentPost.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-4 text-gray-600">
                <span>Likes: {currentPost.analytics?.likes ?? 0}</span>
                <span>Comments: {currentPost.analytics?.comments ?? 0}</span>
              </div>
            </div>
          )}
          {!isLoading && !error && !currentPost && (
            <div className="text-gray-600">Post details are unavailable.</div>
          )}
        </div>
      </div>
    </div>
  );
}
