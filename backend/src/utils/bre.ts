import { EmploymentMode, PAN_REGEX } from '../types/enums';

export interface BreInput {
  dob: Date;
  monthlySalary: number;
  pan: string;
  employmentMode: EmploymentMode;
}

export interface BreResult {
  eligible: boolean;
  rejectionReason?: string;
}

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function runBusinessRuleEngine(input: BreInput): BreResult {
  const age = calculateAge(input.dob);

  if (age < 23 || age > 50) {
    return {
      eligible: false,
      rejectionReason: 'Applicant age must be between 23 and 50 years',
    };
  }

  if (input.monthlySalary < 25000) {
    return {
      eligible: false,
      rejectionReason: 'Applicant salary must be at least 25000',
    };
  }

  const panUpper = input.pan.toUpperCase();
  if (!PAN_REGEX.test(panUpper)) {
    return {
      eligible: false,
      rejectionReason: 'Invalid PAN format',
    };
  }

  if (input.employmentMode === EmploymentMode.UNEMPLOYED) {
    return {
      eligible: false,
      rejectionReason: 'Unemployed applicants are not eligible',
    };
  }

  return { eligible: true };
}
