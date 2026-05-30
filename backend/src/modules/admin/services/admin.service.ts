import { AdminRepository } from '../repositories/admin.repository';

export class AdminService {
  constructor(private readonly adminRepository = new AdminRepository()) {}

  async getDashboard() {
    return this.adminRepository.getDashboardMetrics();
  }

  async getUsers() {
    return this.adminRepository.getAllUsers();
  }

  async getLoans() {
    return this.adminRepository.getAllLoans();
  }
}
