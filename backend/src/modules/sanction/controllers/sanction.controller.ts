import { Request, Response, NextFunction } from 'express';
import { SanctionService } from '../services/sanction.service';

const sanctionService = new SanctionService();

export class SanctionController {
  static async getLoans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loans = await sanctionService.getPendingLoans();
      res.json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await sanctionService.approve(
        String(req.params.loanId),
        req.user!.id,
        req.body.sanctionRemark,
      );
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await sanctionService.reject(
        String(req.params.loanId),
        req.user!.id,
        req.body.rejectionReason,
      );
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  }
}
