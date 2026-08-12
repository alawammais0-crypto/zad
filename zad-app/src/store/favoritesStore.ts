import { create } from 'zustand';

interface FavoritesState {
  restaurantIds: string[];
  menuItemIds: string[];
  toggleRestaurant: (id: string) => void;
  toggleMenuItem: (id: string) => void;
  isRestaurantFavorite: (id: string) => boolean;
  isMenuItemFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  restaurantIds: [],
  menuItemIds: [],

  toggleRestaurant: (id) => {
    set((state) => ({
      restaurantIds: state.restaurantIds.includes(id)
        ? state.restaurantIds.filter((r) => r !== id)
        : [...state.restaurantIds, id],
    }));
  },

  toggleMenuItem: (id) => {
    set((state) => ({
      menuItemIds: state.menuItemIds.includes(id)
        ? state.menuItemIds.filter((m) => m !== id)
        : [...state.menuItemIds, id],
    }));
  },

  isRestaurantFavorite: (id) => get().restaurantIds.includes(id),
  isMenuItemFavorite: (id) => get().menuItemIds.includes(id),
}));
