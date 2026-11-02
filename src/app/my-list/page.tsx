"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Trash2, BookmarkCheck } from "lucide-react";
import { MediaItem, getImageUrl } from "@/lib/tmdb";
import { getWatchlist, toggleWatchlist } from "@/lib/storage";
import MovieModal from "@/components/MovieModal";

export default function MyListPage() {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  const handleRemove = (e: React.MouseEvent, movie: MediaItem) => {
    e.stopPropagation();
    toggleWatchlist(movie);
    setWatchlist(getWatchlist());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
          <BookmarkCheck className="w-6 h-6 text-netflix-red" />
          My Watchlist
        </h1>
        <span className="text-xs text-zinc-400 font-semibold">
          {watchlist.length} saved title{watchlist.length !== 1 ? "s" : ""}
        </span>
      </div>

      {watchlist.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 space-y-3">
          <p className="text-base sm:text-lg">Your Watchlist is empty.</p>
          <p className="text-xs text-zinc-500 max-w-sm">
            Explore movies and TV shows and tap the <strong>+</strong> icon to bookmark your favorites here.
          </p>
          <Link
            href="/"
            className="mt-2 px-5 py-2 rounded bg-netflix-red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {watchlist.map((movie) => {
            const title = movie.title || movie.name || "Movie";
            const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
            const posterUrl = getImageUrl(movie.poster_path, "w500");

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
                  <div className="flex items-center justify-between mt-2">
                    <Link
                      href={`/watch/${type}/${movie.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-full bg-white text-black hover:bg-zinc-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.2" />
                    </Link>

                    <button
                      onClick={(e) => handleRemove(e, movie)}
                      title="Remove from list"
                      className="p-1.5 rounded-full bg-black/60 text-zinc-300 hover:text-red-400 hover:bg-black/90 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
