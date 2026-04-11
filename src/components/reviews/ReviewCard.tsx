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
        <span
          className="flex items-center gap-0.5 text-yellow-500 text-sm"
          aria-label={`Rated ${review.rating} out of 5 stars`}
        >
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </span>
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
