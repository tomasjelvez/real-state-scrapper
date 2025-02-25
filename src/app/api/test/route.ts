// test scraping service endpoint

import { NextResponse } from "next/server";

const SCRAPING_SERVICE_URL = process.env.SCRAPING_SERVICE_URL;

export async function GET() {
  try {
    const response = await fetch(`${SCRAPING_SERVICE_URL}/test`);
    const data = await response.json();
    console.log("data", data);
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "No se encontraron propiedades" },
        { status: response.status }
      );
    }
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Error al buscar propiedades" },
      { status: 500 }
    );
  }
}
