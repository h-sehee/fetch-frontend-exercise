export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchResponse {
    resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export const fetchBreeds = async (): Promise<string[]> => {
  const res = await fetch("/dogs/breeds", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to load breeds");
  }
  return res.json();
};

export const searchDogs = async (
  breeds: string[],
  size: number,
  from: number,
  sort: string
): Promise<SearchResponse> => {
  const params = new URLSearchParams();
  if (breeds.length > 0) {
    breeds.forEach((b) => params.append("breeds", b));
  }
  params.append("size", size.toString());
  params.append("from", from.toString());
  params.append("sort", sort);

  const url = `/dogs/search?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to search dogs");
  }
  return res.json();
};

export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const res = await fetch("/dogs", {
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

export const generateMatch = async (ids: string[]): Promise<string> => {
  const res = await fetch("/dogs/match", {
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
