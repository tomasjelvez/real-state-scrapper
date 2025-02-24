import { NextResponse } from "next/server";

const SCRAPING_SERVICE_URL = process.env.SCRAPING_SERVICE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  if (search.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `${SCRAPING_SERVICE_URL}/api/locations?search=${encodeURIComponent(
        search
      )}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
