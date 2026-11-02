export interface ServerProvider {
  id: string;
  name: string;
  buildMovieUrl: (tmdbId: string | number) => string;
  buildTvUrl: (tmdbId: string | number, season: number, episode: number) => string;
  badge?: string;
}

export const siteConfig = {
  name: "Movix",
  tagline: "Watch Movies & TV Shows Online Free",
  description: "Unlimited streaming of the latest Bollywood, Hollywood, and South Indian movies and series.",
  accentColor: "#E50914", // Netflix Red
  
  // 100% Verified, Working & Active Servers (No Vidly, No AutoEmbed)
  servers: [
    {
      id: "vidlink",
      name: "Server 1 (VidLink)",
      badge: "HD Multi-Audio",
      buildMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidrift",
      name: "Server 2 (Vidrift)",
      badge: "Fast HD",
      buildMovieUrl: (id) => `https://embed.vidrift.net/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://embed.vidrift.net/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidnest",
      name: "Server 3 (VidNest)",
      badge: "Clean & Ultra-Fast",
      buildMovieUrl: (id) => `https://vidnest.fun/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
    },
  ] as ServerProvider[],

  navigation: [
    { label: "Home", href: "/" },
    { label: "TV Shows", href: "/browse/tv" },
    { label: "Movies", href: "/browse/movies" },
    { label: "Bollywood", href: "/browse/bollywood" },
    { label: "South Indian", href: "/browse/south" },
    { label: "New & Popular", href: "/browse/trending" },
    { label: "My List", href: "/my-list" },
  ],
};
