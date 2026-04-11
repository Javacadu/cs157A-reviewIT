import { getReviewsByItemId } from "@/lib/actions/reviewActions";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  itemId: number;
}

export default async function ReviewList({ itemId }: ReviewListProps) {
  const reviews = await getReviewsByItemId(itemId);

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No reviews yet. Be the first to review this item!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </ul>
  );
}
