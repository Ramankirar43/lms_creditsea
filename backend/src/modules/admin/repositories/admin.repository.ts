import { LoanStatus } from '../../../types/enums';
import { Loan } from '../../models/Loan';
import { Payment } from '../../models/Payment';
import { User } from '../../models/User';

export class AdminRepository {
  async getDashboardMetrics() {
    const [
      totalUsers,
      totalLoans,
      pendingLoans,
      sanctionedLoans,
      disbursedLoans,
      closedLoans,
      collectionAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Loan.countDocuments(),
      Loan.countDocuments({ status: LoanStatus.PENDING }),
      Loan.countDocuments({ status: LoanStatus.SANCTIONED }),
      Loan.countDocuments({ status: LoanStatus.DISBURSED }),
      Loan.countDocuments({ status: LoanStatus.CLOSED }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    return {
      totalUsers,
      totalLoans,
      pendingLoans,
      sanctionedLoans,
      disbursedLoans,
      closedLoans,
      collectionAmount: collectionAgg[0]?.total ?? 0,
    };
  }

  async getAllUsers() {
    return User.find().select('-password').sort({ createdAt: -1 });
  }

  async getAllLoans() {
    return Loan.find()
      .populate('borrowerId', 'name email')
      .sort({ createdAt: -1 });
  }
}
