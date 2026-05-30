import { z } from 'zod';

export const rejectLoanSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is mandatory'),
});

export const approveLoanSchema = z.object({
  sanctionRemark: z.string().optional(),
});
