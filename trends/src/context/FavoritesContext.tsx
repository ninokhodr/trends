import React, { createContext, useContext, useState, useEffect } from "react";

// Interface defining the structure of a favorite item
export interface FavoriteItem {
  stockSymbol1: string;
  stockSymbol2?: string;
  startDate: string;
  endDate: string;
  timeframe: string;
}

// Defining the type for the Favorites Context
interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (favorite: FavoriteItem) => void;
  removeFavorite: (index: number) => void;
  updateFavorite: (index: number, updatedFavorite: FavoriteItem) => void;
  isFavorite: (symbol: string) => boolean;
  selectedFavorite: FavoriteItem | null;
  selectFavoriteForEdit: (favorite: FavoriteItem | null) => void;
}

// Create the context for Favorites, initially undefined
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Hook for accessing the Favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

// Provider component to wrap around components that need access to Favorites context
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);

  // Load favorites from local storage when the component mounts
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Update local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Add a new favorite to the list
  const addFavorite = (favorite: FavoriteItem) => {
    setFavorites([...favorites, favorite]);
  };

  // Remove a favorite based on index
  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  // Update an existing favorite based on index
  const updateFavorite = (index: number, updatedFavorite: FavoriteItem) => {
    setFavorites(favorites.map((fav, i) => (i === index ? updatedFavorite : fav)));
  };

  // Check if a symbol is already in favorites
  const isFavorite = (symbol: string) => favorites.some((fav) => fav.stockSymbol1 === symbol);

  // Set a favorite item for editing
  const selectFavoriteForEdit = (favorite: FavoriteItem | null) => {
    setSelectedFavorite(favorite);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        updateFavorite,
        isFavorite,
        selectedFavorite,
        selectFavoriteForEdit,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
