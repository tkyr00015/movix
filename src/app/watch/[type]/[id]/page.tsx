"use client";

import { useEffect, useState } from "react";
import PlayerView from "@/components/PlayerView";
import { MediaDetails, getMediaDetails } from "@/lib/tmdb";

export default function WatchPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { type, id } = params;
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validMediaType = type === "tv" ? "tv" : "movie";
    getMediaDetails(validMediaType, id)
      .then((data) => setDetails(data))
      .catch((err) => console.error("Error fetching watch title details:", err))
      .finally(() => setLoading(false));
  }, [type, id]);

  return (
    <div className="w-full min-h-screen bg-black">
      <PlayerView
        id={id}
        type={type === "tv" ? "tv" : "movie"}
        details={details}
      />
    </div>
  );
}
