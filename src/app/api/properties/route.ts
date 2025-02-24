import { NextResponse } from "next/server";

const SCRAPING_SERVICE_URL = process.env.SCRAPING_SERVICE_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";

    const response = await fetch(
      `${SCRAPING_SERVICE_URL}/api/properties?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "No se encontraron propiedades" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Error al buscar propiedades" },
      { status: 500 }
    );
  }
}
