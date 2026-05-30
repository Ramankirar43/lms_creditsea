'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';

export function useAuthGuard(allowedRoles?: Role[]) {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== Role.ADMIN) {
      router.replace(getDefaultRoute(user.role));
    }
  }, [token, user, allowedRoles, isAuthenticated, router]);

  return { user, token, isReady: isAuthenticated() };
}

export function getDefaultRoute(role: Role): string {
  switch (role) {
    case Role.BORROWER:
      return '/borrower';
    case Role.SALES:
      return '/dashboard/sales';
    case Role.SANCTION:
      return '/dashboard/sanction';
    case Role.DISBURSEMENT:
      return '/dashboard/disbursement';
    case Role.COLLECTION:
      return '/dashboard/collection';
    case Role.ADMIN:
      return '/dashboard/admin';
    default:
      return '/login';
  }
}

export function canAccessDashboard(role: Role): boolean {
  return role !== Role.BORROWER;
}
