import { NextResponse } from "next/server";
import { scrapeSearchUrl } from "@/lib/scrapers/urlScraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get("operation") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const location = searchParams.get("location") || "";
  if (location.length > 0) {
    const url = await scrapeSearchUrl(operation, propertyType, location);
    return NextResponse.json(url);
  } else {
    const url = ``;
    return NextResponse.json(url);
  }
}
