import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCategories } from "@/lib/actions/itemActions";
import NewItemForm from "./NewItemForm";

export default async function NewItemPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-md px-4 py-10 bg-white">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">
        Create New Item
      </h1>

      <NewItemForm categories={categories} />
    </main>
  );
}