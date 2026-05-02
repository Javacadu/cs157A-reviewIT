"use client";

import { useState } from "react";
import { Star, Pencil, X, Check, Trash2 } from "lucide-react";
import { updateReview, deleteReview } from "@/lib/actions/reviewActions";
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
  const [isDeleted, setIsDeleted] = useState(false);

  const [currentReview, setCurrentReview] = useState(review);
  const [editRating, setEditRating] = useState(review.rating);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editBody, setEditBody] = useState(review.body || "");

  const isOwner = currentUserId === currentReview.user_id;

  async function handleDelete() {
    if (!currentUserId) return;
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setLoading(true);
    setError(null);

    try {
      await deleteReview(currentReview.id, currentUserId);
      setIsDeleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      setLoading(false);
      setIsDeleted(false);
    }
  }

  function handleEdit() {
    if (!currentUserId) return;
    setEditRating(currentReview.rating);
    setEditTitle(currentReview.title);
    setEditBody(currentReview.body || "");
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
    setEditRating(currentReview.rating);
    setEditTitle(currentReview.title);
    setEditBody(currentReview.body || "");
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    try {
      const updated = await updateReview(currentReview.id, currentUserId ?? null, {
        rating: editRating,
        title: editTitle,
        body: editBody || undefined,
      });
      setCurrentReview({ ...currentReview, ...updated });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      setLoading(false);
    }
  }

  if (isDeleted) {
    return null;
  }

  if (isEditing) {
    return (
      <li className="rounded-10 border border-gray-200 bg-white p-4 shadow-8m">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rating
            </label>
            <StarRating value={editRating} onChange={setEditRating} />
          </div>
          <TextInput
            id={`edit-title-${currentReview.id}`}
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <TextArea
            id={`edit-body-${currentReview.id}`}
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
              <Check size={14} />
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              <X size={14} />
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
          {currentReview.username}
        </span>
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Edit review"
                disabled={loading}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                title="Delete review"
                disabled={loading}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          <div
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`Rated ${currentReview.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= currentReview.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <h3 className="mt-2 font-semibold text-gray-900">{currentReview.title}</h3>
      {currentReview.body && (
        <p className="mt-1 text-sm text-gray-600">{currentReview.body}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-gray-400">
        {new Date(currentReview.created_at).toLocaleDateString()}
      </p>
    </li>
  );
}