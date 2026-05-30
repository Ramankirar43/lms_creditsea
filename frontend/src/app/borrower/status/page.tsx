'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle } from 'lucide-react';
import { BorrowerShell } from '@/components/layout/borrower-shell';
import { LoanStatusBadge } from '@/components/shared/loan-status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { borrowerService } from '@/services/borrower.service';
import { LoanStatus } from '@/types';
import { cn } from '@/lib/utils';

const timelineSteps = [
  { key: 'applied', label: 'Applied', statuses: [LoanStatus.PENDING, LoanStatus.REJECTED, LoanStatus.SANCTIONED, LoanStatus.DISBURSED, LoanStatus.CLOSED] },
  { key: 'sanctioned', label: 'Sanctioned', statuses: [LoanStatus.SANCTIONED, LoanStatus.DISBURSED, LoanStatus.CLOSED] },
  { key: 'disbursed', label: 'Disbursed', statuses: [LoanStatus.DISBURSED, LoanStatus.CLOSED] },
  { key: 'closed', label: 'Closed', statuses: [LoanStatus.CLOSED] },
];

export default function BorrowerStatusPage() {
  const { data: loan, isLoading, isError } = useQuery({
    queryKey: ['borrower-loan'],
    queryFn: () => borrowerService.getLoan().then((r) => r.data.data),
    retry: false,
  });

  const getTimestamp = (step: string): string | undefined => {
    if (!loan) return undefined;
    switch (step) {
      case 'applied':
        return loan.createdAt;
      case 'sanctioned':
        return loan.sanctionedAt;
      case 'disbursed':
        return loan.disbursedAt;
      case 'closed':
        return loan.closedAt;
      default:
        return undefined;
    }
  };

  const isStepComplete = (statuses: LoanStatus[]) => loan && statuses.includes(loan.status);

  return (
    <BorrowerShell title="Status">
      {isLoading ? (
        <Skeleton className="h-64 w-full max-w-2xl" />
      ) : isError || !loan ? (
        <EmptyState
          title="No loan application"
          description="Complete your profile, upload documents, and apply for a loan."
        />
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Loan Details
                <LoanStatusBadge status={loan.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Principal</span>
                <span>{formatCurrency(loan.principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenure</span>
                <span>{loan.tenureDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Repayment</span>
                <span>{formatCurrency(loan.totalRepayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outstanding</span>
                <span>{formatCurrency(loan.outstandingAmount)}</span>
              </div>
              {loan.rejectionReason && (
                <p className="mt-2 rounded-md bg-destructive/10 p-2 text-destructive">
                  {loan.rejectionReason}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-6 border-l border-muted pl-6">
                {timelineSteps.map((step) => {
                  const complete = isStepComplete(step.statuses as LoanStatus[]);
                  const rejected =
                    step.key === 'sanctioned' && loan.status === LoanStatus.REJECTED;
                  const ts = getTimestamp(step.key);
                  return (
                    <li key={step.key} className="relative">
                      <span
                        className={cn(
                          'absolute -left-[1.85rem] flex h-6 w-6 items-center justify-center rounded-full bg-background',
                          complete && !rejected && 'text-emerald-600',
                          rejected && 'text-destructive',
                        )}
                      >
                        {complete && !rejected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </span>
                      <p className="font-medium">{step.label}</p>
                      {rejected && (
                        <p className="text-sm text-destructive">Rejected — {loan.rejectionReason}</p>
                      )}
                      {ts && <p className="text-sm text-muted-foreground">{formatDate(ts)}</p>}
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </BorrowerShell>
  );
}
