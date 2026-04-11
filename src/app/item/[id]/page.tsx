import ReviewList from "@/components/reviews/ReviewList";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const itemId = Number(id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Item #{itemId}</h1>
      <ReviewList itemId={itemId} />
    </main>
  );
}
