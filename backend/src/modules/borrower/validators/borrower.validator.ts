import { z } from 'zod';
import { EmploymentMode, PAN_REGEX } from '../../../types/enums';
import {
  MAX_LOAN_AMOUNT,
  MAX_TENURE_DAYS,
  MIN_LOAN_AMOUNT,
  MIN_TENURE_DAYS,
} from '../../../types/enums';

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  pan: z
    .string()
    .transform((v) => v.toUpperCase())
    .refine((v) => PAN_REGEX.test(v), 'Invalid PAN format'),
  dob: z.coerce.date({ invalid_type_error: 'Invalid date of birth' }),
  monthlySalary: z.coerce.number().min(0, 'Salary must be a positive number'),
  employmentMode: z.nativeEnum(EmploymentMode),
});

export const applyLoanSchema = z.object({
  principal: z.coerce
    .number()
    .min(MIN_LOAN_AMOUNT, `Minimum loan amount is ${MIN_LOAN_AMOUNT}`)
    .max(MAX_LOAN_AMOUNT, `Maximum loan amount is ${MAX_LOAN_AMOUNT}`),
  tenureDays: z.coerce
    .number()
    .min(MIN_TENURE_DAYS, `Minimum tenure is ${MIN_TENURE_DAYS} days`)
    .max(MAX_TENURE_DAYS, `Maximum tenure is ${MAX_TENURE_DAYS} days`),
});
