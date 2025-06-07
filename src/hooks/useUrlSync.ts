import { Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
}

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
}: UrlSyncOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

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
}
