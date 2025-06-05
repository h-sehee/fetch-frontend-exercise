const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

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

export interface GeoBoundingBox {
  bottom_left?: { lat: number; lon: number };
  top_right?: { lat: number; lon: number };
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export const searchLocations = async (
  params: {
    city?: string;
    states?: string[];
    geoBoundingBox?: GeoBoundingBox;
    size?: number;
    from?: number;
  }
): Promise<LocationSearchResponse> => {
  const res = await fetch(
    `${API_BASE_URL}/locations/search`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to search locations");
  }
  return res.json();
};
