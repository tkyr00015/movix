"use client";

import Link from "next/link";
import { Play, Info, Plus, Check } from "lucide-react";
import { MediaItem, getImageUrl } from "@/lib/tmdb";
import { useState, useEffect } from "react";
import { isInWatchlist, toggleWatchlist } from "@/lib/storage";

interface HeroBannerProps {
  movie: MediaItem | null;
  onOpenModal: (movie: MediaItem) => void;
}

export default function HeroBanner({ movie, onOpenModal }: HeroBannerProps) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (movie) {
      setInList(isInWatchlist(movie.id));
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="relative h-[65vh] sm:h-[80vh] w-full bg-zinc-900 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const title = movie.title || movie.name || movie.original_title || "Featured";
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const releaseYear = (movie.release_date || movie.first_air_date || "").split("-")[0] || "2026";
  const matchScore = Math.min(99, Math.max(75, Math.round((movie.vote_average || 7.5) * 10)));
  const backdropUrl = getImageUrl(movie.backdrop_path, "original");

  const handleToggleList = () => {
    const added = toggleWatchlist(movie);
    setInList(added);
  };

  return (
    <div className="relative h-[68vh] sm:h-[82vh] w-full select-none overflow-hidden">
      {/* Background Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Category Tag */}
          <div className="flex items-center gap-2">
            <span className="text-netflix-red font-bold text-xs uppercase tracking-widest bg-netflix-red/10 px-2 py-0.5 rounded border border-netflix-red/30">
              #1 in Movies Today
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            {title}
          </h1>

          {/* Metadata Badges */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <span className="text-emerald-400 font-bold">{matchScore}% Match</span>
            <span className="text-zinc-300">{releaseYear}</span>
            <span className="border border-zinc-500 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded uppercase">
              U/A 16+
            </span>
            <span className="border border-zinc-600 text-zinc-300 text-[10px] px-1 py-0.2 rounded font-mono">
              HD
            </span>
          </div>

          {/* Description */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/watch/${type}/${movie.id}`}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg text-sm sm:text-base"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </Link>

            <button
              onClick={() => onOpenModal(movie)}
              className="flex items-center gap-2 bg-zinc-600/70 hover:bg-zinc-600/90 text-white font-semibold px-5 py-2.5 rounded backdrop-blur-sm transition-transform active:scale-95 text-sm sm:text-base"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>

            <button
              onClick={handleToggleList}
              aria-label="Add to Watchlist"
              className="p-2.5 rounded-full border-2 border-zinc-400 hover:border-white bg-black/40 hover:bg-black/60 text-white transition-all active:scale-90"
            >
              {inList ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
