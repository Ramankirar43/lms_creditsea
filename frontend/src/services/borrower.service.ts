import { api } from './api';
import type { ApiResponse, BorrowerProfile, Document, Loan } from '@/types';

export const borrowerService = {
  saveProfile: (data: Record<string, unknown>) =>
    api.post<ApiResponse<BorrowerProfile>>('/borrower/profile', data),

  getProfile: () => api.get<ApiResponse<BorrowerProfile>>('/borrower/profile'),

  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<Document>>('/borrower/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  applyLoan: (data: { principal: number; tenureDays: number }) =>
    api.post<ApiResponse<Loan>>('/borrower/apply', data),

  getLoan: () => api.get<ApiResponse<Loan>>('/borrower/loan'),
};
