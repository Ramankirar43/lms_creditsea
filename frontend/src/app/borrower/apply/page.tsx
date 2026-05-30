'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BorrowerShell } from '@/components/layout/borrower-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { calculateSimpleInterest } from '@/lib/loanCalculator';
import { formatCurrency } from '@/lib/utils';
import { getErrorMessage } from '@/services/api';
import { borrowerService } from '@/services/borrower.service';

export default function BorrowerApplyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [principal, setPrincipal] = useState(150000);
  const [tenureDays, setTenureDays] = useState(180);

  const calculation = useMemo(
    () => calculateSimpleInterest(principal, tenureDays),
    [principal, tenureDays],
  );

  const applyMutation = useMutation({
    mutationFn: () =>
      borrowerService.applyLoan({ principal, tenureDays }).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrower-loan'] });
      toast({ title: 'Application submitted', description: 'Your loan is pending sanction' });
      router.push('/borrower/status');
    },
    onError: (error) => {
      toast({ title: 'Application failed', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  return (
    <BorrowerShell title="Apply">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Loan Configuration</h1>
          <p className="text-muted-foreground">Interest rate: 12% per annum (simple interest)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Amount</CardTitle>
            <CardDescription>{formatCurrency(principal)} (₹50,000 – ₹5,00,000)</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              min={50000}
              max={500000}
              step={5000}
              value={[principal]}
              onValueChange={([v]) => setPrincipal(v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenure</CardTitle>
            <CardDescription>{tenureDays} days (30 – 365 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              min={30}
              max={365}
              step={1}
              value={[tenureDays]}
              onValueChange={([v]) => setTenureDays(v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repayment Summary</CardTitle>
            <CardDescription>SI = (P × R × T) / (365 × 100)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Principal</span>
              <span className="font-medium">{formatCurrency(calculation.principal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest (12% p.a.)</span>
              <span className="font-medium">{formatCurrency(calculation.simpleInterest)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base">
              <span className="font-semibold">Total Repayment</span>
              <span className="font-bold text-primary">
                {formatCurrency(calculation.totalRepayment)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isPending}
        >
          {applyMutation.isPending ? 'Submitting...' : 'Apply for Loan'}
        </Button>
      </div>
    </BorrowerShell>
  );
}
