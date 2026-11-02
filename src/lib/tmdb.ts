export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  original_language?: string;
}

export interface MediaDetails extends MediaItem {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  seasons?: {
    id: number;
    name: string;
    overview: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
  }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  similar?: {
    results: MediaItem[];
  };
}

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (
  path: string | null | undefined,
  size: "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
) => {
  if (!path) return "/placeholder-poster.png";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Client and server fetch helper
async function fetchFromApi(endpoint: string, params: Record<string, string> = {}) {
  const isServer = typeof window === "undefined";
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";

  let url: string;
  if (isServer) {
    // Server-side direct fetch to TMDB
    const u = new URL(`https://api.themoviedb.org/3/${endpoint}`);
    u.searchParams.set("api_key", apiKey);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    url = u.toString();
  } else {
    // Client-side via internal proxy route
    const u = new URL(`/api/tmdb/${endpoint}`, window.location.origin);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    url = u.toString();
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }
  return res.json();
}

// Category query functions
export async function getTrending(mediaType: "all" | "movie" | "tv" = "all"): Promise<MediaItem[]> {
  const data = await fetchFromApi(`trending/${mediaType}/day`);
  return data.results || [];
}

export async function getTop10Today(): Promise<MediaItem[]> {
  const data = await fetchFromApi("trending/all/day");
  return (data.results || []).slice(0, 10);
}

export async function getPopularMovies(): Promise<MediaItem[]> {
  const data = await fetchFromApi("movie/popular");
  return (data.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
}

export async function getBollywoodMovies(): Promise<MediaItem[]> {
  // Bollywood (Hindi language, India country, popular)
  const data = await fetchFromApi("discover/movie", {
    with_original_language: "hi",
    sort_by: "popularity.desc",
    "vote_count.gte": "20",
  });
  return (data.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
}

export async function getSouthIndianMovies(): Promise<MediaItem[]> {
  // South Indian (Telugu, Tamil, Malayalam, Kannada)
  const data = await fetchFromApi("discover/movie", {
    with_original_language: "te|ta|ml|kn",
    sort_by: "popularity.desc",
    "vote_count.gte": "15",
  });
  return (data.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
}

export async function getActionMovies(): Promise<MediaItem[]> {
  const data = await fetchFromApi("discover/movie", {
    with_genres: "28", // Action
    sort_by: "popularity.desc",
  });
  return (data.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
}

export async function getTopRatedSeries(): Promise<MediaItem[]> {
  const data = await fetchFromApi("tv/top_rated");
  return (data.results || []).map((m: any) => ({ ...m, media_type: "tv" }));
}

export async function getPopularSeries(): Promise<MediaItem[]> {
  const data = await fetchFromApi("tv/popular");
  return (data.results || []).map((m: any) => ({ ...m, media_type: "tv" }));
}

export async function getMediaDetails(type: "movie" | "tv", id: string | number): Promise<MediaDetails> {
  const data = await fetchFromApi(`${type}/${id}`, {
    append_to_response: "credits,videos,similar",
  });
  return { ...data, media_type: type };
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  const data = await fetchFromApi("search/multi", { query });
  return (data.results || []).filter(
    (item: any) => item.media_type === "movie" || item.media_type === "tv"
  );
}
