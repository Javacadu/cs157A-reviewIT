import SearchBar from "@/components/search/SearchBar";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-zinc-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
        Rate. Review. Discover.
      </h1>
      <p className="text-lg text-gray-500 mb-8 text-center max-w-md">
        ReviewIT is a universal review platform where you can rate and review
        anything.
      </p>
      <div className="w-full max-w-lg">
        <SearchBar />
      </div>
    </main>
  );
}