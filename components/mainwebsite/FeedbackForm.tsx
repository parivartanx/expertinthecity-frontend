"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createReview, SatisfactionLevel } from "@/lib/mainwebsite/feedback-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import StarRating from "@/components/ui/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const satisfactionOptions: { label: string; value: SatisfactionLevel }[] = [
  { label: "Very Dissatisfied", value: "VERY_DISSATISFIED" },
  { label: "Dissatisfied", value: "DISSATISFIED" },
  { label: "Neutral", value: "NEUTRAL" },
  { label: "Satisfied", value: "SATISFIED" },
  { label: "Very Satisfied", value: "VERY_SATISFIED" },
];

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please provide a rating").max(5),
  satisfaction: z.string().min(1, "Please select satisfaction level"),
  remarks: z.string().max(1000, "Remarks too long").optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  expertId: string;
  sessionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FeedbackForm({ expertId, sessionId, onSuccess, onCancel }: FeedbackFormProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      satisfaction: "SATISFIED",
      remarks: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await createReview({
        expertId,
        sessionId,
        rating: data.rating,
        satisfaction: data.satisfaction as SatisfactionLevel,
        remarks: data.remarks,
      });
      toast.success("Thank you for your feedback!");
      reset();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <Card className="max-w-lg w-full mx-auto mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Leave Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating */}
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                  max={5}
                />
              )}
            />
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
          </div>

          {/* Satisfaction */}
          <div>
            <Label htmlFor="satisfaction">Satisfaction</Label>
            <Controller
              name="satisfaction"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select satisfaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {satisfactionOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.satisfaction && <p className="text-red-500 text-xs mt-1">{errors.satisfaction.message}</p>}
          </div>

          {/* Remarks */}
          <div>
            <Label htmlFor="remarks">Remarks (optional)</Label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Share your experience..." className="mt-2" maxLength={1000} />
              )}
            />
            {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 