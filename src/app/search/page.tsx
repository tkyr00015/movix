"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MediaItem, searchMedia, getImageUrl } from "@/lib/tmdb";
import MovieModal from "@/components/MovieModal";
import Link from "next/link";
import { Play, Star, Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchMedia(query.trim())
        .then((data) => setResults(data))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const filteredResults = results.filter((item) => {
    if (filter === "all") return true;
    return item.media_type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-netflix-red" />
            Results for: <span className="text-netflix-red">"{query}"</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Found {filteredResults.length} title{filteredResults.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(["all", "movie", "tv"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-white text-black shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab === "all" ? "All" : tab === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* No Results Message */}
      {!loading && query && filteredResults.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
          <p className="text-lg">No movies or TV shows found matching "{query}".</p>
          <p className="text-xs text-zinc-500">Try searching for another title, actor, or director.</p>
        </div>
      )}

      {/* Grid of Results */}
      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredResults.map((movie) => {
            const title = movie.title || movie.name || "Movie";
            const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
            const posterUrl = getImageUrl(movie.poster_path, "w500");
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "7.0";

            return (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group/card relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-900 cursor-pointer shadow-md hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={posterUrl}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold line-clamp-1">{title}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      {rating}
                    </span>
                    <Link
                      href={`/watch/${type}/${movie.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-full bg-white text-black hover:bg-zinc-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.2" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectSimilar={(movie) => setSelectedMovie(movie)}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-zinc-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
