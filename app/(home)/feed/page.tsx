"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaComment, FaEdit, FaImage, FaTimes, FaTrash, FaEllipsisH, FaFlag, FaUser, FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaMedal } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { usePostsStore } from "@/lib/mainwebsite/posts-store";
import { toast } from "sonner";
import Link from "next/link";
import { useReportStore } from "@/lib/mainwebsite/report-store";
import { useLikeStore } from "@/lib/mainwebsite/like-store";
import { useCommentStore } from "@/lib/mainwebsite/comment-store";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";

export default function FeedPage() {
    const router = useRouter();
    const { user, isLoading, initializeAuth } = useAuthStore();
    const { profile, fetchUserProfile } = useUserStore();
    const {
        posts,
        getFollowingPosts,
        createPost,
        updatePost,
        deletePost,
        getUploadUrl,
        addLikeOptimistically,
        removeLikeOptimistically,
        addCommentOptimistically,
        removeCommentOptimistically,
        isLoading: postsLoading,
        error: postsError
    } = usePostsStore();
    const { reportPost, isLoading: reportLoading, success: reportSuccess, error: reportError, clearError, clearSuccess } = useReportStore();
    const {
        postLikes,
        likePost,
        unlikePost,
        getPostLikes,
        isLoading: likeLoading
    } = useLikeStore();
    const {
        comments,
        getComments,
        createComment,
        updateComment,
        deleteComment,
        createReply,
        updateReply,
        deleteReply,
        addCommentOptimisticallyToStore,
        updateCommentOptimistically,
        deleteCommentOptimistically,
        addReplyOptimistically,
        updateReplyOptimistically,
        deleteReplyOptimistically,
        updateOptimisticReplyWithReal,
        updateOptimisticCommentWithReal,
        isLoading: commentLoading
    } = useCommentStore();

    // State for modals and interactions
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);
    const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [editReplyContent, setEditReplyContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const desktopHoverTimeout = useRef<NodeJS.Timeout | null>(null);
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportPostId, setReportPostId] = useState<string | null>(null);
    const [postsToShow, setPostsToShow] = useState(10);

    // Create post state
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);

    // Edit post state
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editPostTitle, setEditPostTitle] = useState("");
    const [editPostContent, setEditPostContent] = useState("");
    const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [isUpdatingPost, setIsUpdatingPost] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    // Delete confirmation dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const isExpert = user?.role?.toUpperCase() === "EXPERT";
    const isUser = user?.role?.toUpperCase() === "USER";

    // Experts state
    const { experts, isLoading: expertsLoading, error: expertsError, fetchAllExperts } = useAllExpertsStore();
    const [expertsToShow, setExpertsToShow] = useState(3);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        fetchAllExperts(1, expertsToShow);
    }, [expertsToShow, fetchAllExperts]);

    // Fetch user profile on component mount (only if not already cached)
    useEffect(() => {
        if (user) {
            fetchUserProfile(); // Always fetch latest profile on mount/refresh
        }
    }, [user, fetchUserProfile]);

    // Fetch posts based on user role
    useEffect(() => {
        if (user) {
            getFollowingPosts({ page: 1, limit: 20 });
        }
    }, [user, getFollowingPosts]);

    // Handler for opening the report dialog
    const handleOpenReportDialog = (postId: string) => {
        setReportPostId(postId);
        setReportReason("");
        setReportDialogOpen(true);
        clearError();
        clearSuccess();
    };

    // Handler for submitting the report
    const handleSubmitReport = async () => {
        if (reportPostId && reportReason.trim()) {
            await reportPost(reportPostId, reportReason);
            setReportReason("");
        }
    };

    // Close dialog on success
    useEffect(() => {
        if (reportSuccess) {
            setReportDialogOpen(false);
            setTimeout(() => clearSuccess(), 2000);
        }
    }, [reportSuccess, clearSuccess]);

    const handleShowMorePosts = () => {
        setPostsToShow(prev => Math.min(prev + 5, posts.length));
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCreatePost = async () => {
        if (!postTitle.trim() || !postContent.trim()) {
            toast.error("Please fill in both title and content");
            return;
        }

        try {
            setIsCreatingPost(true);
            let imageKey: string | undefined;

            // Upload image if selected
            if (selectedImage) {
                const uploadData = await getUploadUrl(selectedImage.type, selectedImage.name);

                // Upload to S3
                const uploadResponse = await fetch(uploadData.uploadUrl, {
                    method: 'PUT',
                    body: selectedImage,
                    headers: {
                        'Content-Type': selectedImage.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                imageKey = uploadData.key;
            }

            // Create post
            await createPost({
                title: postTitle.trim(),
                content: postContent.trim(),
                imageKey,
            });

            // Reset form
            setPostTitle("");
            setPostContent("");
            setSelectedImage(null);
            setImagePreview(null);
            setShowCreatePost(false);

            toast.success("Post created successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post. Please try again.");
        } finally {
            setIsCreatingPost(false);
        }
    };

    const handleCancelCreate = () => {
        setPostTitle("");
        setPostContent("");
        setSelectedImage(null);
        setImagePreview(null);
        setShowCreatePost(false);
    };

    const handleEditPost = (post: any) => {
        setEditingPostId(post.id);
        setEditPostTitle(post.title);
        setEditPostContent(post.content);
        setEditSelectedImage(null);
        setEditImagePreview(post.image || null);
    };

    const handleEditImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveEditImage = () => {
        setEditSelectedImage(null);
        setEditImagePreview(null);
    };

    const handleUpdatePost = async () => {
        if (!editingPostId || !editPostTitle.trim() || !editPostContent.trim()) {
            toast.error("Please fill in both title and content");
            return;
        }

        try {
            setIsUpdatingPost(true);
            let imageKey: string | undefined;

            // Upload new image if selected
            if (editSelectedImage) {
                const uploadData = await getUploadUrl(editSelectedImage.type, editSelectedImage.name);

                // Upload to S3
                const uploadResponse = await fetch(uploadData.uploadUrl, {
                    method: 'PUT',
                    body: editSelectedImage,
                    headers: {
                        'Content-Type': editSelectedImage.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                imageKey = uploadData.key;
            }

            // Update post
            await updatePost(editingPostId, {
                title: editPostTitle.trim(),
                content: editPostContent.trim(),
                ...(imageKey && { imageKey }),
            });

            // Reset form
            setEditingPostId(null);
            setEditPostTitle("");
            setEditPostContent("");
            setEditSelectedImage(null);
            setEditImagePreview(null);

            toast.success("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post. Please try again.");
        } finally {
            setIsUpdatingPost(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditPostTitle("");
        setEditPostContent("");
        setEditSelectedImage(null);
        setEditImagePreview(null);
    };

    const handleDeletePost = async (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteDialog(true);
    };

    const confirmDeletePost = async () => {
        if (!postToDelete) return;

        // Close dialog immediately for better UX
        setShowDeleteDialog(false);
        setPostToDelete(null);

        // Perform delete operation in background
        try {
            await deletePost(postToDelete);
            toast.success("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post. Please try again.");
        }
    };

    const cancelDeletePost = () => {
        setShowDeleteDialog(false);
        setPostToDelete(null);
    };

    const getAvatarUrl = (avatar: any) => {
        if (avatar && typeof avatar === 'string' && avatar.trim() !== '') {
            return avatar;
        }
        return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
    };

    const getProgressLevelIcon = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return <FaMedal className="w-6 h-6 text-green-500" />;
            case 'intermediate':
                return <FaMedal className="w-6 h-6 text-yellow-500" />;
            case 'advanced':
                return <FaMedal className="w-6 h-6 text-red-500" />;
            case 'expert':
                return <FaMedal className="w-6 h-6 text-purple-500" />;
            case 'bronze':
                return <FaMedal className="w-6 h-6 text-yellow-600" />;
            case 'silver':
                return <FaMedal className="w-6 h-6 text-gray-400" />;
            case 'gold':
                return <FaMedal className="w-6 h-6 text-yellow-500" />;
            default:
                return <FaMedal className="w-6 h-6 text-gray-500" />;
        }
    };

    if (isLoading) {
        // Auth state is loading
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
                    <span className="text-muted-foreground">Loading...</span>
                </div>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-muted-foreground mb-4">Please Login</h1>
                        <Button
                            onClick={() => router.push('/login')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Login to View Feed
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Spacing */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        {/* Empty space for consistent margin */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Profile Details */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20">
                            {/* Profile Card */}
                            <Card>
                                <CardContent className="p-6 relative">
                                    <div className="text-center">
                                        {/* Avatar */}
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={profile?.avatar} alt={profile?.name} />
                                            <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        {/* Name and Role */}
                                        <h1 className="text-2xl font-bold text-foreground mb-2">
                                            {profile?.name}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {isExpert ? "Expert" : "Member"}
                                        </p>
                                        {/* Bio */}
                                        {profile?.bio && (
                                            <p className="text-muted-foreground mb-4">{profile.bio}</p>
                                        )}
                                        {/* Location */}
                                        {profile?.location && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                                <FaMapMarkerAlt />
                                                <span>
                                                    {typeof profile.location === "string"
                                                        ? profile.location
                                                        : [profile.location.city, profile.location.country].filter(Boolean).join(", ")}
                                                </span>
                                            </div>
                                        )}
                                        {/* Email */}
                                        {profile?.email && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                                <FaUser />
                                                <span>{profile.email}</span>
                                            </div>
                                        )}
                                        {/* Interests */}
                                        {profile?.interests && profile.interests.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                {profile.interests.slice(0, 3).map((interest, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                                        {interest}
                                                    </Badge>
                                                ))}
                                                {profile.interests.length > 3 && (
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                                                        +{profile.interests.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        {/* Stats */}
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile?.followersCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile?.followingCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Following</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile?.postsCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Posts</div>
                                            </div>
                                        </div>
                                        {/* Update Profile Button */}
                                        <div className="space-y-3 mt-6">
                                            <Button 
                                                onClick={() => setShowCreatePost(true)}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                            >
                                                <FaEdit className="mr-2" />
                                                Create Post
                                            </Button>
                                            <Link href="/profile/update">
                                                <Button variant="outline" className="w-full">
                                                    <FaEdit className="mr-2" />
                                                    Update Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Middle Column - Feed Posts */}
                    <div className="lg:col-span-6">
                        <div className="sticky top-20">
                            {/* LinkedIn-style Post Composer */}
                            <Card className="mb-6">
                            <CardContent className="p-4">
                                {!showCreatePost ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={getAvatarUrl(profile?.avatar)} alt={profile?.name || user?.name || 'User'} />
                                            <AvatarFallback>{(profile?.name || user?.name || 'U').charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="flex-1 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowCreatePost(true)}
                                        >
                                            <p className="text-muted-foreground">
                                                {isExpert ? "Share your expertise and insights..." : "Share your thoughts and experiences..."}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => setShowCreatePost(true)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <FaEdit className="mr-2" />
                                            Post
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Create New Post</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancelCreate}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <FaTimes />
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Post title..."
                                                value={postTitle}
                                                onChange={(e) => setPostTitle(e.target.value)}
                                                className="text-lg font-medium"
                                            />

                                            <Textarea
                                                placeholder="Share your thoughts, experiences, or insights..."
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                className="min-h-[120px] resize-none"
                                            />

                                            {/* Image Upload Section */}
                                            <div className="space-y-2">
                                                {!imagePreview ? (
                                                    <div className="flex items-center gap-2">
                                                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                            <FaImage className="text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">Add Image</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageSelect}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full max-h-64 object-cover rounded-lg"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleRemoveImage}
                                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={handleCancelCreate}
                                                    disabled={isCreatingPost}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleCreatePost}
                                                    disabled={isCreatingPost || !postTitle.trim() || !postContent.trim()}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {isCreatingPost ? "Creating..." : "Create Post"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Posts Feed */}
                        {postsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="animate-pulse">
                                                <div className="p-4 border-b">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                        <div className="flex-1">
                                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : posts && posts.length > 0 ? (
                            <>
                                {posts.slice(0, postsToShow).map((post) => (
                                    <Card key={post.id} className="overflow-hidden mb-6">
                                        <CardContent className="p-0">
                                            {/* Post Header */}
                                            <div className="p-4 border-b">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={getAvatarUrl(post.author.avatar)} alt={post.author.name} />
                                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {/* Post Actions Menu - Only for own posts */}
                                                    {user && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <FaEllipsisH className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {post.authorId === user.id ? (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleEditPost(post)}
                                                                            disabled={editingPostId === post.id}
                                                                        >
                                                                            <FaEdit className="mr-2 h-4 w-4" />
                                                                            Edit Post
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDeletePost(post.id)}
                                                                            className="text-red-600 focus:text-red-600"
                                                                        >
                                                                            <FaTrash className="mr-2 h-4 w-4" />
                                                                            Delete Post
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                ) : (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleOpenReportDialog(post.id)}
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        <FaFlag className="mr-2 h-4 w-4" />
                                                                        Report Post
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Post Content */}
                                            {editingPostId === post.id ? (
                                                <div className="p-4 space-y-4">
                                                    <div className="space-y-3">
                                                        <Input
                                                            placeholder="Post title..."
                                                            value={editPostTitle}
                                                            onChange={(e) => setEditPostTitle(e.target.value)}
                                                            className="text-lg font-medium"
                                                        />

                                                        <Textarea
                                                            placeholder="Share your thoughts, experiences, or insights..."
                                                            value={editPostContent}
                                                            onChange={(e) => setEditPostContent(e.target.value)}
                                                            className="min-h-[120px] resize-none"
                                                        />

                                                        {/* Image Upload Section */}
                                                        <div className="space-y-2">
                                                            {!editImagePreview ? (
                                                                <div className="flex items-center gap-2">
                                                                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                                        <FaImage className="text-muted-foreground" />
                                                                        <span className="text-sm text-muted-foreground">Add Image</span>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={handleEditImageSelect}
                                                                            className="hidden"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <div className="relative">
                                                                    <img
                                                                        src={editImagePreview}
                                                                        alt="Preview"
                                                                        className="w-full max-h-64 object-cover rounded-lg"
                                                                    />
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleRemoveEditImage}
                                                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                                                                    >
                                                                        <FaTimes />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={handleCancelEdit}
                                                                disabled={isUpdatingPost}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={handleUpdatePost}
                                                                disabled={isUpdatingPost || !editPostTitle.trim() || !editPostContent.trim()}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                {isUpdatingPost ? "Updating..." : "Update Post"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-foreground mb-2">{post.title}</h4>
                                                    {/* Render post.content as rich HTML with proper styling */}
                                                    <div 
                                                        className="text-foreground mb-4" 
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: post.content 
                                                                .replace(/\n/g, '<br>')
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                                                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                                                .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
                                                                .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>')
                                                                .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-foreground">$1</h2>')
                                                                .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-foreground">$1</h1>')
                                                                .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
                                                                .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
                                                                .replace(/<ul>/g, '<ul class="list-disc ml-4 mb-2">')
                                                                .replace(/<ol>/g, '<ol class="list-decimal ml-4 mb-2">')
                                                                .replace(/<p>/g, '<p class="mb-2">')
                                                                .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-green-500 pl-4 italic bg-gray-50 py-2 rounded-r">')
                                                        }} 
                                                    />
                                                    {post.image && (
                                                        <img
                                                            src={post.image}
                                                            alt="Post"
                                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Post Actions */}
                                            <div className="px-4 pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            className={`flex items-center gap-2 transition-colors ${post.likedByIds?.includes(user?.id || '')
                                                                ? "text-red-500"
                                                                : "text-muted-foreground hover:text-red-500"
                                                                }`}
                                                            onClick={async () => {
                                                                if (!user) {
                                                                    return;
                                                                }
                                                                
                                                                // Optimistic update - immediately update UI
                                                                const isCurrentlyLiked = post.likedByIds?.includes(user.id) || false;
                                                                
                                                                // Update local state immediately for better UX
                                                                if (isCurrentlyLiked) {
                                                                    removeLikeOptimistically(post.id, user.id);
                                                                } else {
                                                                    addLikeOptimistically(post.id, user.id);
                                                                }
                                                                
                                                                // Perform async operation in background
                                                                try {
                                                                    if (isCurrentlyLiked) {
                                                                        await unlikePost(post.id);
                                                                    } else {
                                                                        await likePost(post.id);
                                                                    }
                                                                    // Refresh likes count silently
                                                                    await getPostLikes(post.id);
                                                                } catch (error) {
                                                                    console.error('Error updating like:', error);
                                                                    toast.error('Failed to update like. Please try again.');
                                                                    // Optionally revert the optimistic update here
                                                                }
                                                            }}
                                                        >
                                                            <FaHeart />
                                                            <span className="text-sm">
                                                                {post.analytics?.likes ?? postLikes.filter(like => like.postId === post.id).length}
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                                                            onClick={async () => {
                                                                if (openCommentPostId !== post.id) {
                                                                    // Immediately show comment section
                                                                    setOpenCommentPostId(post.id);
                                                                    // Load comments in background if not already loaded
                                                                    if (!comments.some(c => c.postId === post.id)) {
                                                                        getComments(post.id);
                                                                    }
                                                                } else {
                                                                    setOpenCommentPostId(null);
                                                                }
                                                            }}
                                                        >
                                                            <FaComment />
                                                            <span className="text-sm">
                                                                {post.analytics?.comments ?? comments.filter(c => c.postId === post.id).length}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Comments Section - LinkedIn Style */}
                                            {openCommentPostId === post.id && (
                                                <div className="border-t bg-gray-50/50">
                                                    <div className="p-4 space-y-4">
                                                        {/* Comment Input - Always Visible */}
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                                <AvatarImage src={getAvatarUrl(profile?.avatar)} alt={profile?.name || user?.name || 'User'} />
                                                                <AvatarFallback>{(profile?.name || user?.name || 'U').charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <Textarea
                                                                    placeholder="Write a comment..."
                                                                    className="min-h-[60px] resize-none border-gray-200 focus:border-green-500"
                                                                    id={`comment-${post.id}`}
                                                                />
                                                                <div className="flex justify-end mt-2">
                                                                    <Button
                                                                        onClick={async () => {
                                                                            const textArea = document.getElementById(`comment-${post.id}`) as HTMLTextAreaElement;
                                                                            if (textArea && textArea.value.trim()) {
                                                                                const commentContent = textArea.value.trim();
                                                                                const currentUser = {
                                                                                    id: user?.id || '',
                                                                                    name: profile?.name || user?.name || 'User',
                                                                                    avatar: profile?.avatar || user?.avatar || null
                                                                                };
                                                                                
                                                                                // Optimistic updates - get temp ID and immediate UI feedback
                                                                                const tempId = addCommentOptimisticallyToStore(post.id, commentContent, currentUser);
                                                                                addCommentOptimistically(post.id);
                                                                                
                                                                                // Clear input immediately
                                                                                textArea.value = '';
                                                                                
                                                                                // Perform API call in background
                                                                                try {
                                                                                    const realComment = await createComment(post.id, commentContent);
                                                                                    // Update the optimistic comment with real data
                                                                                    updateOptimisticCommentWithReal(tempId, realComment);
                                                                                } catch (error) {
                                                                                    console.error('Error creating comment:', error);
                                                                                    toast.error('Failed to post comment. Please try again.');
                                                                                    // Remove the optimistic comment on error
                                                                                    deleteCommentOptimistically(tempId);
                                                                                    removeCommentOptimistically(post.id);
                                                                                }
                                                                            }
                                                                        }}
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                                    >
                                                                        Comment
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Comments List with Skeleton Loading */}
                                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                                            {commentLoading ? (
                                                                // Skeleton Loading for Comments
                                                                <div className="space-y-3">
                                                                    {[1, 2, 3].map((i) => (
                                                                        <div key={i} className="flex items-start gap-3 animate-pulse">
                                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="bg-white p-3 rounded-lg border">
                                                                                    <div className="flex items-center gap-2 mb-2">
                                                                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                                                    </div>
                                                                                    <div className="space-y-2">
                                                                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : comments.filter(c => c.postId === post.id).length === 0 ? (
                                                                <div className="text-center py-4">
                                                                    <FaComment className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                                                                    <p className="text-sm text-muted-foreground">No comments yet. Be the first to leave one!</p>
                                                                </div>
                                                            ) : (
                                                                comments.filter(c => c.postId === post.id).map(comment => (
                                                                    <div key={comment.id} className="space-y-2">
                                                                        <div className="flex items-start gap-3">
                                                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                                                <AvatarImage src={comment.author?.avatar || ''} alt={comment.author?.name || 'User'} />
                                                                                <AvatarFallback>{comment.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="bg-white p-3 rounded-lg border">
                                                                                    <div className="flex items-center justify-between mb-1">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-sm font-medium text-foreground">{comment.author?.name || 'User'}</span>
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                                                            </span>
                                                                                        </div>
                                                                                        {/* Comment Actions - Only for own comments and not temp comments */}
                                                                                        {user && comment.author?.id === user.id && !comment.id.startsWith('temp-') && (
                                                                                            <DropdownMenu>
                                                                                                <DropdownMenuTrigger asChild>
                                                                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                                                        <FaEllipsisH className="h-3 w-3" />
                                                                                                    </Button>
                                                                                                </DropdownMenuTrigger>
                                                                                                <DropdownMenuContent align="end">
                                                                                                    <DropdownMenuItem
                                                                                                        onClick={() => {
                                                                                                            setEditingCommentId(comment.id);
                                                                                                            setEditCommentContent(comment.content);
                                                                                                        }}
                                                                                                    >
                                                                                                        <FaEdit className="mr-2 h-3 w-3" />
                                                                                                        Edit
                                                                                                    </DropdownMenuItem>
                                                                                                    <DropdownMenuItem
                                                                                                        onClick={async () => {
                                                                                                            // Optimistic delete
                                                                                                            deleteCommentOptimistically(comment.id);
                                                                                                            removeCommentOptimistically(post.id);
                                                                                                            
                                                                                                            // Background API call
                                                                                                            try {
                                                                                                                await deleteComment(comment.id);
                                                                                                            } catch (error) {
                                                                                                                console.error('Error deleting comment:', error);
                                                                                                                toast.error('Failed to delete comment. Please try again.');
                                                                                                            }
                                                                                                        }}
                                                                                                        className="text-red-600 focus:text-red-600"
                                                                                                    >
                                                                                                        <FaTrash className="mr-2 h-3 w-3" />
                                                                                                        Delete
                                                                                                    </DropdownMenuItem>
                                                                                                </DropdownMenuContent>
                                                                                            </DropdownMenu>
                                                                                        )}
                                                                                    </div>
                                                                                    
                                                                                    {/* Comment Content - Edit or Display */}
                                                                                    {editingCommentId === comment.id ? (
                                                                                        <div className="space-y-2">
                                                                                            <Textarea
                                                                                                value={editCommentContent}
                                                                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                                                                                className="min-h-[60px] resize-none"
                                                                                                placeholder="Edit your comment..."
                                                                                            />
                                                                                            <div className="flex gap-2">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    onClick={async () => {
                                                                                                        if (editCommentContent.trim()) {
                                                                                                            // Optimistic update
                                                                                                            updateCommentOptimistically(comment.id, editCommentContent.trim());
                                                                                                            
                                                                                                            // Background API call
                                                                                                            try {
                                                                                                                await updateComment(comment.id, editCommentContent.trim());
                                                                                                                setEditingCommentId(null);
                                                                                                                setEditCommentContent("");
                                                                                                            } catch (error) {
                                                                                                                console.error('Error updating comment:', error);
                                                                                                                toast.error('Failed to update comment. Please try again.');
                                                                                                            }
                                                                                                        }
                                                                                                    }}
                                                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                                                >
                                                                                                    Save
                                                                                                </Button>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => {
                                                                                                        setEditingCommentId(null);
                                                                                                        setEditCommentContent("");
                                                                                                    }}
                                                                                                >
                                                                                                    Cancel
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p className="text-sm text-foreground">{comment.content}</p>
                                                                                    )}
                                                                                    
                                                                                    {/* Reply Button */}
                                                                                    <div className="mt-2">
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (replyingToCommentId === comment.id) {
                                                                                                    setReplyingToCommentId(null);
                                                                                                    setReplyContent("");
                                                                                                } else {
                                                                                                    setReplyingToCommentId(comment.id);
                                                                                                    setReplyContent("");
                                                                                                }
                                                                                            }}
                                                                                            className="text-xs text-muted-foreground hover:text-blue-500"
                                                                                        >
                                                                                            Reply
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Reply Input */}
                                                                        {replyingToCommentId === comment.id && (
                                                                            <div className="ml-11 flex items-start gap-3">
                                                                                <Avatar className="w-6 h-6 flex-shrink-0">
                                                                                    <AvatarImage src={getAvatarUrl(profile?.avatar)} alt={profile?.name || user?.name || 'User'} />
                                                                                    <AvatarFallback>{(profile?.name || user?.name || 'U').charAt(0)}</AvatarFallback>
                                                                                </Avatar>
                                                                                <div className="flex-1">
                                                                                    <Textarea
                                                                                        value={replyContent}
                                                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                                                        placeholder="Write a reply..."
                                                                                        className="min-h-[50px] resize-none border-gray-200 focus:border-green-500"
                                                                                    />
                                                                                    <div className="flex gap-2 mt-2">
                                                                                        <Button
                                                                                            size="sm"
                                                                                                                                                                                            onClick={async () => {
                                                                                                    if (replyContent.trim()) {
                                                                                                        const currentUser = {
                                                                                                            id: user?.id || '',
                                                                                                            name: profile?.name || user?.name || 'User',
                                                                                                            avatar: profile?.avatar || user?.avatar || null
                                                                                                        };
                                                                                                        
                                                                                                        const replyContentToSend = replyContent.trim();
                                                                                                        
                                                                                                        // Optimistic update - get the temp ID
                                                                                                        const tempId = addReplyOptimistically(comment.id, replyContentToSend, currentUser);
                                                                                                        
                                                                                                        // Clear input immediately
                                                                                                        setReplyContent("");
                                                                                                        setReplyingToCommentId(null);
                                                                                                        
                                                                                                        // Background API call
                                                                                                        try {
                                                                                                            const realReply = await createReply(comment.id, replyContentToSend);
                                                                                                            // Update the optimistic reply with real data
                                                                                                            updateOptimisticReplyWithReal(tempId, realReply);
                                                                                                        } catch (error) {
                                                                                                            console.error('Error creating reply:', error);
                                                                                                            toast.error('Failed to post reply. Please try again.');
                                                                                                            // Optionally remove the optimistic reply on error
                                                                                                            deleteReplyOptimistically(tempId);
                                                                                                        }
                                                                                                    }
                                                                                                }}
                                                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                                                        >
                                                                                            Reply
                                                                                        </Button>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            onClick={() => {
                                                                                                setReplyingToCommentId(null);
                                                                                                setReplyContent("");
                                                                                            }}
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Replies Display */}
                                                                        {comment.replies && comment.replies.length > 0 && (
                                                                            <div className="ml-11 space-y-2">
                                                                                {comment.replies.map(reply => (
                                                                                    <div key={reply.id} className="flex items-start gap-3">
                                                                                        <Avatar className="w-6 h-6 flex-shrink-0">
                                                                                            <AvatarImage src={reply.author?.avatar || ''} alt={reply.author?.name || 'User'} />
                                                                                            <AvatarFallback>{reply.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                                                                                        </Avatar>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="bg-gray-50 p-2 rounded-lg border">
                                                                                                <div className="flex items-center justify-between mb-1">
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span className="text-xs font-medium text-foreground">{reply.author?.name || 'User'}</span>
                                                                                                        <span className="text-xs text-muted-foreground">
                                                                                                            {new Date(reply.createdAt).toLocaleDateString()}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                                                                                                                            {/* Reply Actions - Only for own replies and not temp replies */}
                                                                                                        {user && reply.author?.id === user.id && !reply.id.startsWith('temp-') && (
                                                                                                        <DropdownMenu>
                                                                                                            <DropdownMenuTrigger asChild>
                                                                                                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                                                                                                    <FaEllipsisH className="h-2 w-2" />
                                                                                                                </Button>
                                                                                                            </DropdownMenuTrigger>
                                                                                                            <DropdownMenuContent align="end">
                                                                                                                <DropdownMenuItem
                                                                                                                    onClick={() => {
                                                                                                                        setEditingReplyId(reply.id);
                                                                                                                        setEditReplyContent(reply.content);
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <FaEdit className="mr-2 h-3 w-3" />
                                                                                                                    Edit
                                                                                                                </DropdownMenuItem>
                                                                                                                <DropdownMenuItem
                                                                                                                    onClick={async () => {
                                                                                                                        // Optimistic delete
                                                                                                                        deleteReplyOptimistically(reply.id);
                                                                                                                        
                                                                                                                        // Background API call
                                                                                                                        try {
                                                                                                                            await deleteReply(reply.id);
                                                                                                                        } catch (error) {
                                                                                                                            console.error('Error deleting reply:', error);
                                                                                                                            toast.error('Failed to delete reply. Please try again.');
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    className="text-red-600 focus:text-red-600"
                                                                                                                >
                                                                                                                    <FaTrash className="mr-2 h-3 w-3" />
                                                                                                                    Delete
                                                                                                                </DropdownMenuItem>
                                                                                                            </DropdownMenuContent>
                                                                                                        </DropdownMenu>
                                                                                                    )}
                                                                                                </div>
                                                                                                
                                                                                                {/* Reply Content - Edit or Display */}
                                                                                                {editingReplyId === reply.id ? (
                                                                                                    <div className="space-y-2">
                                                                                                        <Textarea
                                                                                                            value={editReplyContent}
                                                                                                            onChange={(e) => setEditReplyContent(e.target.value)}
                                                                                                            className="min-h-[50px] resize-none text-xs"
                                                                                                            placeholder="Edit your reply..."
                                                                                                        />
                                                                                                        <div className="flex gap-2">
                                                                                                            <Button
                                                                                                                size="sm"
                                                                                                                                                                                                                            onClick={async () => {
                                                                                                                if (editReplyContent.trim()) {
                                                                                                                    // Optimistic update
                                                                                                                    updateReplyOptimistically(reply.id, editReplyContent.trim());
                                                                                                                    
                                                                                                                    // Background API call
                                                                                                                    try {
                                                                                                                        await updateReply(reply.id, editReplyContent.trim());
                                                                                                                        setEditingReplyId(null);
                                                                                                                        setEditReplyContent("");
                                                                                                                    } catch (error) {
                                                                                                                        console.error('Error updating reply:', error);
                                                                                                                        toast.error('Failed to update reply. Please try again.');
                                                                                                                    }
                                                                                                                }
                                                                                                            }}
                                                                                                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                                                                            >
                                                                                                                Save
                                                                                                            </Button>
                                                                                                            <Button
                                                                                                                size="sm"
                                                                                                                variant="outline"
                                                                                                                onClick={() => {
                                                                                                                    setEditingReplyId(null);
                                                                                                                    setEditReplyContent("");
                                                                                                                }}
                                                                                                                className="text-xs"
                                                                                                            >
                                                                                                                Cancel
                                                                                                            </Button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <p className="text-xs text-foreground">{reply.content}</p>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Show More Button */}
                                {postsToShow < posts.length && (
                                    <div className="text-center pt-4">
                                        <Button
                                            onClick={handleShowMorePosts}
                                            variant="outline"
                                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                        >
                                            Show More Posts
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <div className="mb-4">
                                        <FaUser className="text-muted-foreground w-12 h-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        No Posts in Your Feed
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Follow some experts to see their posts in your feed, or explore the community to discover great content.
                                    </p>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/connections')}>
                                        <FaUser className="mr-2" />
                                        Find Experts to Follow
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                        </div>
                    </div>

                    {/* Right Column - Trending Experts */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            <Card>
                                <CardContent className="p-3">
                                    <h3 className="font-semibold text-foreground mb-2">Trending Experts</h3>
                                    {expertsLoading ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto mb-1"></div>
                                            <span className="text-sm text-muted-foreground">Loading experts...</span>
                                        </div>
                                    ) : expertsError ? (
                                        <div className="text-center text-red-500 py-4 text-sm">{expertsError}</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {experts.slice(0, expertsToShow).map((expert) => {
                                                const userData = expert.user;
                                                const expertName = userData?.name || 'Expert';
                                                const expertAvatar = userData?.avatar || "https://randomuser.me/api/portraits/men/1.jpg";
                                                
                                                return (
                                                    <div 
                                                        key={expert.userId} 
                                                        className="flex items-center gap-2 p-1.5 rounded hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200 cursor-pointer"
                                                        onClick={() => router.push(`/connections/${expert.userId}`)}
                                                    >
                                                        <img
                                                            src={expertAvatar}
                                                            alt={expertName}
                                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-foreground text-sm">
                                                                {expertName}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {expert.ratings || 0} ★
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {experts.length === 0 && !expertsLoading && (
                                                <div className="text-center py-3">
                                                    <FaUser className="text-muted-foreground w-6 h-6 mx-auto mb-1" />
                                                    <p className="text-sm text-muted-foreground">No experts available</p>
                                                </div>
                                            )}
                                            
                                            {/* View All Link */}
                                            {experts.length > 0 && (
                                                <div className="text-center pt-2 border-t">
                                                    <Button
                                                        onClick={() => router.push('/connections')}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full h-7"
                                                    >
                                                        View All
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Badges & Progress Level Card */}
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-foreground mb-3">Your Progress</h3>
                                    
                                    {/* Badges Section */}
                                    {profile?.badges && profile.badges.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-foreground mb-2">Badges</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.badges.map((badge, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                                        {badge.replace(/_/g, ' ')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress Level Section */}
                                    {profile?.progressLevel && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-foreground mb-2">Progress Level</h4>
                                            <div className="flex items-center gap-2">
                                                {getProgressLevelIcon(profile.progressLevel)}
                                                <div>
                                                    <p className="text-sm font-medium text-foreground capitalize">
                                                        {profile.progressLevel.toLowerCase()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Keep engaging to level up!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience Section */}
                                    {profile?.experience && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-foreground mb-2">Experience</h4>
                                            <div className="flex items-center gap-2">
                                                <FaBriefcase className="text-green-600 w-4 h-4" />
                                                <span className="text-sm text-foreground">
                                                    {profile.experience} years
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hourly Rate Section */}
                                    {profile?.hourlyRate && (
                                        <div>
                                            <h4 className="text-sm font-medium text-foreground mb-2">Hourly Rate</h4>
                                            <div className="flex items-center gap-2">
                                                <FaDollarSign className="text-green-600 w-4 h-4" />
                                                <span className="text-sm font-medium text-foreground">
                                                    ${profile.hourlyRate}/hr
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Default message if no expert details */}
                                    {(!profile?.badges || profile.badges.length === 0) && 
                                     !profile?.progressLevel && 
                                     !profile?.experience && 
                                     !profile?.hourlyRate && (
                                        <div className="text-center py-4">
                                            <FaMedal className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Complete your profile to see your progress
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FaTrash className="text-red-600" />
                            Delete Post
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={cancelDeletePost}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeletePost}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Report Post Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Enter reason for reporting this post"
                            value={reportReason}
                            onChange={e => setReportReason(e.target.value)}
                            disabled={reportLoading}
                        />
                        {reportError && <div className="text-red-500 text-sm">{reportError}</div>}
                        {reportSuccess && <div className="text-green-600 text-sm">{reportSuccess}</div>}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSubmitReport}
                            disabled={reportLoading || !reportReason.trim()}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {reportLoading ? "Reporting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
} 