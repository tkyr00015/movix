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
  
  // 100% Clean & Ad-Free Servers Only (No Sandbox Traps, No Intrusive Popups)
  servers: [
    {
      id: "vidlink",
      name: "Server 1 (VidLink - AdFree)",
      badge: "HD Multi-Audio",
      buildMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidrift",
      name: "Server 2 (Vidrift - Fast)",
      badge: "Clean Stream",
      buildMovieUrl: (id) => `https://embed.vidrift.net/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://embed.vidrift.net/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "autoembed",
      name: "Server 3 (AutoEmbed)",
      badge: "Clean Backup",
      buildMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "smashy",
      name: "Server 4 (Smashy)",
      badge: "Alternative",
      buildMovieUrl: (id) => `https://embed.smashystream.com/playere.php?tmdb=${id}`,
      buildTvUrl: (id, s, e) => `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`,
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
