"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { toast } from "sonner";

interface Expert {
    id: string;
    name: string;
    title?: string;
    location: string | { address?: string; country?: string };
    rating: number;
    reviews: number;
    categories?: string[];
    tags?: string[];
    image: string;
    status?: string;
    bio?: string;
    description?: string;
    hourlyRate?: number;
    verified?: boolean;
    expertise?: string[];
    experience?: number;
    availability?: string;
    languages?: string[];
}

export default function ExpertProfile() {
    const params = useParams();
    const router = useRouter();
    const expertId = params.id as string;

    const { getExpertById, sendMessageToExpert, isLoading, error } = useAllExpertsStore();
    const { createChat, chats } = useChatStore();

    const [expert, setExpert] = useState<Expert | null>(null);
    const [messageLoading, setMessageLoading] = useState(false);

    useEffect(() => {
        const fetchExpert = async () => {
            if (expertId) {
                const expertData = await getExpertById(expertId);
                setExpert(expertData);
            }
        };

        fetchExpert();
    }, [expertId, getExpertById]);

    const handleMessage = async () => {
        if (!expert) return;

        try {
            setMessageLoading(true);

            // Try to find an existing chat with this expert
            let chat = chats.find(
                (c) =>
                    c.type === "expert" &&
                    c.participants.some((p) => p.id === expert.id)
            );

            if (!chat) {
                // Create a new chat if not found
                await createChat({
                    type: "expert",
                    participants: [{ id: expert.id, name: expert.name, avatar: expert.image, role: "expert", isOnline: false }],
                    name: expert.name,
                    avatar: expert.image,
                });

                // Refetch chats to get the new chatId
                chat = chats.find(
                    (c) =>
                        c.type === "expert" &&
                        c.participants.some((p) => p.id === expert.id)
                );
            }

            if (chat) {
                // Send initial message to expert
                const messageSent = await sendMessageToExpert(expert.id, "Hello! I'm interested in your services.");

                if (messageSent) {
                    toast.success("Message sent successfully!");
                    router.push(`/chat?chatId=${chat.id}`);
                } else {
                    toast.error("Failed to send message");
                }
            } else {
                toast.error("Failed to create chat");
            }
        } catch (error) {
            console.error("Error handling message:", error);
            toast.error("Failed to send message");
        } finally {
            setMessageLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 bg-background min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3">
                                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="md:w-2/3">
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
                <div className="max-w-4xl mx-auto">
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
                <div className="max-w-4xl mx-auto">
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
        <div className="p-4 md:p-8 bg-background min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 text-muted-foreground hover:text-foreground"
                >
                    ← Back to Experts
                </Button>

                {/* Expert Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="md:w-1/3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <img
                                        src={expert.image}
                                        alt={expert.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <h1 className="text-2xl font-bold text-foreground mb-2">
                                        {expert.name}
                                        {expert.verified && (
                                            <FaCheckCircle className="inline ml-2 text-green-500" />
                                        )}
                                    </h1>
                                    {expert.title && (
                                        <p className="text-lg text-muted-foreground mb-3">{expert.title}</p>
                                    )}

                                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-3">
                                        <FaStar />
                                        <span className="font-medium text-foreground">
                                            {expert.rating} ({expert.reviews} reviews)
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FaMapMarkerAlt />
                                            <span>
                                                {typeof expert.location === 'string'
                                                    ? expert.location
                                                    : [expert.location?.address, expert.location?.country].filter(Boolean).join(', ')}
                                            </span>
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
                                        <Button
                                            onClick={handleMessage}
                                            disabled={messageLoading}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            {messageLoading ? "Sending..." : "Send Message"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full border-green-600 text-green-600 hover:bg-green-50"
                                        >
                                            Book Consultation
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:w-2/3">
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-6">
                                    {expert.description || expert.bio || "No description available."}
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

                                {expert.tags && expert.tags.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-foreground mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {expert.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline">
                                                    {tag}
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
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {expert.categories && expert.categories.length > 0 ? (
                                <div className="space-y-2">
                                    {expert.categories.map((category, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-muted-foreground">{category}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No services listed.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {typeof expert.location === 'string'
                                            ? expert.location
                                            : [expert.location?.address, expert.location?.country].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                                {expert.hourlyRate && (
                                    <div className="flex items-center gap-2">
                                        <FaDollarSign className="text-muted-foreground" />
                                        <span className="text-muted-foreground">${expert.hourlyRate}/hour</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaStar className="text-yellow-500" />
                                    <span className="text-muted-foreground">
                                        {expert.rating} stars ({expert.reviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 