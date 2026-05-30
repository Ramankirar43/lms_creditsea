import { Types } from 'mongoose';
import { LoanStatus } from '../../../types/enums';
import { ILoan, Loan } from '../../models/Loan';
import { IPayment, Payment } from '../../models/Payment';

export class CollectionRepository {
  async findDisbursedLoans(): Promise<ILoan[]> {
    return Loan.find({ status: LoanStatus.DISBURSED })
      .populate('borrowerId', 'name email')
      .sort({ disbursedAt: -1 });
  }

  async findLoanById(loanId: string): Promise<ILoan | null> {
    return Loan.findById(loanId);
  }

  async findPaymentByUtr(utrNumber: string): Promise<IPayment | null> {
    return Payment.findOne({ utrNumber });
  }

  async getTotalPayments(loanId: string): Promise<number> {
    const result = await Payment.aggregate([
      { $match: { loanId: new Types.ObjectId(loanId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result[0]?.total ?? 0;
  }

  async createPayment(data: {
    loanId: Types.ObjectId;
    utrNumber: string;
    amount: number;
    paymentDate: Date;
    collectedBy: Types.ObjectId;
  }): Promise<IPayment> {
    return Payment.create(data);
  }

  async updateLoan(loanId: string, update: Partial<ILoan>): Promise<ILoan | null> {
    return Loan.findByIdAndUpdate(loanId, update, { new: true });
  }
}
