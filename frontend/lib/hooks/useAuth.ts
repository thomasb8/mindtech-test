'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
