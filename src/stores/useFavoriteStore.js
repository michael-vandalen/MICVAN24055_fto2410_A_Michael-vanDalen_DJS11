import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) => {
        const current = get().favorites;
        if (!current.some((f) => f.id === id)) {
          set({
            favorites: [...current, { id, addedAt: new Date().toISOString() }],
          });
        }
      },
      removeFavorite: (id) => {
        set({
          favorites: get().favorites.filter((f) => f.id !== id),
        });
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: "favoriteEpisodes", // LocalStorage key
    }
  )
);

export default useFavoriteStore;
