import { useState } from "react";
import { Property } from "@/lib/types/property";
import { useRouter } from "next/navigation";

export const usePropertySearch = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchProperties = async (filters: {
    location: string;
    operation: string;
    propertyType: string;
    [key: string]: string;
  }) => {
    setIsLoading(true);
    let url: string | object = "";
    try {
      if (filters.location.length > 3) {
        const params = new URLSearchParams(filters);
        console.log("Searching URLfor", filters);
        const urlResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SCRAPING_SERVICE_URL}/api/urls?${params}`
        );
        url = await urlResponse.json();
      } else {
        const baseUrl = "https://www.portalinmobiliario.com";
        url = `${baseUrl}/${filters.operation}/${filters.propertyType}`;
      }
      console.log("URL found:", url);
      if (typeof url === "object" && "error" in url) {
        console.error("Error fetching URL:", (url as { error: string }).error);
        setProperties([]);
        return;
      }

      console.log("Searching properties for:", url);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SCRAPING_SERVICE_URL
        }/api/properties?url=${encodeURIComponent(url.toString())}`
      );
      console.log("Response:", response);

      if (!response.ok && response.status === 401) {
        router.push("/auth");
        return;
      }

      const data = await response.json();
      setProperties(data);

      // Save search history
      await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: JSON.stringify(filters) }),
      });

      return data;
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { properties, isLoading, searchProperties };
};
