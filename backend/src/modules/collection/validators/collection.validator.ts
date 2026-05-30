import { z } from 'zod';

export const paymentSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
  utrNumber: z.string().min(1, 'UTR number is required').trim(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  paymentDate: z.coerce.date({ invalid_type_error: 'Invalid payment date' }),
});
