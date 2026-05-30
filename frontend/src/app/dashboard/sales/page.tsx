'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { dashboardService } from '@/services/dashboard.service';
import { Role } from '@/types';

const PAGE_SIZE = 10;

export default function SalesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['sales-leads'],
    queryFn: () => dashboardService.getLeads().then((r) => r.data.data),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q),
    );
  }, [leads, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardShell title="Sales" allowedRoles={[Role.SALES, Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">Registered users who have not applied for a loan</p>
          </div>
          <Input
            placeholder="Search by name or email..."
            className="max-w-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : paginated.length === 0 ? (
          <EmptyState title="No leads found" description="All registered borrowers have applied." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Lead Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>{lead.leadStatus.replace(/_/g, ' ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages} ({filtered.length} leads)
              </span>
              <div className="flex gap-2">
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
