"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#fbbf24" : "#d1d5db"}
      className="h-8 w-8 transition-colors"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.897 5.373 21.214c-.996.608-2.231-.289-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.007z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function StarRating({
  value,
  onChange,
  required,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div>
      <span className="block text-sm font-medium">
        Your Rating {required && <span className="text-red-500">*</span>}
      </span>
      <input type="hidden" name="rating" value={value} />
      <div
        className="mt-1 flex gap-1"
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hoverRating !== null
            ? star <= hoverRating
            : star <= value;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="p-0.5"
            >
              <StarIcon filled={isFilled} />
            </button>
          );
        })}
      </div>
    </div>
  );
}