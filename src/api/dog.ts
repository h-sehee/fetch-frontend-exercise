// API base URL for the Fetch take-home API
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * Dog entity interface.
 */
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

/**
 * Response format for dog search API.
 */
export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

/**
 * Fetches all available dog breeds.
 * @returns Array of breed names
 * @throws Error if the request fails
 */
export const fetchBreeds = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/dogs/breeds`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to load breeds");
  }
  return res.json();
};

/**
 * Searches for dogs based on filters and pagination.
 * @param breeds - Array of breed names to filter
 * @param size - Number of results per page
 * @param from - Offset for pagination
 * @param sort - Sort order
 * @param ageMin - Minimum age filter (optional)
 * @param ageMax - Maximum age filter (optional)
 * @param zipCodes - Array of zip codes to filter (optional)
 * @returns SearchResponse object
 * @throws Error if the request fails
 */
export const searchDogs = async (
  breeds: string[],
  size: number,
  from: number,
  sort: string,
  ageMin?: number,
  ageMax?: number,
  zipCodes: string[] = []
): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  if (breeds.length > 0) {
    breeds.forEach((b) => params.append("breeds", b));
  }
  if (zipCodes.length > 0) {
    zipCodes.forEach((z) => params.append("zipCodes", z));
  }
  if (typeof ageMin === "number") {
    params.set("ageMin", ageMin.toString());
  }
  if (typeof ageMax === "number") {
    params.set("ageMax", ageMax.toString());
  }
  params.append("size", size.toString());
  params.append("from", from.toString());
  params.append("sort", sort);

  const url = `${API_BASE_URL}/dogs/search?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to search dogs");
  }
  return res.json();
};

/**
 * Fetches dog details for the given array of dog IDs.
 * @param ids - Array of dog IDs
 * @returns Array of Dog objects
 * @throws Error if the request fails
 */
export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const res = await fetch(`${API_BASE_URL}/dogs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch dog details");
  }
  return res.json();
};

/**
 * Generates a match from the given favorite dog IDs.
 * @param ids - Array of favorite dog IDs
 * @returns The matched dog's ID as a string
 * @throws Error if the request fails
 */
export const generateMatch = async (ids: string[]): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/dogs/match`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  if (!res.ok) {
    throw new Error("Failed to generate match");
  }
  const data = (await res.json()) as { match: string };
  return data.match;
};
