import { SalesRepository } from '../repositories/sales.repository';

export class SalesService {
  constructor(private readonly salesRepository = new SalesRepository()) {}

  async getLeads() {
    return this.salesRepository.getLeads();
  }
}
