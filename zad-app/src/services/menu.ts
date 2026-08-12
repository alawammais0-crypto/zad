import api from './api';
import { MenuItem } from '../types';

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const { data } = await api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
  return data;
}
