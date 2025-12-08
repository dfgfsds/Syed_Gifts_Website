// hooks/useAuthRedirect.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = ({
  requireAuth = false,
  redirectTo = '/login',
  redirectIfAuthenticated = false,
}: {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('userId');

    if (requireAuth && !token) {
      router.push(redirectTo);
    }

    if (redirectIfAuthenticated && token) {
      router.push('/products');
    }
  }, []);
};
