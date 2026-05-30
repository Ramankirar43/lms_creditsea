import { LoanStatus } from '../types/enums';
import { BadRequestError } from './errors';

const VALID_TRANSITIONS: Record<LoanStatus, LoanStatus[]> = {
  [LoanStatus.PENDING]: [LoanStatus.SANCTIONED, LoanStatus.REJECTED],
  [LoanStatus.REJECTED]: [],
  [LoanStatus.SANCTIONED]: [LoanStatus.DISBURSED],
  [LoanStatus.DISBURSED]: [LoanStatus.CLOSED],
  [LoanStatus.CLOSED]: [],
};

export function assertValidTransition(
  current: LoanStatus,
  next: LoanStatus,
): void {
  const allowed = VALID_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new BadRequestError(
      `Invalid loan status transition from ${current} to ${next}`,
    );
  }
}
