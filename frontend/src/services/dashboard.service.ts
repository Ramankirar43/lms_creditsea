import { api } from './api';
import type { ApiResponse, DashboardMetrics, Lead, Loan, User } from '@/types';

export const dashboardService = {
  getLeads: () => api.get<ApiResponse<Lead[]>>('/sales/leads'),
  getSanctionLoans: () => api.get<ApiResponse<Loan[]>>('/sanction/loans'),
  approveLoan: (loanId: string, sanctionRemark?: string) =>
    api.patch<ApiResponse<Loan>>(`/sanction/${loanId}/approve`, { sanctionRemark }),
  rejectLoan: (loanId: string, rejectionReason: string) =>
    api.patch<ApiResponse<Loan>>(`/sanction/${loanId}/reject`, { rejectionReason }),
  getDisbursementLoans: () => api.get<ApiResponse<Loan[]>>('/disbursement/loans'),
  disburseLoan: (loanId: string) =>
    api.patch<ApiResponse<Loan>>(`/disbursement/${loanId}/disburse`),
  getCollectionLoans: () => api.get<ApiResponse<Loan[]>>('/collection/loans'),
  recordPayment: (data: {
    loanId: string;
    utrNumber: string;
    amount: number;
    paymentDate: string;
  }) => api.post<ApiResponse<unknown>>('/collection/payment', data),
  getAdminDashboard: () => api.get<ApiResponse<DashboardMetrics>>('/admin/dashboard'),
  getAdminUsers: () => api.get<ApiResponse<User[]>>('/admin/users'),
  getAdminLoans: () => api.get<ApiResponse<Loan[]>>('/admin/loans'),
};
