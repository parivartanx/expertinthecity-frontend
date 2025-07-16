import { axiosInstance } from './axios';

// Types
export type SatisfactionLevel =
  | 'VERY_DISSATISFIED'
  | 'DISSATISFIED'
  | 'NEUTRAL'
  | 'SATISFIED'
  | 'VERY_SATISFIED';

export interface Review {
  id: string;
  sessionId?: string;
  reviewerId: string;
  expertId: string;
  rating: number;
  satisfaction?: SatisfactionLevel;
  remarks?: string;
  reviewer?: {
    id: string;
    name: string;
    avatar: string;
  };
  expert?: {
    id: string;
    headline: string;
    ratings: number;
    progressLevel: string;
    badges: string[];
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Create a review for an expert
export async function createReview({
  expertId,
  rating,
  satisfaction,
  remarks,
  sessionId,
}: {
  expertId: string;
  rating: number;
  satisfaction?: SatisfactionLevel;
  remarks?: string;
  sessionId?: string;
}) {
  const res = await axiosInstance.post(`/feedback/expert/${expertId}`, {
    rating,
    satisfaction,
    remarks,
    sessionId,
  });
  return res.data;
}

// Get all reviews for an expert
export async function getExpertReviews({
  expertId,
  params = {},
}: {
  expertId: string;
  params?: Record<string, any>;
}) {
  const res = await axiosInstance.get(`/feedback/expert/${expertId}`, { params });
  return res.data;
}

// Get all reviews given by the current user
export async function getUserReviews(params: Record<string, any> = {}) {
  const res = await axiosInstance.get('/feedback/user', { params });
  return res.data;
}

// Update a review
export async function updateReview({
  id,
  rating,
  satisfaction,
  remarks,
}: {
  id: string;
  rating?: number;
  satisfaction?: SatisfactionLevel;
  remarks?: string;
}) {
  const res = await axiosInstance.patch(`/feedback/${id}`, {
    rating,
    satisfaction,
    remarks,
  });
  return res.data;
}

// Delete a review
export async function deleteReview(id: string) {
  const res = await axiosInstance.delete(`/feedback/${id}`);
  return res.data;
} 