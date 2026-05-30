import { LoanStatus } from '../../../types/enums';
import { ILoan, Loan } from '../../models/Loan';

export class DisbursementRepository {
  async findSanctionedLoans(): Promise<ILoan[]> {
    return Loan.find({ status: LoanStatus.SANCTIONED })
      .populate('borrowerId', 'name email')
      .sort({ sanctionedAt: -1 });
  }

  async findById(loanId: string): Promise<ILoan | null> {
    return Loan.findById(loanId);
  }

  async updateLoan(loanId: string, update: Partial<ILoan>): Promise<ILoan | null> {
    return Loan.findByIdAndUpdate(loanId, update, { new: true });
  }
}
