import { create } from 'zustand';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: MenuItem, restaurantId?: string, restaurantName?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (item, restaurantId, restaurantName) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.menuItem.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { items: updated, restaurantId, restaurantName };
      }
      return {
        items: [...state.items, { id: `${item.id}-${Date.now()}`, menuItem: item, quantity: 1 }],
        restaurantId,
        restaurantName,
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => {
    set({ items: [], restaurantId: null, restaurantName: null });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
