import { useEffect, useState, useMemo } from "react";
import { fetchLocationsByZip, Location } from "../api";

/**
 * Custom hook to fetch and map location details for an array of zip codes.
 * Returns a map of zip code to Location and a loading state.
 * @param zipCodes - Array of zip code strings
 */
export function useDogLocations(zipCodes: string[]) {
  const [locationsMap, setLocationsMap] = useState<Record<string, Location>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Memoized key to avoid unnecessary fetches
  const zipKey = useMemo(() => zipCodes.filter(Boolean).join(","), [zipCodes]);

  useEffect(() => {
    const codes = zipKey ? zipKey.split(",") : [];
    if (codes.length === 0) {
      setLocationsMap({});
      return;
    }
    let canceled = false;

    (async () => {
      setLoading(true);
      try {
        const list = await fetchLocationsByZip(codes);
        if (canceled) return;
        const map: Record<string, Location> = {};
        list.forEach((loc) => {
          if (loc) map[loc.zip_code] = loc;
        });
        setLocationsMap((prev) => {
          const prevKeys = Object.keys(prev);
          const newKeys = Object.keys(map);
          if (
            prevKeys.length === newKeys.length &&
            newKeys.every((k) => prev[k]?.zip_code === map[k]?.zip_code)
          ) {
            return prev;
          }
          return map;
        });
      } catch {
        if (!canceled) setLocationsMap({});
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    // Cleanup to prevent state updates on unmounted component
    return () => {
      canceled = true;
    };
  }, [zipKey]);

  return { locationsMap, loading };
}

/**
 * Custom hook to fetch a single location by zip code.
 * Returns the location object and loading state.
 * @param zipCode - Zip code string
 */
export function useDogLocation(zipCode?: string) {
  const zipArray = zipCode ? [zipCode] : [];
  const { locationsMap, loading } = useDogLocations(zipArray);
  return {
    location: zipCode ? locationsMap[zipCode] : undefined,
    loading,
  };
}
