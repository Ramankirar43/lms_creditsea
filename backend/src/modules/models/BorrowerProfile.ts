import mongoose, { Document, Schema, Types } from 'mongoose';
import { EligibilityStatus, EmploymentMode } from '../../types/enums';

export interface IBorrowerProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  eligibilityStatus: EligibilityStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const borrowerProfileSchema = new Schema<IBorrowerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: {
      type: String,
      enum: Object.values(EmploymentMode),
      required: true,
    },
    eligibilityStatus: {
      type: String,
      enum: Object.values(EligibilityStatus),
      default: EligibilityStatus.PENDING,
    },
    rejectionReason: { type: String },
  },
  { timestamps: true },
);

export const BorrowerProfile = mongoose.model<IBorrowerProfile>(
  'BorrowerProfile',
  borrowerProfileSchema,
);
