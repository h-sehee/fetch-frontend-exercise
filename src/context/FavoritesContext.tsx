import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Dog, fetchDogsByIds } from "../api";

/**
 * FavoritesContextType defines the shape of the favorites context.
 */
interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (dogId: string) => void;
  isFavOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  favoriteDogsDetails: Dog[];
}

/**
 * Context for managing favorite dogs ("Barkmarks").
 */
const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_KEY = "pawfetch:favorites";

/**
 * FavoritesProvider manages the favorites state and provides actions to update it.
 * - Persists favorites in sessionStorage.
 * - Fetches dog details for all favorite dog IDs.
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  // State for storing favorite dog IDs
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // State for drawer open/close
  const [isFavOpen, setIsFavOpen] = useState<boolean>(false);

  // State for storing details of favorite dogs
  const [favoriteDogsDetails, setFavoriteDogsDetails] = useState<Dog[]>([]);

  /**
   * Toggles a dog as favorite/unfavorite.
   */
  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dogId)) newSet.delete(dogId);
      else newSet.add(dogId);
      return newSet;
    });
  };

  /**
   * Opens the favorites drawer.
   */
  const openFavorites = () => setIsFavOpen(true);

  /**
   * Closes the favorites drawer.
   */
  const closeFavorites = () => setIsFavOpen(false);

  // Persist favorites to sessionStorage whenever they change
  useEffect(() => {
    try {
      const arr = Array.from(favorites);
      sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error("Failed to save favorites", err);
    }
  }, [favorites]);

  // Fetch details for all favorite dogs whenever favorites change
  useEffect(() => {
    if (favorites.size === 0) {
      setFavoriteDogsDetails([]);
      return;
    }
    const idsArray = Array.from(favorites);
    fetchDogsByIds(idsArray)
      .then((dogs) => {
        setFavoriteDogsDetails(dogs);
      })
      .catch((err) => {
        console.error("Failed to fetch favorite dogs:", err);
      });
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavOpen,
        openFavorites,
        closeFavorites,
        favoriteDogsDetails,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom hook to access the favorites context.
 * Throws if used outside of FavoritesProvider.
 */
export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};
