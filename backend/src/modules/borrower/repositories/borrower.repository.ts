import { Types } from 'mongoose';
import { BorrowerProfile, IBorrowerProfile } from '../../models/BorrowerProfile';
import { DocumentModel, IDocument } from '../../models/Document';
import { ILoan, Loan } from '../../models/Loan';

export class BorrowerRepository {
  async findProfileByUserId(userId: string): Promise<IBorrowerProfile | null> {
    return BorrowerProfile.findOne({ userId: new Types.ObjectId(userId) });
  }

  async upsertProfile(
    userId: string,
    data: Partial<IBorrowerProfile>,
  ): Promise<IBorrowerProfile> {
    return BorrowerProfile.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { userId: new Types.ObjectId(userId), ...data } },
      { upsert: true, new: true },
    ) as Promise<IBorrowerProfile>;
  }

  async createDocument(data: {
    borrowerId: Types.ObjectId;
    originalName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
  }): Promise<IDocument> {
    return DocumentModel.create(data);
  }

  async findDocumentsByBorrowerId(borrowerId: string): Promise<IDocument[]> {
    return DocumentModel.find({
      borrowerId: new Types.ObjectId(borrowerId),
    }).sort({ uploadedAt: -1 });
  }

  async findLoanByBorrowerId(borrowerId: string): Promise<ILoan | null> {
    return Loan.findOne({ borrowerId: new Types.ObjectId(borrowerId) }).sort({
      createdAt: -1,
    });
  }

  async createLoan(data: Partial<ILoan>): Promise<ILoan> {
    return Loan.create(data);
  }

  async hasLoan(borrowerId: string): Promise<boolean> {
    const count = await Loan.countDocuments({
      borrowerId: new Types.ObjectId(borrowerId),
    });
    return count > 0;
  }
}
