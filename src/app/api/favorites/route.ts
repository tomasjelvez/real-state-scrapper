import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log(body);
    const propertyId = body.propertyId;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.email,
          propertyId: propertyId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return NextResponse.json({ isFavorite: false });
    }

    await prisma.favorite.create({
      data: {
        userId: session.user.email,
        propertyId: propertyId,
      },
    });

    return NextResponse.json({ isFavorite: true });
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("id");

  if (!propertyId) {
    return new Response("Property ID required", { status: 400 });
  }

  await prisma.favorite.delete({
    where: {
      id: propertyId,
    },
  });

  return new Response(null, { status: 204 });
}

// Add endpoint to get favorite status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyIds = searchParams.getAll("propertyId");

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.email,
        propertyId: { in: propertyIds },
      },
      select: {
        propertyId: true,
      },
    });

    // Ensure we always return an object
    const favoriteStatus = favorites.reduce(
      (acc, fav) => ({
        ...acc,
        [fav.propertyId]: true,
      }),
      {} as Record<string, boolean>
    );

    return NextResponse.json(favoriteStatus);
  } catch (error) {
    console.error("Error in GET /api/favorites:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
