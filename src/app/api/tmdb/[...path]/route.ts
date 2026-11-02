import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_KEY = "4e44d9029b1270a757cddc766a1bcb63";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || DEFAULT_KEY;
    const path = params.path ? params.path.join("/") : "";
    const searchParams = new URL(request.url).searchParams;

    const url = new URL(`${TMDB_BASE_URL}/${path}`);
    url.searchParams.set("api_key", apiKey);

    // Forward any additional parameters (page, query, with_original_language, etc.)
    searchParams.forEach((value, key) => {
      if (key !== "api_key") {
        url.searchParams.set(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}
