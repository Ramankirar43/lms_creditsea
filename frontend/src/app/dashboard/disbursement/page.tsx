'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { LoanStatusBadge } from '@/components/shared/loan-status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
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

export default function DisbursementPage() {
  const queryClient = useQueryClient();

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['disbursement-loans'],
    queryFn: () => dashboardService.getDisbursementLoans().then((r) => r.data.data),
  });

  const disburseMutation = useMutation({
    mutationFn: (loanId: string) => dashboardService.disburseLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disbursement-loans'] });
      toast({ title: 'Loan disbursed' });
    },
    onError: (e) => toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' }),
  });

  return (
    <DashboardShell title="Disbursement" allowedRoles={[Role.DISBURSEMENT, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Sanctioned Loans — Ready for Disbursement</h1>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : loans.length === 0 ? (
          <EmptyState title="No sanctioned loans" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Total Repayment</TableHead>
                <TableHead>Sanctioned At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{getBorrowerName(loan)}</TableCell>
                  <TableCell>{formatCurrency(loan.principal)}</TableCell>
                  <TableCell>{formatCurrency(loan.totalRepayment)}</TableCell>
                  <TableCell>{loan.sanctionedAt ? formatDate(loan.sanctionedAt) : '—'}</TableCell>
                  <TableCell>
                    <LoanStatusBadge status={loan.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => disburseMutation.mutate(loan._id)}
                      disabled={disburseMutation.isPending}
                    >
                      Mark Disbursed
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardShell>
  );
}
