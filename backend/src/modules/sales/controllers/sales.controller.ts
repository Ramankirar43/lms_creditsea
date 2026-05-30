import { Request, Response, NextFunction } from 'express';
import { SalesService } from '../services/sales.service';

const salesService = new SalesService();

export class SalesController {
  static async getLeads(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leads = await salesService.getLeads();
      res.json({ success: true, data: leads });
    } catch (error) {
      next(error);
    }
  }
}
