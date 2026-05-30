'use client';

import { Navbar } from '@/components/layout/navbar';
import { BorrowerSidebar } from '@/components/layout/sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Role } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export function BorrowerShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { isReady, user } = useAuthGuard([Role.BORROWER]);

  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="m-6 h-96 flex-1" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar title={title} />
      <div className="flex flex-1">
        <BorrowerSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
