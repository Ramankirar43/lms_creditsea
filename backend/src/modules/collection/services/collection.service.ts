import { Types } from 'mongoose';
import { LoanStatus } from '../../../types/enums';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../../utils/errors';
import { assertValidTransition } from '../../../utils/loanStateMachine';
import { CollectionRepository } from '../repositories/collection.repository';

export class CollectionService {
  constructor(private readonly collectionRepository = new CollectionRepository()) {}

  async getDisbursedLoans() {
    return this.collectionRepository.findDisbursedLoans();
  }

  async recordPayment(data: {
    loanId: string;
    utrNumber: string;
    amount: number;
    paymentDate: Date;
    collectedBy: string;
  }) {
    const existingUtr = await this.collectionRepository.findPaymentByUtr(data.utrNumber);
    if (existingUtr) {
      throw new ConflictError('UTR number already exists');
    }

    const loan = await this.collectionRepository.findLoanById(data.loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    if (loan.status !== LoanStatus.DISBURSED) {
      throw new BadRequestError('Payments can only be recorded for disbursed loans');
    }

    if (data.amount > loan.outstandingAmount) {
      throw new BadRequestError('Payment amount cannot exceed outstanding balance');
    }

    const payment = await this.collectionRepository.createPayment({
      loanId: new Types.ObjectId(data.loanId),
      utrNumber: data.utrNumber,
      amount: data.amount,
      paymentDate: data.paymentDate,
      collectedBy: new Types.ObjectId(data.collectedBy),
    });

    const totalPaid = await this.collectionRepository.getTotalPayments(data.loanId);
    const newOutstanding =
      Math.round((loan.totalRepayment - totalPaid) * 100) / 100;

    const loanUpdate: Partial<typeof loan> = {
      outstandingAmount: Math.max(0, newOutstanding),
    };

    if (newOutstanding <= 0) {
      assertValidTransition(loan.status, LoanStatus.CLOSED);
      loanUpdate.status = LoanStatus.CLOSED;
      loanUpdate.outstandingAmount = 0;
      loanUpdate.closedAt = new Date();
    }

    const updatedLoan = await this.collectionRepository.updateLoan(
      data.loanId,
      loanUpdate,
    );

    return { payment, loan: updatedLoan };
  }
}
