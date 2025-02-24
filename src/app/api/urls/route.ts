import { NextResponse } from "next/server";

const SCRAPER_URL = process.env.SCRAPER_SERVICE_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get("operation") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const location = searchParams.get("location") || "";

  if (!location) {
    return NextResponse.json("");
  }

  try {
    const response = await fetch(`${SCRAPER_URL}/scrape/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, propertyType, location }),
    });

    const { url } = await response.json();
    return NextResponse.json(url);
  } catch (error) {
    console.error("Failed to generate search URL:", error);
    return NextResponse.json(
      { error: "Failed to generate search URL" },
      { status: 500 }
    );
  }
}
