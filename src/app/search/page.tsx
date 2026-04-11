import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search ReviewIT</h1>
      <SearchBar initialQuery={q} />
      {q && (
        <section className="mt-8">
          <SearchResults query={q} />
        </section>
      )}
    </main>
  );
}
