"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle, FaHeart, FaComment, FaShare, FaBookmark, FaUser, FaBriefcase, FaCertificate, FaMedal, FaBolt, FaUserShield, FaTrophy, FaGlobe, FaClock as FaClockIcon, FaUsers, FaAward, FaRocket, FaThumbsUp, FaCommentDots, FaEllipsisH, FaFlag, FaUserPlus, FaEnvelope, FaPhone } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useFollowStore } from "@/lib/mainwebsite/follow-store";
import { toast } from "sonner";
import { usePostsStore } from "@/lib/mainwebsite/posts-store";
import { useLikeStore } from "@/lib/mainwebsite/like-store";
import { useCommentStore } from "@/lib/mainwebsite/comment-store";
import FeedbackForm from "@/components/mainwebsite/FeedbackForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import StarRating from "@/components/ui/StarRating";
import { useReportStore } from "@/lib/mainwebsite/report-store";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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

// No Expert interface, use merged user/expertDetails object

export default function UserORExpertProfile() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    const { getUserById, isLoading, error } = useUserStore();
    const { createChat, chats, fetchChats, sendMessage } = useChatStore();
    const { user } = useAuthStore();
    const {
        followExpert,
        unfollowExpert,
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
    const { reportPost, isLoading: reportLoading, success: reportSuccess, error: reportError, clearError, clearSuccess, reportUser } = useReportStore();
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportPostId, setReportPostId] = useState<string | null>(null);

    const [profile, setProfile] = useState<any>(null);
    const [messageLoading, setMessageLoading] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [postsToShow, setPostsToShow] = useState(3);
    const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
    const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
    const [showReplies, setShowReplies] = useState<{ [commentId: string]: boolean }>({});
    const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesModalPostId, setLikesModalPostId] = useState<string | null>(null);
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const desktopHoverTimeout = useRef<NodeJS.Timeout | null>(null);
    // Add isFollowing state
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [showChatRequest, setShowChatRequest] = useState(false);
    const [chatRequestMessage, setChatRequestMessage] = useState("Hi, I'd like to connect and chat with you!");
    const messageInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedReportReason, setSelectedReportReason] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (userId) {
                // getUserById should return the full response with user and isFollowing
                const response = await getUserById(userId);
                if (response) {
                    // If your getUserById returns only the user, you need to update it to return the full response
                    // For now, let's assume it returns { user, isFollowing }
                    if (response.user && typeof response.isFollowing !== 'undefined') {
                        setProfile(response.user);
                        setIsFollowing(response.isFollowing);
                    } else {
                        setProfile(response); // fallback for old structure
                        setIsFollowing(null);
                    }
                }
            }
        };
        fetchProfile();
    }, [userId, getUserById]);

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
        if (profile?.id) {
            console.log("Fetching posts for userId:", profile.id);
            listPosts({ userId });
        }
    }, [profile?.id, listPosts]);

    // Track liked state for each post
    const isPostLikedByUser = (postId: string) => {
        return postLikes.some(like => like.postId === postId && like.userId === user?.id);
    };

    // Fetch likes and comments for posts when posts change
    useEffect(() => {
        if (posts && posts.length > 0) {
            console.log("Posts:", posts);
            // posts.forEach(post => {
            //     getPostLikes(post.id);
            // });
        }
    }, [posts]);

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

        if (!profile) return;

        if (isFollowing) {
            try {
                setMessageLoading(true);
                // Match ChatUI/modal logic: find the first chat where participants includes profile.id
                let chat = chats.find(
                    (c: any) => c.participants.includes(profile.id)
                );
                let chatId: string;
                if (chat) {
                    chatId = chat.id;
                    router.push(`/chats?chatId=${chatId}`);
                } else {
                    // Create a new chat and use the returned ID directly, passing profile as fallback
                    chatId = await createChat([profile.id], profile);
                    if (!chatId) {
                        throw new Error("Failed to create chat");
                    }
                    // Wait for the chat to appear in the chats array before redirecting
                    const waitForChat = async () => {
                        for (let i = 0; i < 20; i++) { // wait up to 2 seconds
                            const found = chats.find((c: any) => c.id === chatId);
                            if (found) return found;
                            await new Promise(res => setTimeout(res, 100));
                        }
                        return null;
                    };
                    await waitForChat();
                    router.push(`/chats?chatId=${chatId}`);
                }
                toast.success("Opening chat with " + profile.name);
            } catch (error: any) {
                console.error("Error handling message:", error);
                toast.error(error.message || "Failed to open chat");
            } finally {
                setMessageLoading(false);
            }
        } else {
            setShowChatRequest(true);
        }
    };

    const handleFollow = async () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            if (isFollowing) {
                await unfollowExpert(userId);
                toast.success("Unfollowed successfully");
            } else {
                await followExpert(userId);
                toast.success("Followed successfully");
            }
            // Re-fetch profile to get updated isFollowing status
            const response = await getUserById(userId);
            if (response) {
                if (response.user && typeof response.isFollowing !== 'undefined') {
                    setProfile(response.user);
                    setIsFollowing(response.isFollowing);
                } else {
                    setProfile(response);
                    setIsFollowing(null);
                }
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
        if (typeof avatar === 'string' && avatar.trim()) {
            return avatar;
        }
        // Fallback to profile.avatar if available
        if (profile?.avatar && typeof profile.avatar === 'string' && profile.avatar.trim()) {
            return profile.avatar;
        }
        // Fallback to profile.image if available
        if (profile?.image && typeof profile.image === 'string' && profile.image.trim()) {
            return profile.image;
        }
        // Fallback to a default avatar
        return `https://ui-avatars.com/api/?name=${profile?.name || 'Expert'}&background=random`;
    };

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

    // Add a handler for sending a message request with a predefined message
    const handleSendMessageRequest = async () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        if (!profile) return;
        try {
            setMessageLoading(true);
            // Find existing chat
            let chat = chats.find((c: any) => c.participants.includes(profile.id));
            let chatId: string;
            if (chat) {
                chatId = chat.id;
            } else {
                chatId = await createChat([profile.id], profile);
                if (!chatId) throw new Error("Failed to create chat");
                // Wait for the chat to appear in the chats array before sending
                const waitForChat = async () => {
                    for (let i = 0; i < 20; i++) {
                        const found = chats.find((c: any) => c.id === chatId);
                        if (found) return found;
                        await new Promise(res => setTimeout(res, 100));
                    }
                    return null;
                };
                await waitForChat();
            }
            // Send the predefined message
            await sendMessage(chatId, chatRequestMessage);
            toast.success("Message request sent!");
            setShowChatRequest(false);
            router.push(`/chats?chatId=${chatId}`);
        } catch (error: any) {
            console.error("Error sending message request:", error);
            toast.error(error.message || "Failed to send message request");
        } finally {
            setMessageLoading(false);
        }
    };

    if (isLoading || !profile) {
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
                                    {/* 3-dot dropdown menu */}
                                    {user && user.id !== profile.id && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button type="button" className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                                                        <FaEllipsisH className="w-5 h-5 text-gray-500" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-700 cursor-pointer"
                                                        onClick={() => setReportDialogOpen(true)}
                                                    >
                                                        Report User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                    {/* Progress Level Icon - Top Left */}
                                    {profile && profile.expertDetails?.progressLevel && (
                                        <div className="absolute top-4 left-4">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {getProgressLevelIcon(profile.expertDetails.progressLevel)}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{profile.expertDetails.progressLevel.charAt(0) + profile.expertDetails.progressLevel.slice(1).toLowerCase()} Level</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={getAvatarUrl(profile.avatar)} alt={profile.name} />
                                            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                                            {profile.name}
                                            {profile.expertDetails?.verified && (
                                                <FaCheckCircle className="inline text-green-500" title="Verified Expert" />
                                            )}
                                        </h1>
                                        {profile.expertDetails?.headline && (
                                            <p className="text-sm text-muted-foreground mb-3">{profile.expertDetails.headline}</p>
                                        )}

                                        {/* Star Rating */}
                                        {profile.role === 'EXPERT' && (
                                            <div className="flex items-center justify-center gap-1 mb-2">
                                                <FaStar className="text-yellow-500" />
                                                <span className="text-yellow-600 font-semibold text-lg">{profile.expertDetails?.ratings}</span>
                                            </div>
                                        )}

                                        {/* Badges */}
                                        {profile.expertDetails?.badges && profile.expertDetails.badges.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                                                {profile.expertDetails.badges.map((badge: string) => {
                                                    let icon = null, label = badge.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());
                                                    switch (badge) {
                                                        case 'VERIFIED_EXPERT':
                                                            icon = <FaUserShield className="text-blue-500" title="Verified Expert" />; break;
                                                        case 'TOP_RATED':
                                                            icon = <FaStar className="text-yellow-400" title="Top Rated" />; break;
                                                        case 'RISING_EXPERT':
                                                            icon = <FaRocket className="text-purple-500" title="Rising Expert" />; break;
                                                        case 'IN_DEMAND':
                                                            icon = <FaBolt className="text-orange-500" title="In Demand" />; break;
                                                        case 'ELITE_EXPERT':
                                                            icon = <FaTrophy className="text-yellow-600" title="Elite Expert" />; break;
                                                        case 'MULTICITY_EXPERT':
                                                            icon = <FaGlobe className="text-green-500" title="Multicity Expert" />; break;
                                                        case 'QUICK_RESPONDER':
                                                            icon = <FaClockIcon className="text-blue-400" title="Quick Responder" />; break;
                                                        case 'COMMUNITY_CONTRIBUTOR':
                                                            icon = <FaUsers className="text-pink-500" title="Community Contributor" />; break;
                                                        case 'SPECIALIST':
                                                            icon = <FaAward className="text-indigo-500" title="Specialist" />; break;
                                                        case 'VERSATILE_PRO':
                                                            icon = <FaCommentDots className="text-teal-500" title="Versatile Pro" />; break;
                                                        default:
                                                            icon = <FaMedal className="text-gray-400" title={label} />;
                                                    }
                                                    return (
                                                        <TooltipProvider key={badge}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs font-medium border border-gray-200">
                                                                        {icon} {label}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <span>{label}</span>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Progress Level (with label) */}
                                        {profile.expertDetails?.progressLevel && (
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                {(() => {
                                                    switch (profile.expertDetails.progressLevel) {
                                                        case 'BRONZE':
                                                            return <FaMedal className="text-amber-600" title="Bronze" />;
                                                        case 'SILVER':
                                                            return <FaMedal className="text-gray-400" title="Silver" />;
                                                        case 'GOLD':
                                                            return <FaMedal className="text-yellow-500" title="Gold" />;
                                                        case 'PLATINUM':
                                                            return <FaMedal className="text-slate-300" title="Platinum" />;
                                                        default:
                                                            return <FaMedal className="text-gray-300" title={profile.expertDetails.progressLevel} />;
                                                    }
                                                })()}
                                                <span className="text-xs font-semibold text-foreground">
                                                    {profile.expertDetails.progressLevel.charAt(0) + profile.expertDetails.progressLevel.slice(1).toLowerCase()} Level
                                                </span>
                                            </div>
                                        )}

                                        {/* In the left sidebar card, update the location and rating display: */}
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <FaMapMarkerAlt />
                                                <span>
                                                    {profile.role === 'USER'
                                                        ? (typeof profile.location === 'string'
                                                            ? profile.location
                                                            : [profile.location?.city, profile.location?.country, profile.location?.postalCode].filter(Boolean).join(', '))
                                                        : formatLocation(profile.location)}
                                                </span>
                                            </div>
                                            {profile.role === 'EXPERT' && profile.expertDetails?.hourlyRate && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaDollarSign />
                                                    <span>${profile.expertDetails.hourlyRate}/hour</span>
                                                </div>
                                            )}
                                            {profile.role === 'EXPERT' && profile.expertDetails?.experience && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FaClock />
                                                    <span>{profile.expertDetails.experience} years experience</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Star Rating: Only for EXPERT */}
                                        {profile.role === 'EXPERT' && (
                                            <div className="flex items-center justify-center gap-1 mb-2">
                                                <FaStar className="text-yellow-500" />
                                                <span className="text-yellow-600 font-semibold text-lg">{profile.expertDetails?.ratings}</span>
                                            </div>
                                        )}

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
                                            ) : isFollowing ? (
                                                // When following - show Message, Unfollow, and Give Feedback buttons
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
                                                    {/* Only show Give Feedback for EXPERT */}
                                                    {profile.role === 'EXPERT' && (
                                                        <Button
                                                            onClick={() => setFeedbackOpen(true)}
                                                            variant="outline"
                                                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            Give Feedback
                                                        </Button>
                                                    )}
                                                    <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                                                        <DialogContent className="max-w-lg w-full p-0">
                                                            <div className="p-6">
                                                                <FeedbackForm expertId={profile.id} onSuccess={() => setFeedbackOpen(false)} onCancel={() => setFeedbackOpen(false)} />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
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
                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className={`grid w-full ${profile.role === 'EXPERT' ? 'grid-cols-4' : 'grid-cols-1'} mb-6`}>
                                {profile.role === 'EXPERT' && (
                                    <TabsTrigger value="posts" className="flex items-center gap-2">
                                        <FaUser className="w-4 h-4" />
                                        Posts
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="about" className="flex items-center gap-2">
                                    <FaUser className="w-4 h-4" />
                                    About
                                </TabsTrigger>
                                {profile.role === 'EXPERT' && (
                                    <TabsTrigger value="experiences" className="flex items-center gap-2">
                                        <FaBriefcase className="w-4 h-4" />
                                        Experiences
                                    </TabsTrigger>
                                )}
                                {profile.role === 'EXPERT' && (
                                    <TabsTrigger value="certificates" className="flex items-center gap-2">
                                        <FaCertificate className="w-4 h-4" />
                                        Certificates
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            {/* Posts Tab */}
                            {profile.role === 'EXPERT' && (
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
                                                            {user && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                            <FaEllipsisH className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        {post.author.id === user.id ? (
                                                                            <>
                                                                                {/* Owner actions (edit/delete) if needed */}
                                                                            </>
                                                                        ) : (
                                                                            isFollowing && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleOpenReportDialog(post.id)}
                                                                                    className="text-red-600 focus:text-red-600"
                                                                                >
                                                                                    <FaFlag className="mr-2 h-4 w-4" />
                                                                                    Report Post
                                                                                </DropdownMenuItem>
                                                                            )
                                                                        )}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Post Content */}
                                                    <div className="p-4">
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
                                                                    onMouseEnter={async () => {
                                                                        if (window.innerWidth > 768) {
                                                                            desktopHoverTimeout.current = setTimeout(async () => {
                                                                                if (!postLikes.some(like => like.postId === post.id)) {
                                                                                    await getPostLikes(post.id);
                                                                                }
                                                                                setLikesModalPostId(post.id);
                                                                                setShowLikesModal(true);
                                                                            }, 2000); // 2 seconds
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
                                                                            }, 500); // 500ms for long press
                                                                        }
                                                                    }}
                                                                    onTouchEnd={e => {
                                                                        if (window.innerWidth <= 768 && longPressTimeout.current) {
                                                                            clearTimeout(longPressTimeout.current);
                                                                        }
                                                                    }}
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
                                                                    onClick={async () => {
                                                                        if (openCommentPostId !== post.id) {
                                                                            // Only fetch if not already open
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
                                                                    <span className="text-sm">{
                                                                        comments.filter(c => c.postId === post.id).length
                                                                    }</span>
                                                                </button>
                                                            </div>
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
                            )}

                            {/* About Tab */}
                            <TabsContent value="about">
                                <Card>
                                    <CardContent>
                                        {profile.role === 'USER' ? (
                                            <div className="space-y-6">
                                                {/* Profile Summary */}
                                                <div className="bg-white rounded-lg shadow-sm p-6">
                                                    <h3 className="text-lg font-semibold mb-2 text-green-700 flex items-center gap-2">
                                                        <FaUser className="inline-block text-green-500" /> Profile Summary
                                                    </h3>
                                                    {profile.bio && (
                                                        <p className="text-muted-foreground mb-2">{profile.bio}</p>
                                                    )}
                                                    {profile.location && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                            <FaMapMarkerAlt className="text-green-500" />
                                                            <span>
                                                                {typeof profile.location === 'string'
                                                                    ? profile.location
                                                                    : [profile.location.city, profile.location.country, profile.location.postalCode].filter(Boolean).join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Profile Stats */}
                                                {profile._count && (
                                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                                        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                                                            <FaStar className="inline-block text-yellow-500" /> Profile Stats
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <FaUsers className="text-green-500 mb-1" />
                                                                <span className="font-bold text-lg">{profile._count.followers}</span>
                                                                <span className="text-xs text-muted-foreground">Followers</span>
                                                            </div>
                                                            <div className="flex flex-col items-center">
                                                                <FaUserPlus className="text-green-500 mb-1" />
                                                                <span className="font-bold text-lg">{profile._count.following}</span>
                                                                <span className="text-xs text-muted-foreground">Following</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-muted-foreground mb-6">
                                                    {profile.expertDetails?.about || profile.expertDetails?.bio || profile.expertDetails?.summary || "No description available."}
                                                </p>

                                                {profile.expertDetails?.expertise && profile.expertDetails.expertise.length > 0 && (
                                                    <div className="mb-6">
                                                        <h3 className="font-semibold text-foreground mb-3">Expertise</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profile.expertDetails.expertise.map((skill: string, index: number) => (
                                                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {profile.expertDetails?.languages && profile.expertDetails.languages.length > 0 && (
                                                    <div className="mb-6">
                                                        <h3 className="font-semibold text-foreground mb-3">Languages</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profile.expertDetails.languages.map((language: string, index: number) => (
                                                                <Badge key={index} variant="outline">
                                                                    {language}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {profile.expertDetails?.availability && (
                                                    <div>
                                                        <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                                                        <p className="text-muted-foreground">{profile.expertDetails.availability}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Experiences Tab */}
                            {profile.role === 'EXPERT' && (
                                <TabsContent value="experiences">
                                    {profile.expertDetails?.experiences && profile.expertDetails.experiences.length > 0 ? (
                                        <div className="space-y-4">
                                            {profile.expertDetails.experiences.map((exp: Experience) => (
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
                                                                    {exp.skills.map((skill: string, skillIndex: number) => (
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
                            )}

                            {/* Certificates Tab */}
                            {profile.role === 'EXPERT' && (
                                <TabsContent value="certificates">
                                    {profile.expertDetails?.certifications && profile.expertDetails.certifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {profile.expertDetails.certifications.map((cert: Certification, index: number) => (
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
                            )}
                        </Tabs>
                    </div>

                    {/* Right Column - Services & Contact (Sticky) */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            {/* Services Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        {profile.role === 'EXPERT' ? 'Expertise' : 'Interests'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {profile.role === 'EXPERT' ? (
                                        profile.expertDetails?.expertise && profile.expertDetails.expertise.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.expertDetails.expertise.map((skill: string, index: number) => (
                                                    <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No expertise listed.</p>
                                        )
                                    ) : (
                                        profile.interests && profile.interests.length > 0 ? (
                                            <div className="space-y-1">
                                                {profile.interests.map((interest: string, index: number) => (
                                                    <div key={index} className="flex items-center gap-1.5 py-1 px-2 bg-muted/20 rounded">
                                                        <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                                                        <span className="text-sm text-foreground">{interest}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No interests listed.</p>
                                        )
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
                                        {profile.role === 'USER' ? (
                                            <>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaUser className="text-muted-foreground w-4" />
                                                    <span className="text-foreground">{profile.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaMapMarkerAlt className="text-muted-foreground w-4" />
                                                    <span className="text-foreground">{formatLocation(profile.location)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaEnvelope className="text-muted-foreground w-4" />
                                                    <span className="text-foreground">{profile.email}</span>
                                                </div>
                                                {profile.phone && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaPhone className="text-muted-foreground w-4" />
                                                        <span className="text-foreground">{profile.phone}</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaMapMarkerAlt className="text-muted-foreground w-4" />
                                                    <span className="text-foreground">{formatLocation(profile.location)}</span>
                                                </div>
                                                {profile.expertDetails?.hourlyRate && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaDollarSign className="text-muted-foreground w-4" />
                                                        <span className="text-foreground">${profile.expertDetails.hourlyRate}/hour</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaStar className="text-yellow-500 w-4" />
                                                    <span className="text-foreground">{profile.expertDetails?.ratings} reviews</span>
                                                </div>
                                                {profile.expertDetails?.availability && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaClock />
                                                        <span className="text-foreground">{profile.expertDetails.availability}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>



                            {/* Progress Level */}
                            {profile.expertDetails?.progressShow && profile.expertDetails.progressLevel && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-2">
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                {profile.expertDetails.progressLevel}
                                            </Badge>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{profile._count?.followers} followers</span>
                                                <span>{profile._count?.following} following</span>
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

            {/* Chat Request Popup */}
            {showChatRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Send Message Request
                            </h3>
                            <p className="text-gray-600 mb-4">
                                You need to follow this expert to start a chat. Send a message request below:
                            </p>
                            <input
                                ref={messageInputRef}
                                type="text"
                                className="w-full border rounded px-3 py-2 mb-4"
                                value={chatRequestMessage}
                                onChange={e => setChatRequestMessage(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSendMessageRequest}
                                    disabled={messageLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    {messageLoading ? "Sending..." : "Send Message Request"}
                                </Button>
                                <Button
                                    onClick={() => setShowChatRequest(false)}
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

            {/* Report User Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select value={selectedReportReason} onValueChange={setSelectedReportReason}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Spam">Spam</SelectItem>
                                <SelectItem value="Harassment">Harassment</SelectItem>
                                <SelectItem value="Fake Profile">Fake Profile</SelectItem>
                                <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {selectedReportReason === "Other" && (
                            <Input
                                placeholder="Enter reason for reporting this user"
                                value={reportReason}
                                onChange={e => setReportReason(e.target.value)}
                                disabled={reportLoading}
                            />
                        )}
                        {reportError && <div className="text-red-500 text-sm">{reportError}</div>}
                        {reportSuccess && <div className="text-green-600 text-sm">{reportSuccess}</div>}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={async () => {
                                const reasonToSend = selectedReportReason === "Other" ? reportReason : selectedReportReason;
                                if (profile.id && reasonToSend && reasonToSend.trim()) {
                                    await reportUser(profile.id, reasonToSend);
                                    setReportReason("");
                                    setSelectedReportReason("");
                                }
                            }}
                            disabled={reportLoading || !selectedReportReason || (selectedReportReason === "Other" && !reportReason.trim())}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {reportLoading ? "Reporting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Likes Modal for Mobile */}
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
                                            <AvatarImage src={like.user?.avatar || getAvatarUrl(like.user?.avatar)} alt={like.user?.name || "User"} />
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
        </div>
    );
} 