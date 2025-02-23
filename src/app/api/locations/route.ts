import { NextResponse } from "next/server";
import { scrapeLocations } from "@/lib/scrapers/locationScraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  if (search.length < 3) {
    return NextResponse.json([]);
  }

  const locations = await scrapeLocations(search);
  return NextResponse.json(locations);
}
