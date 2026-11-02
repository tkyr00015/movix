"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import {
  MediaItem,
  getImageUrl,
  getBollywoodMovies,
  getSouthIndianMovies,
  getPopularMovies,
  getTopRatedSeries,
  getTrending,
} from "@/lib/tmdb";
import MovieModal from "@/components/MovieModal";

interface BrowseProps {
  params: { category: string };
}

const CATEGORY_MAP: Record<string, { title: string; fetcher: () => Promise<MediaItem[]> }> = {
  bollywood: {
    title: "Popular Bollywood Cinema (Hindi)",
    fetcher: getBollywoodMovies,
  },
  south: {
    title: "South Indian Blockbusters (Telugu, Tamil, Malayalam)",
    fetcher: getSouthIndianMovies,
  },
  movies: {
    title: "Popular Movies",
    fetcher: getPopularMovies,
  },
  tv: {
    title: "Popular TV & Web Series",
    fetcher: getTopRatedSeries,
  },
  trending: {
    title: "New & Trending Today",
    fetcher: () => getTrending("all"),
  },
};

export default function BrowseCategoryPage({ params }: BrowseProps) {
  const { category } = params;
  const config = CATEGORY_MAP[category.toLowerCase()] || {
    title: "Browse Movies",
    fetcher: () => getTrending("all"),
  };

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    setLoading(true);
    config
      .fetcher()
      .then((data) => setItems(data))
      .catch((err) => console.error("Category fetch error:", err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl sm:text-3xl font-black text-white">{config.title}</h1>
      </div>

      {loading && (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((movie) => {
            const title = movie.title || movie.name || "Movie";
            const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
            const posterUrl = getImageUrl(movie.poster_path, "w500");
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "7.5";

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
