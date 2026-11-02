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
  
  // Clean, Low-Ad Players (Vidrift, CineSrc & Sibling Clusters)
  servers: [
    {
      id: "vidrift",
      name: "Server 1 (Vidrift)",
      badge: "Best • 1 Ad Max",
      buildMovieUrl: (id) => `https://embed.vidrift.net/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://embed.vidrift.net/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "cinesrc",
      name: "Server 2 (CineSrc)",
      badge: "Clean • Minimal Ads",
      buildMovieUrl: (id) => `https://cinesrc.st/embed/movie/${id}?color=%23e50914`,
      buildTvUrl: (id, s, e) => `https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}&color=%23e50914`,
    },
    {
      id: "vidbolt",
      name: "Server 3 (Vidbolt)",
      badge: "Ultra Fast • 1 Ad Max",
      buildMovieUrl: (id) => `https://vidbolt.xyz/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidbolt.xyz/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidy",
      name: "Server 4 (Vidy)",
      badge: "Multi-Sub • 1 Ad Max",
      buildMovieUrl: (id) => `https://www.vidy.st/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://www.vidy.st/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidsrc-su",
      name: "Server 5 (VidSrc SU)",
      badge: "Backup HD",
      buildMovieUrl: (id) => `https://vidsrc.su/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
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
