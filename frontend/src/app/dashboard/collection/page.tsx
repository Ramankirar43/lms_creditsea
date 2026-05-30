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
import { formatCurrency } from '@/lib/utils';
import { getErrorMessage } from '@/services/api';
import { dashboardService } from '@/services/dashboard.service';
import { Loan, Role } from '@/types';

function getBorrowerName(loan: Loan): string {
  if (typeof loan.borrowerId === 'object' && loan.borrowerId !== null && 'name' in loan.borrowerId) {
    return loan.borrowerId.name;
  }
  return '—';
}

export default function CollectionPage() {
  const queryClient = useQueryClient();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['collection-loans'],
    queryFn: () => dashboardService.getCollectionLoans().then((r) => r.data.data),
  });

  const paymentMutation = useMutation({
    mutationFn: () =>
      dashboardService.recordPayment({
        loanId: selectedLoan!._id,
        utrNumber,
        amount: parseFloat(amount),
        paymentDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-loans'] });
      setSelectedLoan(null);
      setUtrNumber('');
      setAmount('');
      toast({ title: 'Payment recorded' });
    },
    onError: (e) => toast({ title: 'Error', description: getErrorMessage(e), variant: 'destructive' }),
  });

  return (
    <DashboardShell title="Collection" allowedRoles={[Role.COLLECTION, Role.ADMIN]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Disbursed Loans — Record Payments</h1>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : loans.length === 0 ? (
          <EmptyState title="No disbursed loans" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Total Repayment</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{getBorrowerName(loan)}</TableCell>
                  <TableCell>{formatCurrency(loan.totalRepayment)}</TableCell>
                  <TableCell>{formatCurrency(loan.outstandingAmount)}</TableCell>
                  <TableCell>
                    <LoanStatusBadge status={loan.status} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedLoan(loan)}>
                      Record Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Outstanding: {formatCurrency(selectedLoan.outstandingAmount)}
              </p>
              <div className="space-y-2">
                <Label>UTR Number (unique)</Label>
                <Input value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={selectedLoan.outstandingAmount}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                disabled={!utrNumber || !amount || paymentMutation.isPending}
                onClick={() => paymentMutation.mutate()}
              >
                Submit Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
