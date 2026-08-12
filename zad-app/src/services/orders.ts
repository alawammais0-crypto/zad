import api from './api';
import { CartItem } from '../types';

export interface CreateOrderPayload {
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  addressId: string;
  paymentMethod: string;
  notes?: string;
}

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await api.post('/orders', payload);
  return data;
}
