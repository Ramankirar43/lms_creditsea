import { Request, Response, NextFunction } from 'express';
import { DisbursementService } from '../services/disbursement.service';

const disbursementService = new DisbursementService();

export class DisbursementController {
  static async getLoans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loans = await disbursementService.getSanctionedLoans();
      res.json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  }

  static async disburse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await disbursementService.disburse(String(req.params.loanId), req.user!.id);
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  }
}
