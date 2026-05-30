import { INTEREST_RATE } from '../types/enums';

export interface LoanCalculation {
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export function calculateSimpleInterest(
  principal: number,
  tenureDays: number,
  interestRate: number = INTEREST_RATE,
): LoanCalculation {
  const simpleInterest = (principal * interestRate * tenureDays) / (365 * 100);
  const totalRepayment = principal + simpleInterest;
  return {
    principal,
    tenureDays,
    interestRate,
    simpleInterest: Math.round(simpleInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
  };
}
