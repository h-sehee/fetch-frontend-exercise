import { useEffect, useState } from "react";
import {
  fetchBreeds,
  searchDogs,
  fetchDogsByIds,
  fetchLocationsByZip,
  searchLocations,
  Dog,
  Location,
} from "../api";

/**
 * Custom hook to manage dog search state and logic.
 * Handles filters, sorting, pagination, and fetching of dog and location data.
 * @param toast - Toast notification handler (from Chakra UI)
 * @param PAGE_SIZE - Number of results per page
 */
export function useDogSearch(toast: any, PAGE_SIZE: number) {
  // Breed and filter state
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 0]);
  const [userZip, setUserZip] = useState<string>("");
  const [radiusMeters, setRadiusMeters] = useState<number | null>(null);
  const [zipCodesInRadius, setZipCodesInRadius] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [stateZips, setStateZips] = useState<string[]>([]);
  const [zipToLocation, setZipToLocation] = useState<Record<string, Location>>(
    {}
  );

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState<"breed" | "name" | "age" | "location">(
    "breed"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [from, setFrom] = useState<number>(0);

  // Search results state
  const [dogResults, setDogResults] = useState<Dog[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all breeds on mount
  useEffect(() => {
    const fetchAllBreeds = async () => {
      try {
        const data = await fetchBreeds();
        setBreeds(data.sort());
      } catch {
        toast({
          title: "Error",
          description: "Failed to load breeds.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    // Fetch min and max age for dogs
    const fetchMinMaxAge = async () => {
      try {
        const resMin = await searchDogs([], 1, 0, "age:asc");
        if (resMin.resultIds.length > 0) {
          const [dogMin] = await fetchDogsByIds(resMin.resultIds);
          setMinAge(dogMin.age);
        } else {
          setMinAge(0);
        }
        const resMax = await searchDogs([], 1, 0, "age:desc");
        if (resMax.resultIds.length > 0) {
          const [dogMax] = await fetchDogsByIds(resMax.resultIds);
          setMaxAge(dogMax.age);
        } else {
          setMaxAge(0);
        }
      } catch {
        setMinAge(0);
        setMaxAge(0);
      }
    };

    fetchAllBreeds();
    fetchMinMaxAge();
  }, [toast]);

  // Update age range when min/max age changes
  useEffect(() => {
    if (minAge <= maxAge) {
      setAgeRange([minAge, maxAge]);
    }
  }, [minAge, maxAge]);

  // Fetch zip codes for selected states
  useEffect(() => {
    const fetchStateZips = async () => {
      if (!selectedStates) {
        setStateZips([]);
        return;
      }
      try {
        const { results } = await searchLocations({
          states: selectedStates,
          size: 10000,
        });
        setStateZips(results.map((r) => r.zip_code));
      } catch (err) {
        setStateZips([]);
      }
    };
    fetchStateZips();
  }, [selectedStates]);

  // Fetch zip codes within a radius of the user's zip code
  useEffect(() => {
    const fetchNearbyZips = async () => {
      if (!userZip) {
        setZipCodesInRadius([]);
        return;
      }
      try {
        const locations: Location[] = await fetchLocationsByZip([userZip]);
        if (locations.length === 0) {
          setZipCodesInRadius([]);
          return;
        }
        if (!radiusMeters) return;
        const { latitude: userLat, longitude: userLon } = locations[0];
        const deltaLat = radiusMeters / 111000;
        const deltaLon =
          radiusMeters / (111000 * Math.cos((userLat * Math.PI) / 180));
        const { results } = await searchLocations({
          geoBoundingBox: {
            bottom_left: { lat: userLat - deltaLat, lon: userLon - deltaLon },
            top_right: { lat: userLat + deltaLat, lon: userLon + deltaLon },
          },
          size: 10000,
        });
        setZipCodesInRadius(results.map((r) => r.zip_code));
      } catch (err) {
        setZipCodesInRadius([]);
      }
    };
    fetchNearbyZips();
  }, [userZip, radiusMeters]);

  // Main dog search effect: runs when filters, sorting, or pagination changes
  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const sortParam = `${sortBy}:${sortDir}`;
        const [minFilter, maxFilter] = ageRange;
        let zipFilter: string[] | undefined;
        if (zipCodesInRadius.length > 0 && stateZips.length > 0) {
          zipFilter = zipCodesInRadius.filter((z) => stateZips.includes(z));
        } else if (zipCodesInRadius.length > 0) {
          zipFilter = zipCodesInRadius;
        } else if (stateZips.length > 0) {
          zipFilter = stateZips;
        } else {
          zipFilter = [];
        }
        if (zipFilter && zipFilter.length > 993) {
          zipFilter = zipFilter.slice(0, 993);
        }
        const response = await searchDogs(
          selectedBreeds,
          PAGE_SIZE,
          from,
          sortParam,
          minFilter > minAge ? minFilter : undefined,
          maxFilter < maxAge ? maxFilter : undefined,
          zipFilter
        );
        setTotal(response.total);
        let dogs: Dog[] = [];
        if (response.resultIds.length > 0) {
          dogs = await fetchDogsByIds(response.resultIds);
        }
        setDogResults(dogs);
      } catch (err) {
        setDogResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    if (maxAge > 0) {
      doSearch();
    }
  }, [
    selectedBreeds,
    ageRange,
    zipCodesInRadius,
    stateZips,
    sortBy,
    sortDir,
    from,
    minAge,
    maxAge,
    PAGE_SIZE,
  ]);

  // Fetch location details for all dogs in the current results
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const zips = Array.from(
        new Set(dogResults.map((d) => d.zip_code))
      ).filter(Boolean);
      if (zips.length === 0) return;
      try {
        const locations = await fetchLocationsByZip(zips);
        const map: Record<string, Location> = {};
        for (const loc of locations) {
          if (!loc) continue;
          map[loc.zip_code] = loc;
        }
        setZipToLocation(map);
      } catch (err) {
        console.error("Failed to fetch location data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [dogResults]);

  // Return all state and setters for use in components
  return {
    breeds,
    setBreeds,
    selectedBreeds,
    setSelectedBreeds,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    ageRange,
    setAgeRange,
    userZip,
    setUserZip,
    radiusMeters,
    setRadiusMeters,
    zipCodesInRadius,
    setZipCodesInRadius,
    selectedStates,
    setSelectedStates,
    stateZips,
    setStateZips,
    zipToLocation,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    from,
    setFrom,
    dogResults,
    total,
    loading,
  };
}
