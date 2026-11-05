"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Play, Star, Clock, Calendar } from "lucide-react";
import { MediaItem, MediaDetails, getImageUrl, getMediaDetails } from "@/lib/tmdb";

interface MovieModalProps {
  movie: MediaItem | null;
  onClose: () => void;
  onSelectSimilar: (movie: MediaItem) => void;
}

export default function MovieModal({ movie, onClose, onSelectSimilar }: MovieModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) {
      setDetails(null);
      return;
    }

    setLoading(true);

    const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
    getMediaDetails(type, movie.id)
      .then((data) => setDetails(data))
      .catch((err) => console.error("Modal fetch error:", err))
      .finally(() => setLoading(false));

    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [movie]);

  if (!movie) return null;

  const title = movie.title || movie.name || "Movie Details";
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const releaseYear = (movie.release_date || movie.first_air_date || "").split("-")[0];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "7.5";
  const matchScore = Math.min(99, Math.max(75, Math.round((movie.vote_average || 7.5) * 10)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-netflix-dark border border-zinc-800 rounded-xl shadow-2xl no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner */}
        <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-black/30" />

          {/* Banner Floating Actions */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">
                {title}
              </h2>

              <div className="flex items-center gap-3">
                <Link
                  href={`/watch/${type}/${movie.id}`}
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2 rounded hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg text-sm sm:text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Play
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Info & Overview */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold flex-wrap">
                <span className="text-emerald-400 font-bold">{matchScore}% Match</span>
                {releaseYear && (
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {releaseYear}
                  </span>
                )}
                {details?.runtime && (
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3.5 h-3.5" />
                    {details.runtime}m
                  </span>
                )}
                {details?.number_of_seasons && (
                  <span className="text-zinc-300">
                    {details.number_of_seasons} Season{details.number_of_seasons > 1 ? "s" : ""}
                  </span>
                )}
                <span className="border border-zinc-600 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded uppercase">
                  U/A 16+
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {rating}
                </span>
              </div>

              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
                {details?.overview || movie.overview}
              </p>
            </div>

            {/* Right 1 Col: Cast & Genres */}
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              {details?.credits?.cast && details.credits.cast.length > 0 && (
                <div>
                  <span className="text-zinc-500">Cast: </span>
                  <span className="text-zinc-300">
                    {details.credits.cast.slice(0, 4).map((c) => c.name).join(", ")}
                  </span>
                </div>
              )}

              {details?.genres && details.genres.length > 0 && (
                <div>
                  <span className="text-zinc-500">Genres: </span>
                  <span className="text-zinc-300">
                    {details.genres.map((g) => g.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* "More Like This" Similar Movies Section */}
          {details?.similar?.results && details.similar.results.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold text-white">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {details.similar.results.slice(0, 6).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="group/sim cursor-pointer bg-zinc-900 rounded-md overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                      <img
                        src={getImageUrl(sim.backdrop_path || sim.poster_path, "w500")}
                        alt={sim.title || sim.name || ""}
                        className="w-full h-full object-cover group-hover/sim:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-white line-clamp-1">
                        {sim.title || sim.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                        {sim.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
