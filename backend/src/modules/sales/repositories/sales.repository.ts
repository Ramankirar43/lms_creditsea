import { Role } from '../../../types/enums';
import { Loan } from '../../models/Loan';
import { User } from '../../models/User';

export interface LeadRow {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  leadStatus: string;
}

export class SalesRepository {
  async getLeads(): Promise<LeadRow[]> {
    const borrowers = await User.find({ role: Role.BORROWER }).sort({ createdAt: -1 });

    const leads: LeadRow[] = [];
    for (const borrower of borrowers) {
      const hasLoan = await Loan.exists({ borrowerId: borrower._id });
      if (!hasLoan) {
        leads.push({
          _id: borrower._id.toString(),
          name: borrower.name,
          email: borrower.email,
          createdAt: borrower.createdAt,
          leadStatus: 'REGISTERED_NO_APPLICATION',
        });
      }
    }
    return leads;
  }
}
