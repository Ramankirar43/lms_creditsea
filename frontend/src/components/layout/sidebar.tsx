'use client';

import {
  Banknote,
  CheckCircle,
  ClipboardList,
  LayoutDashboard,
  Shield,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';

const navItems = [
  { href: '/dashboard/admin', label: 'Admin', icon: LayoutDashboard, roles: [Role.ADMIN] },
  { href: '/dashboard/sales', label: 'Sales', icon: Users, roles: [Role.SALES, Role.ADMIN] },
  { href: '/dashboard/sanction', label: 'Sanction', icon: Shield, roles: [Role.SANCTION, Role.ADMIN] },
  {
    href: '/dashboard/disbursement',
    label: 'Disbursement',
    icon: Banknote,
    roles: [Role.DISBURSEMENT, Role.ADMIN],
  },
  {
    href: '/dashboard/collection',
    label: 'Collection',
    icon: Wallet,
    roles: [Role.COLLECTION, Role.ADMIN],
  },
];

const borrowerItems = [
  { href: '/borrower', label: 'Overview', icon: LayoutDashboard },
  { href: '/borrower/profile', label: 'Profile', icon: ClipboardList },
  { href: '/borrower/upload', label: 'Upload', icon: Banknote },
  { href: '/borrower/apply', label: 'Apply Loan', icon: CheckCircle },
  { href: '/borrower/status', label: 'Status', icon: Shield },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const visibleItems = navItems.filter(
    (item) => user && (user.role === Role.ADMIN || item.roles.includes(user.role)),
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <nav className="flex flex-col gap-1 p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function BorrowerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <nav className="flex flex-col gap-1 p-4">
        {borrowerItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
