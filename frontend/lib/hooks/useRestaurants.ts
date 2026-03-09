'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  restaurantId: number;
}

export interface RestaurantDetail extends Restaurant {
  menuItems: MenuItem[];
}

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: () => apiFetch<Restaurant[]>('/restaurants'),
  });
}

export function useRestaurant(id: number) {
  return useQuery({
    queryKey: ['restaurants', id],
    queryFn: () => apiFetch<RestaurantDetail>(`/restaurants/${id}`),
  });
}
