"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle, FaHeart, FaComment, FaShare, FaBookmark, FaUser, FaBriefcase, FaCertificate, FaMedal, FaEdit, FaImage, FaTimes, FaTrash, FaEllipsisH, FaFlag } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

const INTEREST_LABELS: Record<string, string> = {
    TECHNOLOGY: "Technology",
    BUSINESS: "Business",
    HEALTHCARE: "Healthcare",
    EDUCATION: "Education",
    ARTS: "Arts",
    SCIENCE: "Science",
    ENGINEERING: "Engineering",
    LAW: "Law",
    FINANCE: "Finance",
    MARKETING: "Marketing",
    DESIGN: "Design",
    MEDIA: "Media",
    SPORTS: "Sports",
    CULINARY: "Culinary",
    LANGUAGES: "Languages",
    PSYCHOLOGY: "Psychology",
    ENVIRONMENT: "Environment",
    AGRICULTURE: "Agriculture",
    CONSTRUCTION: "Construction",
    HOSPITALITY: "Hospitality",
    RETAIL: "Retail",
    TRANSPORTATION: "Transportation",
    ENTERTAINMENT: "Entertainment",
    NON_PROFIT: "Non Profit",
    GOVERNMENT: "Government",
    OTHER: "Other",
};

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { profile, isLoading, error, fetchUserProfile } = useUserStore();
    const {
        posts,
        listPosts,
        getFollowingPosts,
        createPost,
        updatePost,
        deletePost,
        getUploadUrl,
        isLoading: postsLoading,
        error: postsError
    } = usePostsStore();
    const { reportPost, isLoading: reportLoading, success: reportSuccess, error: reportError, clearError, clearSuccess } = useReportStore();
    // FIX: Add all required variables from zustand stores
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
        isLoading: commentLoading,
        getReplies,
        replies,
        createReply,
        isLoading: replyLoading
    } = useCommentStore();
    // FIX: Add missing state and refs for modals and timeouts
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);
    const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
    const desktopHoverTimeout = useRef<NodeJS.Timeout | null>(null);
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportPostId, setReportPostId] = useState<string | null>(null);
    const [postsToShow, setPostsToShow] = useState(3);

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

    // Add state for comment/reply inputs and showReplies
    const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
    const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
    const [showReplies, setShowReplies] = useState<{ [commentId: string]: boolean }>({});

    const isExpert = user?.role?.toUpperCase() === "EXPERT";
    const isUser = user?.role?.toUpperCase() === "USER";

    // Experts state
    const { experts, isLoading: expertsLoading, error: expertsError, fetchAllExperts, totalExperts, currentPage } = useAllExpertsStore();
    const [expertsToShow, setExpertsToShow] = useState(10);

    useEffect(() => {
        fetchAllExperts(1, expertsToShow);
    }, [expertsToShow, fetchAllExperts]);

    // Fetch user profile on component mount
    useEffect(() => {
        if (user) {
            console.log("Fetching user profile for user:", user);
            fetchUserProfile();
        }
    }, [user, fetchUserProfile]);

    // Fetch posts based on user role
    useEffect(() => {
        if (user) {
            if (isUser) {
                // For regular users, get posts from following users
                getFollowingPosts({ page: 1, limit: 10 });
            } else if (isExpert) {
                // For experts, get their own posts
                listPosts({ userId: user.id, page: 1, limit: 10 });
            }
        }
    }, [user, isUser, isExpert, getFollowingPosts, listPosts]);

    // Debug logging
    useEffect(() => {
        console.log("Profile Page Debug:", {
            user,
            profile,
            isLoading,
            error,
            isExpert,
            isUser
        });
    }, [user, profile, isLoading, error, isExpert, isUser]);

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
        setPostsToShow(prev => Math.min(prev + 2, posts.length));
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

        try {
            setIsDeletingPost(true);
            await deletePost(postToDelete);
            toast.success("Post deleted successfully!");
            setShowDeleteDialog(false);
            setPostToDelete(null);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post. Please try again.");
        } finally {
            setIsDeletingPost(false);
        }
    };

    const cancelDeletePost = () => {
        setShowDeleteDialog(false);
        setPostToDelete(null);
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
            default:
                return <FaMedal className="w-6 h-6 text-gray-500" />;
        }
    };

    const formatLocation = (location: any) => {
        if (!location) return "Location not set";
        if (typeof location === 'string') return location;
        if (typeof location === 'object' && location.city) {
            return `${location.city}${location.state ? `, ${location.state}` : ''}${location.country ? `, ${location.country}` : ''}`;
        }
        return "Location not set";
    };

    const getAvatarUrl = (avatar: any) => {
        if (avatar && typeof avatar === 'string' && avatar.trim() !== '') {
            return avatar;
        }
        // Fallback to a default avatar
        return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
    };

    if (isLoading) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="h-96 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-muted-foreground">{error}</p>
                        <Button
                            onClick={() => fetchUserProfile()}
                            className="mt-4 bg-green-600 hover:bg-green-700"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-muted-foreground mb-4">Profile Not Found</h1>
                        <Button
                            onClick={() => router.push('/login')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Back Button */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ← Back
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Profile Only (Sticky) */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20">
                            {/* Profile Card for USER */}
                            <Card>
                                <CardContent className="p-6 relative">
                                    <div className="text-center">
                                        {/* Avatar */}
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={profile.avatar} alt={profile.name} />
                                            <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        {/* Name and Role */}
                                        <h1 className="text-2xl font-bold text-foreground mb-2">
                                            {profile.name}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Member
                                        </p>
                                        {/* Bio */}
                                        {profile.bio && (
                                            <p className="text-muted-foreground mb-4">{profile.bio}</p>
                                        )}
                                        {/* Location */}
                                        {profile.location && (
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
                                        {profile.email && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                                                <FaUser />
                                                <span>{profile.email}</span>
                                            </div>
                                        )}
                                        {/* Interests */}
                                        {profile.interests && profile.interests.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                {profile.interests.map((interest, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                                                        {interest}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        {/* Stats */}
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile.followersCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile.followingCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Following</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-lg">{profile.postsCount ?? 0}</div>
                                                <div className="text-xs text-muted-foreground">Posts</div>
                                            </div>
                                        </div>
                                        {/* Update Profile Button */}
                                        <div className="space-y-3 mt-6">
                                            <Link href="/profile/update">
                                                <Button className="w-full bg-green-600 hover:bg-green-700">
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

                    {/* Middle Column - Tabbed Content */}
                    <div className="lg:col-span-6">
                        <Tabs defaultValue="posts" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-6">
                                <TabsTrigger value="posts" className="flex items-center gap-2">
                                    <FaUser className="w-4 h-4" />
                                    Posts
                                </TabsTrigger>
                                <TabsTrigger value="about" className="flex items-center gap-2">
                                    <FaUser className="w-4 h-4" />
                                    About
                                </TabsTrigger>
                                {isUser && (
                                    <TabsTrigger value="following" className="flex items-center gap-2">
                                        <FaUser className="w-4 h-4" />
                                        Following
                                    </TabsTrigger>
                                )}
                                {isExpert && (
                                    <>
                                        <TabsTrigger value="experiences" className="flex items-center gap-2">
                                            <FaBriefcase className="w-4 h-4" />
                                            Experiences
                                        </TabsTrigger>
                                        <TabsTrigger value="certificates" className="flex items-center gap-2">
                                            <FaCertificate className="w-4 h-4" />
                                            Certificates
                                        </TabsTrigger>
                                    </>
                                )}
                            </TabsList>

                            {/* Posts Tab - For both Users and Experts */}
                            <TabsContent value="posts" className="space-y-6">
                                {/* Create Post Section - For both Users and Experts */}
                                {(isExpert || isUser) && (
                                    <Card>
                                        <CardContent className="p-6">
                                            {!showCreatePost ? (
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={getAvatarUrl(profile.avatar)} alt={profile.name || user?.name || 'User'} />
                                                        <AvatarFallback>{(profile.name || user?.name || 'U').charAt(0)}</AvatarFallback>
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
                                                        Create Post
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
                                                            placeholder={isExpert ? "Share your expertise, insights, or experiences..." : "Share your thoughts, experiences, or questions..."}
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
                                )}
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
                                            <Card key={post.id} className="overflow-hidden">
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
                                                                            disabled={isDeletingPost}
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
                                                                    placeholder={isExpert ? "Share your expertise, insights, or experiences..." : "Share your thoughts, experiences, or questions..."}
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
                                                            {/* Render post.content as HTML */}
                                                            <div className="text-foreground mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
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
                                                                    className={`flex items-center gap-2 transition-colors ${postLikes.some(like => like.postId === post.id && like.userId === user?.id)
                                                                        ? "text-red-500"
                                                                        : "text-muted-foreground hover:text-red-500"
                                                                        }`}
                                                                    disabled={likeLoading}
                                                                    onMouseEnter={async () => {
                                                                        if (window.innerWidth > 768) {
                                                                            desktopHoverTimeout.current = setTimeout(async () => {
                                                                                if (!postLikes.some(like => like.postId === post.id)) {
                                                                                    await getPostLikes(post.id);
                                                                                }
                                                                                setLikesModalPostId(post.id);
                                                                                setShowLikesModal(true);
                                                                            }, 2000);
                                                                        }
                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        if (window.innerWidth > 768 && desktopHoverTimeout.current) {
                                                                            clearTimeout(desktopHoverTimeout.current);
                                                                            desktopHoverTimeout.current = null;
                                                                            setShowLikesModal(false);
                                                                            setLikesModalPostId(null);
                                                                        }
                                                                    }}
                                                                    onTouchStart={e => {
                                                                        if (window.innerWidth <= 768) {
                                                                            longPressTimeout.current = setTimeout(async () => {
                                                                                if (!postLikes.some(like => like.postId === post.id)) {
                                                                                    await getPostLikes(post.id);
                                                                                }
                                                                                setLikesModalPostId(post.id);
                                                                                setShowLikesModal(true);
                                                                            }, 500);
                                                                        }
                                                                    }}
                                                                    onTouchEnd={e => {
                                                                        if (window.innerWidth <= 768 && longPressTimeout.current) {
                                                                            clearTimeout(longPressTimeout.current);
                                                                        }
                                                                    }}
                                                                    onClick={async () => {
                                                                        if (!user) {
                                                                            // Show login prompt if needed
                                                                            return;
                                                                        }
                                                                        if (postLikes.some(like => like.postId === post.id && like.userId === user.id)) {
                                                                            await unlikePost(post.id);
                                                                        } else {
                                                                            await likePost(post.id);
                                                                        }
                                                                        await getPostLikes(post.id); // Always refresh likes after action
                                                                    }}
                                                                >
                                                                    <FaHeart />
                                                                    <span className="text-sm">
                                                                        {/* Show count from analytics, fallback to postLikes */}
                                                                        {post.analytics?.likes ?? postLikes.filter(like => like.postId === post.id).length}
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                                                                    onClick={async () => {
                                                                        if (openCommentPostId !== post.id) {
                                                                            if (!comments.some(c => c.postId === post.id)) {
                                                                                await getComments(post.id);
                                                                            }
                                                                            setOpenCommentPostId(post.id);
                                                                        } else {
                                                                            setOpenCommentPostId(null);
                                                                        }
                                                                    }}
                                                                >
                                                                    <FaComment />
                                                                    <span className="text-sm">
                                                                        {/* Show count from analytics, fallback to comments */}
                                                                        {post.analytics?.comments ?? comments.filter(c => c.postId === post.id).length}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                {isExpert ? "No Posts Yet" : "No Posts in Your Feed"}
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                {isExpert
                                                    ? "Share your expertise and insights with the community by creating your first post."
                                                    : "Follow some experts to see their posts in your feed, or explore the community to discover great content."
                                                }
                                            </p>
                                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/connections')}>
                                                {isExpert ? (
                                                    <>
                                                        <FaEdit className="mr-2" />
                                                        Create Your First Post
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUser className="mr-2" />
                                                        Find Experts to Follow
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* About Tab */}
                            <TabsContent value="about">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Bio Section */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-foreground">Bio</h3>
                                                {!profile.bio && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                        Add Bio
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {profile.bio || "Tell others about yourself. Add a bio to help people get to know you better."}
                                            </p>
                                        </div>

                                        {/* Interests Section */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-foreground">Interests</h3>
                                                {(!profile.interests || profile.interests.length === 0) && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                        Add Interests
                                                    </Button>
                                                )}
                                            </div>
                                            {profile.interests && profile.interests.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.interests.map((interest, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                                            {INTEREST_LABELS[interest] || interest}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground">Add your interests to help us recommend relevant content and experts.</p>
                                            )}
                                        </div>

                                        {/* Location Section */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-foreground">Location</h3>
                                                {!profile.location && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                        Add Location
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {formatLocation(profile.location) || "Add your location to connect with people nearby."}
                                            </p>
                                        </div>

                                        {/* Member Since */}
                                        {profile.createdAt && (
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-3">Member Since</h3>
                                                <p className="text-muted-foreground">
                                                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        )}

                                        {/* Profile Completion Notice */}
                                        {isUser && (
                                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <FaUser className="text-blue-600 w-5 h-5 mt-0.5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-blue-900 mb-1">Complete Your Profile</h4>
                                                        <p className="text-blue-700 text-sm mb-3">
                                                            Adding more information to your profile helps you connect better with the community and discover relevant content.
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                                <FaEdit className="w-3 h-3 mr-1" />
                                                                Update Profile
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                                                Learn More
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Following Tab - Only for Users */}
                            {isUser && (
                                <TabsContent value="following">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Experts You Follow</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Following list not available on UserProfile. If needed, fetch separately or add to type. */}
                                            <p className="text-sm text-muted-foreground">Not following anyone yet.</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {/* Experiences Tab - Only for Experts */}
                            {isExpert && (
                                <TabsContent value="experiences">
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <p className="text-muted-foreground">No experience information available.</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {/* Certificates Tab - Only for Experts */}
                            {isExpert && (
                                <TabsContent value="certificates">
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <FaCertificate className="text-muted-foreground w-12 h-12 mx-auto mb-4" />
                                            <p className="text-muted-foreground">No certificates available.</p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>

                    {/* Right Column - Experts Section */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Top Experts</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {expertsLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                                            <span className="text-sm text-muted-foreground">Loading experts...</span>
                                        </div>
                                    ) : expertsError ? (
                                        <div className="text-center text-red-500 py-8">{expertsError}</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {experts.slice(0, expertsToShow).map((expert) => {
                                                // Extract user data from the nested structure
                                                const userData = expert.user;
                                                const expertName = userData?.name || 'Expert';
                                                const expertAvatar = userData?.avatar || "https://randomuser.me/api/portraits/men/1.jpg";
                                                const expertLocation = userData?.location;
                                                
                                                // Format location properly
                                                const formatExpertLocation = (location: any) => {
                                                    if (!location) return 'Remote';
                                                    if (typeof location === 'string') return location;
                                                    if (typeof location === 'object') {
                                                        const parts = [location.city, location.country].filter(Boolean);
                                                        return parts.length > 0 ? parts.join(', ') : 'Remote';
                                                    }
                                                    return 'Remote';
                                                };

                                                return (
                                                    <div 
                                                        key={expert.userId} 
                                                        className="flex items-center gap-3 p-2 rounded hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200 cursor-pointer"
                                                        onClick={() => router.push(`/connections/${expert.userId}`)}
                                                    >
                                                        {/* Expert Image */}
                                                        <img
                                                            src={expertAvatar}
                                                            alt={expertName}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                        />

                                                        {/* Expert Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="font-semibold text-foreground text-sm">
                                                                        {expertName}
                                                                        {expert.verified && (
                                                                            <FaCheckCircle className="inline ml-1 text-green-500 w-3 h-3" />
                                                                        )}
                                                                    </h4>
                                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                                                        <span>{formatExpertLocation(expertLocation)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Rating */}
                                                                <div className="flex items-center gap-1 text-yellow-500">
                                                                    <FaStar className="w-3 h-3" />
                                                                    <span className="font-medium text-xs">{expert.ratings || 0}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {expertsToShow < totalExperts && (
                                                <div className="text-center pt-3">
                                                    <Button
                                                        onClick={() => setExpertsToShow((prev) => prev + 10)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                                    >
                                                        Show More
                                                    </Button>
                                                </div>
                                            )}
                                            {/* View All button after 10 */}
                                            {experts.length > 10 && expertsToShow >= 10 && (
                                                <div className="text-center pt-2">
                                                    <Button
                                                        onClick={() => router.push('/connections')}
                                                        variant="ghost"
                                                        className="text-green-700 hover:bg-green-50"
                                                    >
                                                        View All
                                                    </Button>
                                                </div>
                                            )}
                                            {experts.length === 0 && !expertsLoading && (
                                                <div className="text-center py-6">
                                                    <FaUser className="text-muted-foreground w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-sm text-muted-foreground">No experts available</p>
                                                </div>
                                            )}
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
                            disabled={isDeletingPost}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeletePost}
                            disabled={isDeletingPost}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeletingPost ? "Deleting..." : "Delete Post"}
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

            {/* Likes Modal */}
            {showLikesModal && likesModalPostId && (
                <Dialog open={showLikesModal} onOpenChange={setShowLikesModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Liked by</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {postLikes.filter(like => like.postId === likesModalPostId).length === 0 ? (
                                <div className="text-muted-foreground">No likes yet.</div>
                            ) : (
                                postLikes.filter(like => like.postId === likesModalPostId).map(like => (
                                    <div key={like.id} className="flex items-center gap-2">
                                        <Avatar className="w-7 h-7">
                                            <AvatarImage src={like.user?.avatar || ''} alt={like.user?.name || "User"} />
                                            <AvatarFallback>{like.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground">{like.user?.name || "User"}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setShowLikesModal(false)} className="w-full">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Comments Section */}
            <Dialog open={!!openCommentPostId} onOpenChange={open => setOpenCommentPostId(open ? openCommentPostId : null)}>
                {openCommentPostId && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Comments</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {commentLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin">⚙️</div>
                                    <p className="text-muted-foreground">Loading comments...</p>
                                </div>
                            ) : comments.filter(c => c.postId === openCommentPostId).length === 0 ? (
                                <div className="text-center py-8">
                                    <FaComment className="text-muted-foreground w-12 h-12 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No comments yet. Be the first to leave one!</p>
                                </div>
                            ) : (
                                comments.filter(c => c.postId === openCommentPostId).map(comment => (
                                    <div key={comment.id} className="flex items-start gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.author?.avatar || ''} alt={comment.author?.name || 'User'} />
                                            <AvatarFallback>{comment.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 bg-muted/20 p-2 rounded-lg">
                                            <p className="text-sm text-foreground">{comment.content}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4">
                            <Textarea
                                placeholder="Add a comment..."
                                className="min-h-[80px] resize-none"
                            />
                            <Button
                                onClick={async () => {
                                    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
                                    if (textArea && textArea.value.trim()) {
                                        await createComment(openCommentPostId, textArea.value.trim());
                                        textArea.value = '';
                                    }
                                }}
                                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Post Comment
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setOpenCommentPostId(null)} className="w-full">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
