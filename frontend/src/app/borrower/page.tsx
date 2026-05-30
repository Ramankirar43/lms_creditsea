'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, FileText, User } from 'lucide-react';
import { BorrowerShell } from '@/components/layout/borrower-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoanStatusBadge } from '@/components/shared/loan-status-badge';
import { borrowerService } from '@/services/borrower.service';
import { EligibilityStatus } from '@/types';

export default function BorrowerHomePage() {
  const { data: profile } = useQuery({
    queryKey: ['borrower-profile'],
    queryFn: () => borrowerService.getProfile().then((r) => r.data.data),
    retry: false,
  });

  const { data: loan } = useQuery({
    queryKey: ['borrower-loan'],
    queryFn: () => borrowerService.getLoan().then((r) => r.data.data),
    retry: false,
  });

  const steps = [
    { title: 'Personal Details', href: '/borrower/profile', done: !!profile?.fullName },
    {
      title: 'Upload Salary Slip',
      href: '/borrower/upload',
      done: profile?.eligibilityStatus === EligibilityStatus.ELIGIBLE,
    },
    { title: 'Apply for Loan', href: '/borrower/apply', done: !!loan },
    { title: 'Track Status', href: '/borrower/status', done: !!loan },
  ];

  return (
    <BorrowerShell title="Overview">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Borrower Portal</h1>
          <p className="text-muted-foreground">Complete your loan application in 4 simple steps</p>
        </div>

        {loan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Loan
                <LoanStatusBadge status={loan.status} />
              </CardTitle>
              <CardDescription>Principal: ₹{loan.principal.toLocaleString('en-IN')}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, i) => (
            <Card key={step.href}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  {step.title}
                  {step.done && (
                    <span className="ml-auto text-xs text-emerald-600">Done</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link href={step.href}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <User className="h-8 w-8 text-primary" />
              <CardTitle>Profile & Eligibility</CardTitle>
              <CardDescription>Submit personal details for BRE validation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/borrower/profile">Go to Profile</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload your latest salary slip (PDF/JPG/PNG, max 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/borrower/upload">Upload Document</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BorrowerShell>
  );
}
