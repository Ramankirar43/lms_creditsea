'use client';

import { useQuery } from '@tanstack/react-query';
import { Banknote, CheckCircle, Clock, TrendingUp, Users, Wallet } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { LoanStatusBadge } from '@/components/shared/loan-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { dashboardService } from '@/services/dashboard.service';
import { Loan, Role } from '@/types';

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function getBorrowerEmail(loan: Loan): string {
  if (typeof loan.borrowerId === 'object' && loan.borrowerId !== null && 'email' in loan.borrowerId) {
    return loan.borrowerId.email;
  }
  return '—';
}

export default function AdminPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard().then((r) => r.data.data),
  });

  const { data: loans = [], isLoading: loansLoading } = useQuery({
    queryKey: ['admin-loans'],
    queryFn: () => dashboardService.getAdminLoans().then((r) => r.data.data),
  });

  return (
    <DashboardShell title="Admin" allowedRoles={[Role.ADMIN]}>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {metricsLoading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : metrics ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <MetricCard title="Total Users" value={metrics.totalUsers} icon={Users} />
            <MetricCard title="Total Loans" value={metrics.totalLoans} icon={Banknote} />
            <MetricCard title="Pending" value={metrics.pendingLoans} icon={Clock} />
            <MetricCard title="Sanctioned" value={metrics.sanctionedLoans} icon={CheckCircle} />
            <MetricCard title="Disbursed" value={metrics.disbursedLoans} icon={Wallet} />
            <MetricCard title="Closed" value={metrics.closedLoans} icon={TrendingUp} />
            <MetricCard
              title="Collection Amount"
              value={formatCurrency(metrics.collectionAmount)}
              icon={Banknote}
            />
          </div>
        ) : null}

        <div>
          <h2 className="mb-4 text-xl font-semibold">All Loans</h2>
          {loansLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>{getBorrowerEmail(loan)}</TableCell>
                    <TableCell>{formatCurrency(loan.principal)}</TableCell>
                    <TableCell>{formatCurrency(loan.outstandingAmount)}</TableCell>
                    <TableCell>
                      <LoanStatusBadge status={loan.status} />
                    </TableCell>
                    <TableCell>{formatDate(loan.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
