export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  deliveryFee: string;
  imageUrl: string;
  isPromoted?: boolean;
  isFreeDelivery?: boolean;
  badge?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  restaurantId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface CartStore {
  items: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  points: number;
  orders: number;
  balance: number;
  isGold: boolean;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  details: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}
