import Link from "next/link";
import { getReviewsByItemId } from "@/lib/actions/reviewActions";
import { getSession } from "@/lib/auth/session";
import ReviewCard from "./ReviewCard";
import AddReviewButton from "./AddReviewButton";

interface ReviewListProps {
  itemId: number;
  itemName?: string;
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

export default async function ReviewList({ itemId, itemName }: ReviewListProps) {
  const reviews = await getReviewsByItemId(itemId);
  const session = await getSession();
  const currentUserId = session?.userId ?? null;

  if (reviews.length === 0) {
    return (
      <div className="text-center">
        <Link
          href={`/item/new?itemName=${encodeURIComponent(itemName || "")}`}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
        >
          <PlusIcon />
          Be the first to review {itemName}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AddReviewButton itemName={itemName || ""} />
      <ul className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} currentUserId={currentUserId} />
        ))}
      </ul>
    </div>
  );
}
