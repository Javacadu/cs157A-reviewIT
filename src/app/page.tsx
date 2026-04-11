import Link from "next/link";
import SearchBar from "@/components/search/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ReviewIT
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/search" className="hover:text-blue-600">
            Browse
          </Link>
          <Link href="/auth" className="hover:text-blue-600">
            Sign in
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
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
    </div>
  );
}
