'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BorrowerShell } from '@/components/layout/borrower-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/services/api';
import { borrowerService } from '@/services/borrower.service';
import { EmploymentMode } from '@/types';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  pan: z
    .string()
    .transform((v) => v.toUpperCase())
    .refine((v) => PAN_REGEX.test(v), 'Invalid PAN format'),
  dob: z.string().min(1, 'Date of birth is required'),
  monthlySalary: z.number().min(25000, 'Minimum salary is ₹25,000'),
  employmentMode: z.nativeEnum(EmploymentMode),
});

type FormData = z.infer<typeof schema>;

export default function BorrowerProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['borrower-profile'],
    queryFn: () => borrowerService.getProfile().then((r) => r.data.data),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: profile
      ? {
          fullName: profile.fullName,
          pan: profile.pan,
          dob: profile.dob.split('T')[0],
          monthlySalary: profile.monthlySalary,
          employmentMode: profile.employmentMode,
        }
      : undefined,
  });

  const onSubmit = async (data: FormData) => {
    try {
      await borrowerService.saveProfile(data);
      await queryClient.invalidateQueries({ queryKey: ['borrower-profile'] });
      toast({ title: 'Profile saved', description: 'You are eligible to continue' });
    } catch (error) {
      toast({
        title: 'Eligibility check failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <BorrowerShell title="Profile">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>
            Server-side Business Rule Engine validates age (23–50), salary (≥₹25,000), PAN, and employment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input id="pan" placeholder="ABCDE1234F" {...register('pan')} />
                {errors.pan && <p className="text-sm text-destructive">{errors.pan.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" {...register('dob')} />
                {errors.dob && <p className="text-sm text-destructive">{errors.dob.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlySalary">Monthly Salary (₹)</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  {...register('monthlySalary', { valueAsNumber: true })}
                />
                {errors.monthlySalary && (
                  <p className="text-sm text-destructive">{errors.monthlySalary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Employment Mode</Label>
                <Controller
                  name="employmentMode"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EmploymentMode.SALARIED}>Salaried</SelectItem>
                        <SelectItem value={EmploymentMode.SELF_EMPLOYED}>Self Employed</SelectItem>
                        <SelectItem value={EmploymentMode.UNEMPLOYED}>Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.employmentMode && (
                  <p className="text-sm text-destructive">{errors.employmentMode.message}</p>
                )}
              </div>
              {profile?.rejectionReason && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {profile.rejectionReason}
                </p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save & Check Eligibility'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </BorrowerShell>
  );
}
