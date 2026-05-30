'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultRoute } from '@/hooks/useAuthGuard';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace(getDefaultRoute(user.role));
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return <Skeleton className="m-6 h-64 w-full" />;
}
