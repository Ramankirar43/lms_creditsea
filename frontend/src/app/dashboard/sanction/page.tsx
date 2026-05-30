'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { LoanStatusBadge } from '@/components/shared/loan-status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getErrorMessage } from '@/services/api';
import { dashboardService } from '@/services/dashboard.service';
import { Loan, Role } from '@/types';

function getBorrowerName(loan: Loan): string {
  if (typeof loan.borrowerId === 'object' && loan.borrowerId !== null && 'name' in loan.borrowerId) {
    return loan.borrowerId.name;
  }
  return '—';
}

export default function SanctionPage() {
  const queryClient = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['sanction-loans'],
    queryFn: () => dashboardService.getSanctionLoans().then((r) => r.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: (loanId: string) => dashboardService.approveLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sanction-loans'] });
      toast({ title: 'Loan sanctioned' });
    },
    onError: (e) => toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ loanId, reason }: { loanId: string; reason: string }) =>
      dashboardService.rejectLoan(loanId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sanction-loans'] });
      setRejectId(null);
      setRejectReason('');
      toast({ title: 'Loan rejected' });
    },
    onError: (e) => toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' }),
  });

  return (
    <DashboardShell title="Sanction" allowedRoles={[Role.SANCTION, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pending Loan Applications</h1>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : loans.length === 0 ? (
          <EmptyState title="No pending loans" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{getBorrowerName(loan)}</TableCell>
                  <TableCell>{formatCurrency(loan.principal)}</TableCell>
                  <TableCell>{loan.tenureDays} days</TableCell>
                  <TableCell>{formatCurrency(loan.totalRepayment)}</TableCell>
                  <TableCell>{formatDate(loan.createdAt)}</TableCell>
                  <TableCell>
                    <LoanStatusBadge status={loan.status} />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(loan._id)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectId(loan._id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason (required)</Label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason..."
              />
            </div>
            <Button
              variant="destructive"
              className="w-full"
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              onClick={() =>
                rejectId && rejectMutation.mutate({ loanId: rejectId, reason: rejectReason })
              }
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
