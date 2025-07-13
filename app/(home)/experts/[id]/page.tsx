"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle, FaHeart, FaComment, FaShare, FaBookmark, FaUser, FaBriefcase, FaCertificate, FaMedal } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useFollowStore } from "@/lib/mainwebsite/follow-store";
import { toast } from "sonner";
import { usePostsStore } from "@/lib/mainwebsite/posts-store";
import { useLikeStore } from "@/lib/mainwebsite/like-store";
import { useCommentStore } from "@/lib/mainwebsite/comment-store";

interface Experience {
    id: string;
    expertId: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

interface Certification {
    id: string;
    expertId: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface Expert {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    image?: string;
    bio: string;
    role: string;
    interests: string[];
    tags: string[];
    location: string;
    createdAt: string;
    userId: string;
    headline: string;
    summary: string;
    expertise: string[];
    experience: number;
    hourlyRate: number;
    about: string;
    availability: string;
    languages: string[];
    verified: boolean;
    badges: string[];
    progressLevel: string;
    progressShow: boolean;
    ratings: number;
    updatedAt: string;
    certifications: (string | Certification)[];
    experiences: Experience[];
    awards: string[];
    education: string[];
    followersCount: number;
    followingCount: number;
}

export default function ExpertProfile() {
    const params = useParams();
    const router = useRouter();
    const expertId = params.id as string;

    const { getExpertById, isLoading, error } = useAllExpertsStore();
    const { createChat, chats, fetchChats, sendMessage } = useChatStore();
    const { user } = useAuthStore();
    const {
        followExpert,
        unfollowExpert,
        checkFollowStatus,
        followStatuses,
        isLoading: followLoading,
        error: followError
    } = useFollowStore();
    const { posts, listPosts, isLoading: postsLoading, error: postsError } = usePostsStore();
    const {
        likePost,
        unlikePost,
        postLikes,
        isLoading: likeLoading,
        error: likeError,
        getPostLikes,
    } = useLikeStore();
    const {
        comments,
        replies,
        isLoading: commentLoading,
        error: commentError,
        success: commentSuccess,
        getComments,
        createComment,
        getReplies,
        createReply,
        clearError: clearCommentError,
        clearSuccess: clearCommentSuccess,
    } = useCommentStore();

    const [expert, setExpert] = useState<Expert | null>(null);
    const [messageLoading, setMessageLoading] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [postsToShow, setPostsToShow] = useState(3);
    const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
    const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
    const [showReplies, setShowReplies] = useState<{ [commentId: string]: boolean }>({});
    const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpert = async () => {
            if (expertId) {
                const expertData = await getExpertById(expertId);
                console.log('Expert data received:', expertData);
                if (expertData) {
                    console.log('Setting expert with avatar:', expertData.image);
                    setExpert(expertData as any);

                    // Check follow status if user is logged in
                    if (user) {
                        await checkFollowStatus((expertData as any).userId);
                    }
                }
            }
        };

        fetchExpert();
    }, [expertId, getExpertById, user, checkFollowStatus]);

    // Fetch chats when user is authenticated (only when user changes)
    useEffect(() => {
        if (user) {
            fetchChats();
        }
        // Only depend on user, not fetchChats or chats
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Fetch posts for this expert when expert.userId is available
    useEffect(() => {
        if (expert?.userId) {
            listPosts({ userId: expert.userId });
        }
    }, [expert?.userId, listPosts]);

    // Track liked state for each post
    const isPostLikedByUser = (postId: string) => {
        return postLikes.some(like => like.postId === postId && like.userId === user?.id);
    };

    // Fetch likes and comments for posts when posts change
    useEffect(() => {
        if (posts && posts.length > 0) {
            posts.forEach(post => {
                getPostLikes(post.id);
                getComments(post.id);
            });
        }
    }, [posts, getPostLikes, getComments]);

    // Show error toast for like/unlike and comment
    useEffect(() => {
        if (likeError) {
            toast.error(likeError);
        }
    }, [likeError]);
    useEffect(() => {
        if (commentError) {
            toast.error(commentError);
            clearCommentError();
        }
    }, [commentError, clearCommentError]);
    useEffect(() => {
        if (commentSuccess) {
            toast.success(commentSuccess);
            clearCommentSuccess();
        }
    }, [commentSuccess, clearCommentSuccess]);

    const handleMessage = async () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        if (!expert) return;

        try {
            setMessageLoading(true);

            // Try to find an existing chat with this expert
            let chat = chats.find(
                (c: any) =>
                    c.participants.includes(expert.userId) &&
                    Object.values(c.participantDetails).some((p: any) => p.role === "EXPERT")
            );

            let chatId: string;

            if (!chat) {
                // Create a new chat if not found
                chatId = await createChat([expert.userId]);
                if (!chatId) {
                    throw new Error("Failed to create chat");
                }
                // Wait a moment for the chat to be created
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Try to find the chat again
                chat = chats.find(
                    (c: any) =>
                        c.participants.includes(expert.userId) &&
                        Object.values(c.participantDetails).some((p: any) => p.role === "EXPERT")
                );
                if (!chat) {
                    // If still not found, create a minimal chat object with the ID we got
                    chat = { 
                        id: chatId,
                        participants: [user.id, expert.userId],
                        participantDetails: {},
                        unreadCount: {},
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        isActive: true
                    } as any;
                }
            } else {
                chatId = chat.id;
            }

            if (chat && chat.id) {
                // Navigate directly to the chat page without sending a message
                toast.success("Opening chat with " + expert.name);
                router.push(`/chats/${chat.id}`);
            } else {
                toast.error("Failed to create chat");
            }
        } catch (error: any) {
            console.error("Error handling message:", error);
            toast.error(error.message || "Failed to open chat");
        } finally {
            setMessageLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        if (!expert) return;

        try {
            const isCurrentlyFollowing = followStatuses[expert.userId];

            if (isCurrentlyFollowing) {
                await unfollowExpert(expert.userId);
                toast.success("Unfollowed successfully");
            } else {
                await followExpert(expert.userId);
                toast.success("Followed successfully");
            }
        } catch (error) {
            console.error("Error handling follow:", error);
            if (followError) {
                toast.error(followError);
            } else {
                toast.error("Failed to update follow status");
            }
        }
    };

    const handleShowMorePosts = () => {
        setPostsToShow(prev => prev + 3);
    };

    const getProgressLevelIcon = (level: string) => {
        switch (level?.toUpperCase()) {
            case 'BRONZE':
                return <FaMedal className="w-5 h-5 text-amber-600" />;
            case 'SILVER':
                return <FaMedal className="w-5 h-5 text-gray-400" />;
            case 'GOLD':
                return <FaMedal className="w-5 h-5 text-yellow-500" />;
            case 'PLATINUM':
                return <FaMedal className="w-5 h-5 text-slate-300" />;
            default:
                return null;
        }
    };

    const formatLocation = (location: any) => {
        console.log('formatLocation called with:', location);
        if (typeof location === 'string') {
            return location;
        }
        if (location && typeof location === 'object') {
            const parts = [];
            if (location.address) parts.push(location.address);
            if (location.country) parts.push(location.country);
            return parts.length > 0 ? parts.join(', ') : 'Remote';
        }
        return 'Remote';
    };

    const getAvatarUrl = (avatar: any) => {
        console.log('Avatar URL:', avatar);
        if (typeof avatar === 'string' && avatar.trim()) {
            return avatar;
        }
        // Check if expert has image field (fallback)
        if (expert?.image && typeof expert.image === 'string' && expert.image.trim()) {
            return expert.image;
        }
        // Fallback to a default avatar
        return `https://ui-avatars.com/api/?name=${expert?.name || 'Expert'}&background=random`;
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
                            onClick={() => router.back()}
                            className="mt-4 bg-green-600 hover:bg-green-700"
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-muted-foreground mb-4">Expert Not Found</h1>
                        <Button
                            onClick={() => router.back()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Go Back
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
                        ← Back to Experts
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Profile Only (Sticky) */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20">
                            {/* Profile Card */}
                            <Card>
                                <CardContent className="p-6 relative">
                                    {/* Progress Level Icon - Top Left */}
                                    {expert.progressLevel && (
                                        <div className="absolute top-4 left-4">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {getProgressLevelIcon(expert.progressLevel)}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{expert.progressLevel} Level</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={getAvatarUrl(expert.image)} alt={expert.name} />
                                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h1 className="text-2xl font-bold text-foreground mb-2">
                                            {expert.name}
                                            {expert.verified && (
                                                <FaCheckCircle className="inline ml-2 text-green-500" />
                                            )}
                                        </h1>
                                        {expert.headline && (
                                            <p className="text-sm text-muted-foreground mb-3">{expert.headline}</p>
                                        )}

                                        <div className="flex items-center justify-center gap-1 text-yellow-500 mb-3">
                                            <FaStar />
                                            <span className="font-medium text-foreground">
                                                {expert.ratings} reviews
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <FaMapMarkerAlt />
                                                <span>{formatLocation(expert.location)}</span>
                                            </div>
                                            {expert.hourlyRate && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaDollarSign />
                                                    <span>${expert.hourlyRate}/hour</span>
                                                </div>
                                            )}
                                            {expert.experience && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaClock />
                                                    <span>{expert.experience} years experience</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {!user ? (
                                                // When not logged in - show login prompt
                                                <div className="space-y-2">
                                                    <Button
                                                        onClick={() => setShowLoginPrompt(true)}
                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                    >
                                                        Message Request
                                                    </Button>
                                                    <Button
                                                        onClick={() => setShowLoginPrompt(true)}
                                                        variant="outline"
                                                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                                    >
                                                        Follow
                                                    </Button>
                                                </div>
                                            ) : followStatuses[expert.userId] ? (
                                                // When following - show Message and Unfollow buttons
                                                <div className="space-y-2">
                                                    <Button
                                                        onClick={handleMessage}
                                                        disabled={messageLoading}
                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                    >
                                                        {messageLoading ? "Sending..." : "Message"}
                                                    </Button>
                                                    <Button
                                                        onClick={handleFollow}
                                                        disabled={followLoading}
                                                        variant="outline"
                                                        className="w-full border-red-600 text-red-600 hover:bg-red-50"
                                                    >
                                                        {followLoading ? "Updating..." : "Unfollow"}
                                                    </Button>
                                                </div>
                                            ) : (
                                                // When not following - show Message Request and Follow buttons
                                                <div className="space-y-2">
                                                    <Button
                                                        onClick={handleMessage}
                                                        disabled={messageLoading}
                                                        variant="outline"
                                                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                                    >
                                                        {messageLoading ? "Sending..." : "Message Request"}
                                                    </Button>
                                                    <Button
                                                        onClick={handleFollow}
                                                        disabled={followLoading}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        {followLoading ? "Updating..." : "Follow"}
                                                    </Button>
                                                </div>
                                            )}
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
                                <TabsTrigger value="experiences" className="flex items-center gap-2">
                                    <FaBriefcase className="w-4 h-4" />
                                    Experiences
                                </TabsTrigger>
                                <TabsTrigger value="certificates" className="flex items-center gap-2">
                                    <FaCertificate className="w-4 h-4" />
                                    Certificates
                                </TabsTrigger>
                            </TabsList>

                            {/* Posts Tab */}
                            <TabsContent value="posts" className="space-y-6">
                                {postsLoading ? (
                                    <div className="text-center text-muted-foreground">Loading posts...</div>
                                ) : postsError ? (
                                    <div className="text-center text-red-500">{postsError}</div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center text-muted-foreground">No posts available.</div>
                                ) : (
                                    posts.slice(0, postsToShow).map((post) => (
                                        <Card key={post.id} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                {/* Post Header */}
                                                <div className="p-4 border-b">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={post.author.avatar || getAvatarUrl(post.author.avatar)} alt={post.author.name} />
                                                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Post Content */}
                                                <div className="p-4">
                                                    <p className="text-foreground mb-4">{post.content}</p>
                                                    {post.image && (
                                                        <img
                                                            src={post.image}
                                                            alt="Post"
                                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                                        />
                                                    )}
                                                </div>

                                                {/* Post Actions */}
                                                <div className="px-4 pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-6">
                                                            <button
                                                                className={`flex items-center gap-2 transition-colors ${isPostLikedByUser(post.id)
                                                                    ? "text-red-500"
                                                                    : "text-muted-foreground hover:text-red-500"
                                                                    }`}
                                                                disabled={likeLoading}
                                                                onClick={async () => {
                                                                    if (!user) {
                                                                        setShowLoginPrompt(true);
                                                                        return;
                                                                    }
                                                                    if (isPostLikedByUser(post.id)) {
                                                                        await unlikePost(post.id);
                                                                    } else {
                                                                        await likePost(post.id);
                                                                    }
                                                                }}
                                                            >
                                                                <FaHeart />
                                                                <span className="text-sm">
                                                                    {postLikes.filter(like => like.postId === post.id).length}
                                                                </span>
                                                            </button>
                                                            <button
                                                                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                                                                onClick={() => {
                                                                    setOpenCommentPostId(prev => prev === post.id ? null : post.id);
                                                                }}
                                                            >
                                                                <FaComment />
                                                                <span className="text-sm">{
                                                                    comments.filter(c => c.postId === post.id).length
                                                                }</span>
                                                            </button>
                                                            {/* Optionally add share/bookmark */}
                                                        </div>
                                                        <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                                                            <FaBookmark />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Comments Section - Only show if openCommentPostId === post.id */}
                                                {openCommentPostId === post.id && (
                                                    <div id={`comments-${post.id}`} className="px-4 pb-4">
                                                        <Separator className="my-4" />
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="font-semibold text-foreground">Comments</div>
                                                            <Button size="sm" variant="ghost" onClick={() => setOpenCommentPostId(null)}>
                                                                Close
                                                            </Button>
                                                        </div>
                                                        {/* New Comment Form */}
                                                        {user ? (
                                                            <form
                                                                onSubmit={async (e) => {
                                                                    e.preventDefault();
                                                                    if (!commentInputs[post.id]?.trim()) return;
                                                                    await createComment(post.id, commentInputs[post.id]);
                                                                    setCommentInputs((prev) => ({ ...prev, [post.id]: "" }));
                                                                }}
                                                                className="flex gap-2 mb-4"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    className="flex-1 border rounded px-2 py-1"
                                                                    placeholder="Add a comment..."
                                                                    value={commentInputs[post.id] || ""}
                                                                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                    disabled={commentLoading}
                                                                />
                                                                <Button type="submit" disabled={commentLoading || !commentInputs[post.id]?.trim()} className="bg-green-600 hover:bg-green-700 text-white">
                                                                    Comment
                                                                </Button>
                                                            </form>
                                                        ) : (
                                                            <div className="mb-4">
                                                                <Button onClick={() => setShowLoginPrompt(true)} className="bg-green-600 hover:bg-green-700 text-white">
                                                                    Login to comment
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {/* Comments List */}
                                                        {commentLoading ? (
                                                            <div className="text-muted-foreground">Loading comments...</div>
                                                        ) : comments.filter(c => c.postId === post.id).length === 0 ? (
                                                            <div className="text-muted-foreground">No comments yet.</div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                {comments.filter(c => c.postId === post.id).map(comment => (
                                                                    <div key={comment.id} className="border rounded p-2">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <Avatar className="w-7 h-7">
                                                                                <AvatarImage src={comment.author.avatar || getAvatarUrl(comment.author.avatar)} alt={comment.author.name} />
                                                                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <span className="font-medium text-foreground">{comment.author.name}</span>
                                                                            <span className="text-xs text-muted-foreground ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="ml-9 text-foreground mb-2">{comment.content}</div>
                                                                        {/* Reply Button */}
                                                                        <div className="ml-9">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                className="text-green-600 hover:bg-green-50"
                                                                                onClick={async () => {
                                                                                    setShowReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }));
                                                                                    if (!showReplies[comment.id]) {
                                                                                        await getReplies(comment.id);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {showReplies[comment.id] ? "Hide Replies" : `View Replies (${comment.replies.length})`}
                                                                            </Button>
                                                                        </div>
                                                                        {/* Replies Section */}
                                                                        {showReplies[comment.id] && (
                                                                            <div className="ml-9 mt-2 space-y-2">
                                                                                {/* New Reply Form */}
                                                                                {user ? (
                                                                                    <form
                                                                                        onSubmit={async (e) => {
                                                                                            e.preventDefault();
                                                                                            if (!replyInputs[comment.id]?.trim()) return;
                                                                                            await createReply(comment.id, replyInputs[comment.id]);
                                                                                            setReplyInputs((prev) => ({ ...prev, [comment.id]: "" }));
                                                                                            await getReplies(comment.id);
                                                                                        }}
                                                                                        className="flex gap-2 mb-2"
                                                                                    >
                                                                                        <input
                                                                                            type="text"
                                                                                            className="flex-1 border rounded px-2 py-1"
                                                                                            placeholder="Add a reply..."
                                                                                            value={replyInputs[comment.id] || ""}
                                                                                            onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                                                            disabled={commentLoading}
                                                                                        />
                                                                                        <Button type="submit" disabled={commentLoading || !replyInputs[comment.id]?.trim()} className="bg-green-600 hover:bg-green-700 text-white">
                                                                                            Reply
                                                                                        </Button>
                                                                                    </form>
                                                                                ) : null}
                                                                                {/* Replies List */}
                                                                                {commentLoading ? (
                                                                                    <div className="text-muted-foreground">Loading replies...</div>
                                                                                ) : (replies.filter(r => r.commentId === comment.id).length === 0 ? (
                                                                                    <div className="text-muted-foreground">No replies yet.</div>
                                                                                ) : (
                                                                                    <div className="space-y-2">
                                                                                        {replies.filter(r => r.commentId === comment.id).map(reply => (
                                                                                            <div key={reply.id} className="flex items-center gap-2">
                                                                                                <Avatar className="w-6 h-6">
                                                                                                    <AvatarImage src={reply.author.avatar || getAvatarUrl(reply.author.avatar)} alt={reply.author.name} />
                                                                                                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                                                                                </Avatar>
                                                                                                <span className="font-medium text-foreground">{reply.author.name}</span>
                                                                                                <span className="text-xs text-muted-foreground ml-2">{new Date(reply.createdAt).toLocaleString()}</span>
                                                                                                <span className="ml-2 text-foreground">{reply.content}</span>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
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
                            </TabsContent>

                            {/* About Tab */}
                            <TabsContent value="about">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-6">
                                            {expert.about || expert.bio || expert.summary || "No description available."}
                                        </p>

                                        {expert.expertise && expert.expertise.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-foreground mb-3">Expertise</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {expert.expertise.map((skill, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {expert.languages && expert.languages.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-foreground mb-3">Languages</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {expert.languages.map((language, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {language}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {expert.availability && (
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                                                <p className="text-muted-foreground">{expert.availability}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Experiences Tab */}
                            <TabsContent value="experiences">
                                {expert.experiences && expert.experiences.length > 0 ? (
                                    <div className="space-y-4">
                                        {expert.experiences.map((exp) => (
                                            <Card key={exp.id}>
                                                <CardContent className="p-6">
                                                    <div className="border-l-2 border-green-500 pl-4">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-foreground text-lg">{typeof exp.title === 'string' ? exp.title : 'Title not specified'}</h4>
                                                                <p className="text-muted-foreground">{typeof exp.company === 'string' ? exp.company : 'Company not specified'}</p>
                                                            </div>
                                                            <div className="text-right text-sm text-muted-foreground">
                                                                <p>{exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'}</p>
                                                                {exp.isCurrent ? (
                                                                    <p>Present</p>
                                                                ) : exp.endDate ? (
                                                                    <p>{new Date(exp.endDate).getFullYear()}</p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <p className="text-muted-foreground mb-3">{typeof exp.description === 'string' ? exp.description : 'No description available'}</p>
                                                        {exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {exp.skills.map((skill, skillIndex) => (
                                                                    <Badge key={skillIndex} variant="outline" className="text-xs">
                                                                        {typeof skill === 'string' ? skill : 'Skill'}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <p className="text-muted-foreground">No experience information available.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Certificates Tab */}
                            <TabsContent value="certificates">
                                {expert.certifications && expert.certifications.length > 0 ? (
                                    <div className="space-y-4">
                                        {expert.certifications.map((cert, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <FaCertificate className="text-green-500 w-6 h-6" />
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">
                                                                {typeof cert === 'string' ? cert : cert.name || 'Certification'}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {typeof cert === 'string' ? 'Professional Certification' : cert.issuingOrganization || 'Professional Certification'}
                                                            </p>
                                                            {typeof cert === 'object' && cert.issueDate && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <FaCertificate className="text-muted-foreground w-12 h-12 mx-auto mb-4" />
                                            <p className="text-muted-foreground">No certificates available.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Services & Contact (Sticky) */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            {/* Services Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Services</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {expert.interests && expert.interests.length > 0 ? (
                                        <div className="space-y-1">
                                            {expert.interests.map((interest, index) => (
                                                <div key={index} className="flex items-center gap-1.5 py-1 px-2 bg-muted/20 rounded">
                                                    <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                                                    <span className="text-sm text-foreground">{interest}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No services listed.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FaMapMarkerAlt className="text-muted-foreground w-4" />
                                            <span className="text-foreground">{formatLocation(expert.location)}</span>
                                        </div>
                                        {expert.hourlyRate && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaDollarSign className="text-muted-foreground w-4" />
                                                <span className="text-foreground">${expert.hourlyRate}/hour</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <FaStar className="text-yellow-500 w-4" />
                                            <span className="text-foreground">{expert.ratings} reviews</span>
                                        </div>
                                        {expert.availability && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaClock className="text-muted-foreground w-4" />
                                                <span className="text-foreground">{expert.availability}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>



                            {/* Progress Level */}
                            {expert.progressShow && expert.progressLevel && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-2">
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                {expert.progressLevel}
                                            </Badge>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{expert.followersCount} followers</span>
                                                <span>{expert.followingCount} following</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Prompt Dialog */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Login Required
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You need to be logged in to follow experts or send messages.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => setShowLoginPrompt(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 