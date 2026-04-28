"use client";

import { Star } from "lucide-react";
import type { ReviewWithUser } from "@/types";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {review.username}
        </span>
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`Rated ${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <h3 className="mt-2 font-semibold text-gray-900">{review.title}</h3>
      {review.body && (
        <p className="mt-1 text-sm text-gray-600">{review.body}</p>
      )}
      <p className="mt-2 text-xs text-gray-400">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
    </li>
  );
}