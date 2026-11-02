"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import Top10Row from "@/components/Top10Row";
import MovieModal from "@/components/MovieModal";
import {
  MediaItem,
  getTrending,
  getTop10Today,
  getBollywoodMovies,
  getSouthIndianMovies,
  getActionMovies,
  getTopRatedSeries,
} from "@/lib/tmdb";
import { getContinueWatching, WatchProgress } from "@/lib/storage";

export default function HomePage() {
  const [featured, setFeatured] = useState<MediaItem | null>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [top10, setTop10] = useState<MediaItem[]>([]);
  const [bollywood, setBollywood] = useState<MediaItem[]>([]);
  const [south, setSouth] = useState<MediaItem[]>([]);
  const [action, setAction] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [continueList, setContinueList] = useState<WatchProgress[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load continue watching list from localStorage
    setContinueList(getContinueWatching());

    // Fetch all categories concurrently
    Promise.allSettled([
      getTrending("all"),
      getTop10Today(),
      getBollywoodMovies(),
      getSouthIndianMovies(),
      getActionMovies(),
      getTopRatedSeries(),
    ])
      .then(([trendRes, top10Res, bollyRes, southRes, actionRes, seriesRes]) => {
        if (trendRes.status === "fulfilled" && trendRes.value.length > 0) {
          setTrending(trendRes.value);
          // Pick a random popular item with a backdrop for the Hero Banner
          const backdropItems = trendRes.value.filter((i) => i.backdrop_path);
          const randomIndex = Math.floor(Math.random() * Math.min(5, backdropItems.length));
          setFeatured(backdropItems[randomIndex] || trendRes.value[0]);
        }
        if (top10Res.status === "fulfilled") setTop10(top10Res.value);
        if (bollyRes.status === "fulfilled") setBollywood(bollyRes.value);
        if (southRes.status === "fulfilled") setSouth(southRes.value);
        if (actionRes.status === "fulfilled") setAction(actionRes.value);
        if (seriesRes.status === "fulfilled") setSeries(seriesRes.value);
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-16 space-y-4">
      {/* 1. Hero Billboard Banner */}
      <HeroBanner
        movie={featured}
        onOpenModal={(movie) => setSelectedMovie(movie)}
      />

      {/* 2. Negative margin wrapper to smoothly overlap hero gradient like Netflix */}
      <div className="-mt-16 sm:-mt-24 relative z-20 space-y-6">
        {/* Continue Watching Row (Login-Free via localStorage) */}
        {continueList.length > 0 && (
          <MovieRow
            title="Continue Watching"
            items={continueList as any}
            onOpenModal={(movie) => setSelectedMovie(movie)}
            isLarge
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          items={trending}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />

        {/* Iconic Netflix Top 10 Today */}
        <Top10Row
          title="Top 10 Today"
          items={top10.length > 0 ? top10 : trending}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />

        {/* Popular Bollywood */}
        <MovieRow
          title="Popular Bollywood Hits"
          items={bollywood}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />

        {/* South Indian Cinema (Tollywood / Kollywood / Mollywood) */}
        <MovieRow
          title="South Indian Cinema (Telugu, Tamil, Malayalam)"
          items={south}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />

        {/* Action Blockbusters */}
        <MovieRow
          title="Action & Adventure Blockbusters"
          items={action}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />

        {/* Binge-Worthy TV Series */}
        <MovieRow
          title="Top Rated TV Series"
          items={series}
          onOpenModal={(movie) => setSelectedMovie(movie)}
        />
      </div>

      {/* Netflix Detail Modal */}
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
