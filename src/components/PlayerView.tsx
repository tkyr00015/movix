"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Server, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { siteConfig, ServerProvider } from "@/lib/siteConfig";
import { MediaDetails, getImageUrl } from "@/lib/tmdb";
import { saveWatchProgress } from "@/lib/storage";

interface PlayerViewProps {
  id: string;
  type: "movie" | "tv";
  details: MediaDetails | null;
}

export default function PlayerView({ id, type, details }: PlayerViewProps) {
  const [selectedServer, setSelectedServer] = useState<ServerProvider>(siteConfig.servers[0]);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [iframeKey, setIframeKey] = useState(0);

  const title = details?.title || details?.name || "Movie";

  // Build the embed URL based on media type
  const streamUrl =
    type === "tv"
      ? selectedServer.buildTvUrl(id, season, episode)
      : selectedServer.buildMovieUrl(id);

  // Save to "Continue Watching" automatically
  useEffect(() => {
    if (details) {
      saveWatchProgress({
        id: details.id,
        type,
        title,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        season: type === "tv" ? season : undefined,
        episode: type === "tv" ? episode : undefined,
      });
    }
  }, [id, type, season, episode, details, title]);

  const totalSeasons = details?.number_of_seasons || 1;
  const currentSeasonData = details?.seasons?.find((s) => s.season_number === season);
  const totalEpisodes = currentSeasonData?.episode_count || 12;

  const handleNextEpisode = () => {
    if (episode < totalEpisodes) {
      setEpisode(episode + 1);
    } else if (season < totalSeasons) {
      setSeason(season + 1);
      setEpisode(1);
    }
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Header Bar */}
      <div className="h-14 px-4 sm:px-6 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Browse</span>
          </Link>

          <span className="text-zinc-600">|</span>

          <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
            {title}
            {type === "tv" && (
              <span className="text-zinc-400 text-xs sm:text-sm font-normal ml-2">
                (S{season}:E{episode})
              </span>
            )}
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          title="Reload Player"
          className="text-zinc-400 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Video Frame */}
      <div className="flex-1 w-full bg-black relative flex items-center justify-center">
        <iframe
          key={`${selectedServer.id}-${streamUrl}-${iframeKey}`}
          src={streamUrl}
          className="w-full h-full min-h-[50vh] sm:min-h-[70vh] border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          // Strict ad-killing sandbox: blocks popups and redirects, allows video play
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          referrerPolicy="origin"
        />
      </div>

      {/* Controls & Server Switcher Footer */}
      <div className="bg-zinc-950 border-t border-zinc-800 p-4 sm:p-6 space-y-4">
        {/* TV Show Season & Episode Navigation */}
        {type === "tv" && (
          <div className="space-y-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Season Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Season:
                </span>
                <select
                  value={season}
                  onChange={(e) => {
                    setSeason(Number(e.target.value));
                    setEpisode(1);
                  }}
                  className="bg-zinc-900 border border-zinc-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded focus:outline-none focus:border-netflix-red"
                >
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>
                      Season {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Next Episode Quick Button */}
              {(episode < totalEpisodes || season < totalSeasons) && (
                <button
                  onClick={handleNextEpisode}
                  className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded transition-all"
                >
                  Next Episode
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Episode Number Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
                <button
                  key={ep}
                  onClick={() => setEpisode(ep)}
                  className={`flex-none px-3.5 py-1.5 rounded text-xs font-bold transition-all ${
                    episode === ep
                      ? "bg-netflix-red text-white shadow-md scale-105"
                      : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  EP {ep}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Server Switcher Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2">
              <Server className="w-3.5 h-3.5" />
              Servers:
            </span>

            {siteConfig.servers.map((server) => {
              const active = selectedServer.id === server.id;
              return (
                <button
                  key={server.id}
                  onClick={() => setSelectedServer(server)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-white text-black shadow-md scale-105"
                      : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {server.name}
                  {server.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                        active ? "bg-black text-white" : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {server.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Buffering or not loading? Switch to Server 2 or Server 3 above.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
