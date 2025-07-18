import { Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Options for synchronizing filter/search state with the URL.
 */
interface UrlSyncOptions {
  selectedBreeds: string[];
  setSelectedBreeds: Dispatch<SetStateAction<string[]>>;

  ageRange: [number, number];
  minAge: number;
  maxAge: number;
  setAgeRange: Dispatch<SetStateAction<[number, number]>>;

  userZip: string;
  setUserZip: Dispatch<SetStateAction<string>>;

  radiusMeters: number | null;
  setRadiusMeters: Dispatch<SetStateAction<number | null>>;

  selectedStates: string[];
  setSelectedStates: Dispatch<SetStateAction<string[]>>;

  sortBy: string;
  setSortBy: Dispatch<SetStateAction<"age" | "location" | "name" | "breed">>;

  sortDir: string;
  setSortDir: Dispatch<SetStateAction<"desc" | "asc">>;

  from: number;
  setFrom: Dispatch<SetStateAction<number>>;

  setStateZips: Dispatch<React.SetStateAction<string[]>>;
  setZipCodesInRadius: Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Custom hook to synchronize filter/search state with the URL query parameters.
 * - Reads initial state from URL on mount.
 * - Updates URL when state changes.
 * - Supports reset via ?reset=1 param.
 */
export function useUrlSync({
  selectedBreeds,
  setSelectedBreeds,
  ageRange,
  minAge,
  maxAge,
  setAgeRange,
  userZip,
  setUserZip,
  radiusMeters,
  setRadiusMeters,
  selectedStates,
  setSelectedStates,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  from,
  setFrom,
  setStateZips,
  setZipCodesInRadius,
}: UrlSyncOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  // On mount: initialize state from URL query parameters
  useEffect(() => {
    const b = searchParams.get("breeds");
    if (b) setSelectedBreeds(b.split(","));

    const age = searchParams.get("age");
    if (age) {
      const [min, max] = age.split("-").map(Number);
      setAgeRange([min, max]);
    }

    const zip = searchParams.get("zip");
    if (zip) setUserZip(zip);

    const rad = searchParams.get("radius");
    if (rad) setRadiusMeters(Number(rad));

    const states = searchParams.get("states");
    if (states) setSelectedStates(states.split(","));

    const sb = searchParams.get("sortBy");
    if (sb && ["age", "location", "name", "breed"].includes(sb))
      setSortBy(sb as "age" | "location" | "name" | "breed");

    const sd = searchParams.get("sortDir");
    if (sd === "asc" || sd === "desc") setSortDir(sd);

    const f = searchParams.get("from");
    if (f) setFrom(Number(f));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When state changes: update URL query parameters
  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedBreeds.length) params.breeds = selectedBreeds.join(",");
    if (ageRange[0] !== minAge || ageRange[1] !== maxAge)
      params.age = `${ageRange[0]}-${ageRange[1]}`;
    if (userZip) params.zip = userZip;
    if (radiusMeters) params.radius = radiusMeters.toString();
    if (selectedStates.length) params.states = selectedStates.join(",");
    if (sortBy) params.sortBy = sortBy;
    if (sortDir) params.sortDir = sortDir;
    if (from) params.from = from.toString();

    setSearchParams(params, { replace: true });
  }, [
    selectedBreeds,
    ageRange,
    userZip,
    radiusMeters,
    selectedStates,
    sortBy,
    sortDir,
    from,
    minAge,
    maxAge,
    setSearchParams,
  ]);

  // Reset pagination when sort changes
  useEffect(() => {
    setFrom(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortDir]);

  // Handle reset via ?reset=1 param in URL
  useEffect(() => {
    if (searchParams.get("reset") === "1") {
      setSelectedBreeds([]);
      setAgeRange([minAge, maxAge]);
      setUserZip("");
      setRadiusMeters(0);
      setZipCodesInRadius([]);
      setSelectedStates([]);
      setStateZips([]);
      setFrom(0);
      setSortBy("breed");
      setSortDir("asc");
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
