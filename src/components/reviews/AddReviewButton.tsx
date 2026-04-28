import Link from "next/link";

interface AddReviewButtonProps {
  itemName: string;
}

export default function AddReviewButton({ itemName }: AddReviewButtonProps) {
  return (
    <Link
      href={`/item/new?itemName=${encodeURIComponent(itemName)}`}
      className="mb-4 inline-block rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] transition-colors hover:opacity-90"
    >
      Add Review
    </Link>
  );
}