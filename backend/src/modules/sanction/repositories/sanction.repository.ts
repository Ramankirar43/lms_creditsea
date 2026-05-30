import { LoanStatus } from '../../../types/enums';
import { ILoan, Loan } from '../../models/Loan';

export class SanctionRepository {
  async findPendingLoans(): Promise<ILoan[]> {
    return Loan.find({ status: LoanStatus.PENDING })
      .populate('borrowerId', 'name email')
      .sort({ createdAt: -1 });
  }

  async findById(loanId: string): Promise<ILoan | null> {
    return Loan.findById(loanId);
  }

  async updateLoan(
    loanId: string,
    update: Partial<ILoan>,
  ): Promise<ILoan | null> {
    return Loan.findByIdAndUpdate(loanId, update, { new: true });
  }
}
