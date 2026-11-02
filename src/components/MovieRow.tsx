"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Plus, Check, Star } from "lucide-react";
import { MediaItem, getImageUrl } from "@/lib/tmdb";
import { isInWatchlist, toggleWatchlist } from "@/lib/storage";

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  onOpenModal: (movie: MediaItem) => void;
  isLarge?: boolean;
}

export default function MovieRow({ title, items, onOpenModal, isLarge = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const onScrollUpdate = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2 py-4 relative group/row">
      {/* Category Header */}
      <div className="px-4 sm:px-6 lg:px-8 flex items-baseline justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide hover:text-netflix-red transition-colors cursor-pointer">
          {title}
        </h2>
      </div>

      {/* Row Wrapper */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={onScrollUpdate}
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-2 scroll-smooth"
        >
          {items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onOpenModal={onOpenModal} isLarge={isLarge} />
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}

function MovieCard({
  movie,
  onOpenModal,
  isLarge,
}: {
  movie: MediaItem;
  onOpenModal: (movie: MediaItem) => void;
  isLarge: boolean;
}) {
  const [inList, setInList] = useState(() => isInWatchlist(movie.id));
  const title = movie.title || movie.name || "Movie";
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const posterUrl = getImageUrl(isLarge ? movie.backdrop_path : movie.poster_path, isLarge ? "w780" : "w500");
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "7.2";

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWatchlist(movie);
    setInList(added);
  };

  return (
    <div
      onClick={() => onOpenModal(movie)}
      className={`relative flex-none rounded-md overflow-hidden bg-zinc-900 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 shadow-md group/card ${
        isLarge
          ? "w-64 sm:w-80 aspect-[16/9]"
          : "w-32 sm:w-44 lg:w-48 aspect-[2/3]"
      }`}
    >
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Hover Overlay with Quick Play & Watchlist */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
        <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-1 drop-shadow-md">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          {/* Quick Play Button */}
          <Link
            href={`/watch/${type}/${movie.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-transform active:scale-90"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </Link>

          {/* Watchlist Bookmark */}
          <button
            onClick={handleToggleList}
            aria-label="Add to watchlist"
            className="w-8 h-8 rounded-full border border-zinc-400 bg-black/60 hover:border-white text-white flex items-center justify-center transition-all"
          >
            {inList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
          </button>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
