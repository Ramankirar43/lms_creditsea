'use client';

import { Navbar } from '@/components/layout/navbar';
import { DashboardSidebar } from '@/components/layout/sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Role } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardShell({
  children,
  title,
  allowedRoles,
}: {
  children: React.ReactNode;
  title: string;
  allowedRoles: Role[];
}) {
  const { isReady, user } = useAuthGuard(allowedRoles);

  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Skeleton className="h-16 w-full" />
        <div className="flex flex-1 p-6">
          <Skeleton className="hidden h-96 w-64 md:block" />
          <Skeleton className="ml-0 h-96 flex-1 md:ml-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar title={title} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
