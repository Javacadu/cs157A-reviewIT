"use client";

import { useState } from "react";
import { Star, Pencil, X, Check } from "lucide-react";
import { updateReview } from "@/lib/actions/reviewActions";
import type { ReviewWithUser } from "@/types";
import StarRating from "@/components/ui/StarRating";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";

interface ReviewCardProps {
  review: ReviewWithUser;
  currentUserId?: number | null;
}

export default function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editRating, setEditRating] = useState(review.rating);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editBody, setEditBody] = useState(review.body || "");

  const isOwner = currentUserId === review.user_id;

  function handleEdit() {
    setEditRating(review.rating);
    setEditTitle(review.title);
    setEditBody(review.body || "");
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    try {
      await updateReview(review.id, currentUserId!, {
        rating: editRating,
        title: editTitle,
        body: editBody || undefined,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      setLoading(false);
    }
  }

  if (isEditing) {
    return (
      <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <StarRating value={editRating} onChange={setEditRating} />
          <TextInput
            id={`edit-title-${review.id}`}
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <TextArea
            id={`edit-body-${review.id}`}
            label="Review"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Check size={16} />
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {review.username}
        </span>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={handleEdit}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Edit review"
            >
              <Pencil size={14} />
            </button>
          )}
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