import { NextResponse } from "next/server";

const SCRAPER_URL = process.env.SCRAPER_SERVICE_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  try {
    const response = await fetch(`${SCRAPER_URL}/scrape/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const properties = await response.json();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
