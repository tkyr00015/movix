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
  
  // Clean, Low-Ad Players (Vidrift, CineSrc, VidCore, VidLink)
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
      id: "vidcore",
      name: "Server 3 (VidCore)",
      badge: "Vidrift Engine • 1 Ad Max",
      buildMovieUrl: (id) => `https://vidcore.org/embed/movie/${id}`,
      buildTvUrl: (id, s, e) => `https://vidcore.org/embed/tv/${id}/${s}/${e}`,
    },
    {
      id: "vidlink",
      name: "Server 4 (VidLink)",
      badge: "Fast HD • Minimal Ads",
      buildMovieUrl: (id) => `https://vidlink.pro/movie/${id}?primaryColor=e50914`,
      buildTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914`,
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
