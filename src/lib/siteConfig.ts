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
  
  // Clean, high-speed embed servers (Vidrift & VidLink at the top for cleanest ad-free playback)
  servers: [
    {
      id: "vidrift",
      name: "Server 1 (Vidrift)",
      badge: "Clean & Fast",
      buildMovieUrl: (id) => `https://embed.vidrift.net/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://embed.vidrift.net/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidlink",
      name: "Server 2 (VidLink)",
      badge: "HD Multi-Audio",
      buildMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidly",
      name: "Server 3 (Vidly)",
      badge: "Fast Stream",
      buildMovieUrl: (id) => `https://vidly.pro/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidly.pro/tv/${id}/${s}/${e}`,
    },
    {
      id: "autoembed",
      name: "Server 4 (AutoEmbed)",
      badge: "Backup Server",
      buildMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidbolt",
      name: "Server 5 (Vidbolt)",
      badge: "Alternative",
      buildMovieUrl: (id) => `https://vidbolt.xyz/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidbolt.xyz/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidy",
      name: "Server 6 (Vidy)",
      badge: "Alternative",
      buildMovieUrl: (id) => `https://www.vidy.st/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://www.vidy.st/tv/${id}/${s}/${e}`,
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
