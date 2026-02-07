import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from './AuthContext';

type FavouritesContextType = {
  favourites: number[];
  toggleFavourite: (id: number) => void;
  clearFavourites: () => void;
};

export const FavouritesContext = createContext<FavouritesContextType | null>(
  null
);

export const FavouritesProvider = ({ children }: any) => {
  const { user } = useAuth();

  const [favourites, setFavourites] = useState<number[]>([]);

  const STORAGE_KEY = user ? `FAVOURITES_${user.uid}` : null;

  // Load user-specific favourites on login
  useEffect(() => {
    const loadFavourites = async () => {
      if (!STORAGE_KEY) {
        setFavourites([]);
        return;
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setFavourites(JSON.parse(raw));
    };

    loadFavourites();
  }, [STORAGE_KEY]);

  // Save on update
  const save = async (items: number[]) => {
    if (!STORAGE_KEY) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const toggleFavourite = (id: number) => {
    setFavourites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      save(updated);
      return updated;
    });
  };

 

  const clearFavourites = async () => {
    setFavourites([]);
    if (STORAGE_KEY) await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, toggleFavourite, clearFavourites }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be inside FavouritesProvider");
  return ctx;
};