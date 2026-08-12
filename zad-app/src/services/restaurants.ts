import api from './api';
import { Restaurant } from '../types';

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data } = await api.get<Restaurant[]>('/restaurants');
  return data;
}

export async function getRestaurantById(id: string): Promise<Restaurant> {
  const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
  return data;
}
