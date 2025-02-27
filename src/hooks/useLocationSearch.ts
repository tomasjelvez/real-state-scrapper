import { useState, useCallback } from "react";
import { debounce } from "@/utils/debounce";

export const useLocationSearch = () => {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const searchLocations = async (text: string): Promise<void> => {
    if (!text || text.length < 3) {
      setLocationOptions([]);
      return;
    }
    setIsLoadingLocations(true);
    try {
      console.log("Searching locations for", text);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SCRAPING_SERVICE_URL
        }/api/locations?search=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      console.log("Locations found:", data);
      setLocationOptions(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchLocations, 1000), []);

  const handleLocationSearch = useCallback(
    (text: string): void => {
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  return { locationOptions, isLoadingLocations, handleLocationSearch };
};
