// API base URL for the Fetch take-home API
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

/**
 * Logs in a user with the given name and email.
 * Sends a POST request to the /auth/login endpoint.
 * @param name - User's name
 * @param email - User's email
 * @returns The fetch Response object
 * @throws Error if login fails
 */
export const login = async (name: string, email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response;
};

/**
 * Logs out the current user.
 * Sends a POST request to the /auth/logout endpoint.
 * @throws Error if logout fails
 */
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};

/**
 * Checks if the user is currently logged in by requesting a protected resource.
 * @returns true if logged in, false otherwise
 */
export const checkLogin = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    });

    return response.ok;
  } catch (err) {
    return false;
  }
};
