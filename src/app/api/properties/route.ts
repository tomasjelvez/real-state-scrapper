import { NextResponse } from "next/server";
import { scrapeProperties } from "@/lib/scrapers/propertyScaper";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";
    const properties = await scrapeProperties(url);

    if (!properties.length) {
      return NextResponse.json(
        { message: "No se encontraron propiedades" },
        { status: 404 }
      );
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Error al buscar propiedades" },
      { status: 500 }
    );
  }
}
