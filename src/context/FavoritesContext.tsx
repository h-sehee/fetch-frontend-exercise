import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Dog, fetchDogsByIds } from "../api/dog";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (dogId: string) => void;
  isFavOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  favoriteDogsDetails: Dog[];
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isFavOpen, setIsFavOpen] = useState<boolean>(false);
  const [favoriteDogsDetails, setFavoriteDogsDetails] = useState<Dog[]>([]);

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dogId)) newSet.delete(dogId);
      else newSet.add(dogId);
      return newSet;
    });
  };

  const openFavorites = () => setIsFavOpen(true);
  const closeFavorites = () => setIsFavOpen(false);

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

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};
