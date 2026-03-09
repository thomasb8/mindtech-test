'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
    }
  }, [router]);
}

export function useRedirectIfAuth() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/restaurants');
    }
  }, [router]);
}
