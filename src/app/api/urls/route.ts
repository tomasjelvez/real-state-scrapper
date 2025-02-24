import { NextResponse } from "next/server";

const SCRAPING_SERVICE_URL = process.env.SCRAPING_SERVICE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get("operation") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const location = searchParams.get("location") || "";

  try {
    if (location.length > 0) {
      const response = await fetch(
        `${SCRAPING_SERVICE_URL}/api/urls?` +
          `operation=${encodeURIComponent(operation)}&` +
          `propertyType=${encodeURIComponent(propertyType)}&` +
          `location=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json("");
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
