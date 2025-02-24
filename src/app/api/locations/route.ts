import { NextResponse } from "next/server";

const SCRAPER_URL = process.env.SCRAPER_SERVICE_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  try {
    const response = await fetch(`${SCRAPER_URL}/scrape/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchText: search }),
    });

    const locations = await response.json();
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
