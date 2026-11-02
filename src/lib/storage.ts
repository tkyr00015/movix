import { MediaItem } from "./tmdb";

export interface WatchProgress {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  season?: number;
  episode?: number;
  lastWatched: number;
}

const WATCHLIST_KEY = "movix_watchlist";
const PROGRESS_KEY = "movix_continue_watching";

// Watchlist Helpers
export function getWatchlist(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function isInWatchlist(id: number): boolean {
  const list = getWatchlist();
  return list.some((item) => item.id === id);
}

export function toggleWatchlist(item: MediaItem): boolean {
  const list = getWatchlist();
  const existsIndex = list.findIndex((x) => x.id === item.id);
  let updatedList: MediaItem[];

  if (existsIndex > -1) {
    updatedList = list.filter((x) => x.id !== item.id);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedList));
    return false; // Removed
  } else {
    updatedList = [item, ...list];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedList));
    return true; // Added
  }
}

// Continue Watching Helpers
export function getContinueWatching(): WatchProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveWatchProgress(progress: Omit<WatchProgress, "lastWatched">) {
  if (typeof window === "undefined") return;
  const list = getContinueWatching();
  const filtered = list.filter((x) => x.id !== progress.id);
  const updated: WatchProgress[] = [
    { ...progress, lastWatched: Date.now() },
    ...filtered,
  ].slice(0, 20); // Keep last 20 items

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
}
