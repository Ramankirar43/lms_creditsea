import { Types } from 'mongoose';
import { LoanStatus } from '../../../types/enums';
import { BadRequestError, NotFoundError } from '../../../utils/errors';
import { assertValidTransition } from '../../../utils/loanStateMachine';
import { SanctionRepository } from '../repositories/sanction.repository';

export class SanctionService {
  constructor(private readonly sanctionRepository = new SanctionRepository()) {}

  async getPendingLoans() {
    return this.sanctionRepository.findPendingLoans();
  }

  async approve(loanId: string, userId: string, sanctionRemark?: string) {
    const loan = await this.sanctionRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    assertValidTransition(loan.status, LoanStatus.SANCTIONED);

    return this.sanctionRepository.updateLoan(loanId, {
      status: LoanStatus.SANCTIONED,
      sanctionRemark,
      sanctionedBy: new Types.ObjectId(userId),
      sanctionedAt: new Date(),
      rejectionReason: undefined,
    });
  }

  async reject(loanId: string, userId: string, rejectionReason: string) {
    if (!rejectionReason?.trim()) {
      throw new BadRequestError('Rejection reason is mandatory');
    }

    const loan = await this.sanctionRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    assertValidTransition(loan.status, LoanStatus.REJECTED);

    return this.sanctionRepository.updateLoan(loanId, {
      status: LoanStatus.REJECTED,
      rejectionReason,
      sanctionedBy: new Types.ObjectId(userId),
      sanctionedAt: new Date(),
    });
  }
}
