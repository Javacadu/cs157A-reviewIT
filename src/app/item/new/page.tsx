import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCategories } from "@/lib/actions/itemActions";
import NewItemForm from "./NewItemForm";

interface NewItemPageProps {
  searchParams: Promise<{ itemName?: string }>;
}

export default async function NewItemPage({ searchParams }: NewItemPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  const categories = await getCategories();
  const { itemName } = await searchParams;

  return (
    <main className="mx-auto max-w-md px-4 py-10 bg-white">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">
        Create New Review
      </h1>

      <NewItemForm categories={categories} initialName={itemName} />
    </main>
  );
}