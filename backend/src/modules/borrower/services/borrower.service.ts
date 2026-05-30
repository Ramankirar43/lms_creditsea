import { Types } from 'mongoose';
import {
  EligibilityStatus,
  EmploymentMode,
  INTEREST_RATE,
  LoanStatus,
} from '../../../types/enums';
import { runBusinessRuleEngine } from '../../../utils/bre';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../../utils/errors';
import { calculateSimpleInterest } from '../../../utils/loanCalculator';
import { BorrowerRepository } from '../repositories/borrower.repository';

export class BorrowerService {
  constructor(private readonly borrowerRepository = new BorrowerRepository()) {}

  async saveProfile(
    userId: string,
    data: {
      fullName: string;
      pan: string;
      dob: Date;
      monthlySalary: number;
      employmentMode: EmploymentMode;
    },
  ) {
    const breResult = runBusinessRuleEngine({
      dob: data.dob,
      monthlySalary: data.monthlySalary,
      pan: data.pan,
      employmentMode: data.employmentMode,
    });

    const profile = await this.borrowerRepository.upsertProfile(userId, {
      fullName: data.fullName,
      pan: data.pan.toUpperCase(),
      dob: data.dob,
      monthlySalary: data.monthlySalary,
      employmentMode: data.employmentMode,
      eligibilityStatus: breResult.eligible
        ? EligibilityStatus.ELIGIBLE
        : EligibilityStatus.INELIGIBLE,
      rejectionReason: breResult.rejectionReason,
    });

    if (!breResult.eligible) {
      throw new BadRequestError(breResult.rejectionReason!);
    }

    return profile;
  }

  async getProfile(userId: string) {
    const profile = await this.borrowerRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return profile;
  }

  async uploadDocument(
    userId: string,
    file: {
      originalname: string;
      filename: string;
      mimetype: string;
      size: number;
    },
    fileUrl: string,
  ) {
    const profile = await this.borrowerRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new BadRequestError('Complete your profile before uploading documents');
    }
    if (profile.eligibilityStatus !== EligibilityStatus.ELIGIBLE) {
      throw new ForbiddenError('You are not eligible to upload documents');
    }

    return this.borrowerRepository.createDocument({
      borrowerId: profile._id as Types.ObjectId,
      originalName: file.originalname,
      fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
    });
  }

  async getDocuments(userId: string) {
    const profile = await this.borrowerRepository.findProfileByUserId(userId);
    if (!profile) {
      return [];
    }
    return this.borrowerRepository.findDocumentsByBorrowerId(profile._id.toString());
  }

  async applyForLoan(userId: string, principal: number, tenureDays: number) {
    const profile = await this.borrowerRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new BadRequestError('Complete your profile before applying');
    }
    if (profile.eligibilityStatus !== EligibilityStatus.ELIGIBLE) {
      throw new ForbiddenError(profile.rejectionReason ?? 'Not eligible for a loan');
    }

    const documents = await this.borrowerRepository.findDocumentsByBorrowerId(
      profile._id.toString(),
    );
    if (documents.length === 0) {
      throw new BadRequestError('Upload salary slip before applying');
    }

    const existingLoan = await this.borrowerRepository.findLoanByBorrowerId(userId);
    if (existingLoan && existingLoan.status !== LoanStatus.REJECTED) {
      throw new BadRequestError('You already have an active loan application');
    }

    const calculation = calculateSimpleInterest(principal, tenureDays, INTEREST_RATE);

    const loan = await this.borrowerRepository.createLoan({
      borrowerId: new Types.ObjectId(userId),
      principal: calculation.principal,
      tenureDays: calculation.tenureDays,
      interestRate: calculation.interestRate,
      simpleInterest: calculation.simpleInterest,
      totalRepayment: calculation.totalRepayment,
      outstandingAmount: calculation.totalRepayment,
      status: LoanStatus.PENDING,
    });

    return loan;
  }

  async getLoan(userId: string) {
    const loan = await this.borrowerRepository.findLoanByBorrowerId(userId);
    if (!loan) {
      throw new NotFoundError('No loan found');
    }
    return loan;
  }
}
