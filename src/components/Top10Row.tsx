"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MediaItem, getImageUrl } from "@/lib/tmdb";

interface Top10RowProps {
  title: string;
  items: MediaItem[];
  onOpenModal: (movie: MediaItem) => void;
}

export default function Top10Row({ title, items, onOpenModal }: Top10RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const top10 = items.slice(0, 10);

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

  if (!top10.length) return null;

  return (
    <div className="space-y-2 py-6 relative group/top10 select-none">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          {title}
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={onScrollUpdate}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-4 scroll-smooth"
        >
          {top10.map((movie, index) => {
            const rank = index + 1;
            const titleName = movie.title || movie.name || "Title";
            const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
            const posterUrl = getImageUrl(movie.poster_path, "w500");

            return (
              <div
                key={movie.id}
                onClick={() => onOpenModal(movie)}
                className="relative flex-none flex items-end cursor-pointer group/card transition-transform duration-300 hover:scale-105"
              >
                {/* Big Number Typography (Iconic Netflix Top 10) */}
                <div className="relative select-none text-[6.5rem] sm:text-[9rem] font-black leading-none text-zinc-950 -mr-6 sm:-mr-8 z-10 transition-transform group-hover/card:-translate-x-1 font-mono tracking-tighter"
                  style={{
                    WebkitTextStroke: "4px #555555",
                    textShadow: "0 0 10px rgba(0,0,0,0.8)",
                  }}
                >
                  {rank}
                </div>

                {/* Poster Card */}
                <div className="relative w-28 sm:w-36 lg:w-40 aspect-[2/3] rounded-md overflow-hidden bg-zinc-900 shadow-xl border border-zinc-800">
                  <img
                    src={posterUrl}
                    alt={titleName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      href={`/watch/${type}/${movie.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
