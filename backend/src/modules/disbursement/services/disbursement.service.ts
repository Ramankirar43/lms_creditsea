import { Types } from 'mongoose';
import { LoanStatus } from '../../../types/enums';
import { NotFoundError } from '../../../utils/errors';
import { assertValidTransition } from '../../../utils/loanStateMachine';
import { DisbursementRepository } from '../repositories/disbursement.repository';

export class DisbursementService {
  constructor(
    private readonly disbursementRepository = new DisbursementRepository(),
  ) {}

  async getSanctionedLoans() {
    return this.disbursementRepository.findSanctionedLoans();
  }

  async disburse(loanId: string, userId: string) {
    const loan = await this.disbursementRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    assertValidTransition(loan.status, LoanStatus.DISBURSED);

    return this.disbursementRepository.updateLoan(loanId, {
      status: LoanStatus.DISBURSED,
      disbursedBy: new Types.ObjectId(userId),
      disbursedAt: new Date(),
    });
  }
}
