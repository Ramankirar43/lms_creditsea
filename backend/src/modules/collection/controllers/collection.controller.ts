import { Request, Response, NextFunction } from 'express';
import { CollectionService } from '../services/collection.service';

const collectionService = new CollectionService();

export class CollectionController {
  static async getLoans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loans = await collectionService.getDisbursedLoans();
      res.json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  }

  static async recordPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await collectionService.recordPayment({
        ...req.body,
        collectedBy: req.user!.id,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
