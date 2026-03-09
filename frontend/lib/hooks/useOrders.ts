'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  menuItem: { id: number; name: string; price: number };
}

export interface Order {
  id: number;
  restaurantId: number;
  status: string;
  createdAt: string;
  restaurant: { id: number; name: string };
  items: OrderItem[];
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => apiFetch<Order>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: { restaurantId: number; items: { menuItemId: number; quantity: number }[] }) =>
      apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  });
}
