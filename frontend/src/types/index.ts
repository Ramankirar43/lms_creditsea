export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  SANCTION = 'SANCTION',
  DISBURSEMENT = 'DISBURSEMENT',
  COLLECTION = 'COLLECTION',
  BORROWER = 'BORROWER',
}

export enum EmploymentMode {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
}

export enum EligibilityStatus {
  PENDING = 'PENDING',
  ELIGIBLE = 'ELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
}

export enum LoanStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  SANCTIONED = 'SANCTIONED',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BorrowerProfile {
  _id: string;
  userId: string;
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  eligibilityStatus: EligibilityStatus;
  rejectionReason?: string;
}

export interface Document {
  _id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Loan {
  _id: string;
  borrowerId: string | { _id: string; name: string; email: string };
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  outstandingAmount: number;
  status: LoanStatus;
  sanctionRemark?: string;
  rejectionReason?: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  leadStatus: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalLoans: number;
  pendingLoans: number;
  sanctionedLoans: number;
  disbursedLoans: number;
  closedLoans: number;
  collectionAmount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
