import { useState, useEffect } from "react";
import { Property } from "@/lib/types/property";

export const useFavorites = (properties: Property[]) => {
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>(
    {}
  );

  const fetchFavoriteStatus = async (properties: Property[]) => {
    try {
      const ids = properties
        .map((p) => p.propertyId)
        .filter((id): id is string => id !== undefined && id !== null);

      if (ids.length === 0) return;

      const url = new URL("/api/favorites", window.location.origin);
      ids.forEach((id) => url.searchParams.append("propertyId", id));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const status = await response.json();
      setFavoriteStatus(status);
    } catch (error) {
      console.error("Error fetching favorite status:", error);
      setFavoriteStatus({}); // Reset on error
    }
  };

  const handleToggleFavorite = async (propertyId: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const { isFavorite } = await response.json();
      setFavoriteStatus((prev) => ({
        ...prev,
        [propertyId]: isFavorite,
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    if (properties.length > 0) {
      fetchFavoriteStatus(properties);
    }
  }, [properties]);

  return { favoriteStatus, handleToggleFavorite };
};
