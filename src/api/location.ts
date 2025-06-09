// API base URL for the Fetch take-home API
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * Represents a geographic location with zip code and coordinates.
 */
export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

/**
 * Fetches location details for an array of zip codes.
 * @param zipCodes - Array of zip code strings
 * @returns Promise resolving to an array of Location objects
 * @throws Error if the request fails
 */
export const fetchLocationsByZip = async (
  zipCodes: string[]
): Promise<Location[]> => {
  const res = await fetch(`${API_BASE_URL}/locations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zipCodes),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch locations by zip");
  }
  return res.json();
};

/**
 * Represents a bounding box for geographic search.
 */
export interface GeoBoundingBox {
  bottom_left?: { lat: number; lon: number };
  top_right?: { lat: number; lon: number };
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

/**
 * Response type for location search API.
 */
export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

/**
 * Searches for locations by city, state, or geographic bounding box.
 * @param params - Search parameters (city, states, geoBoundingBox, size, from)
 * @returns Promise resolving to a LocationSearchResponse
 * @throws Error if the request fails
 */
export const searchLocations = async (params: {
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  size?: number;
  from?: number;
}): Promise<LocationSearchResponse> => {
  const res = await fetch(`${API_BASE_URL}/locations/search`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error("Failed to search locations");
  }
  return res.json();
};
