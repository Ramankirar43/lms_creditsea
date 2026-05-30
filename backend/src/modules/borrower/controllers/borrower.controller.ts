import { Request, Response, NextFunction } from 'express';
import { getFileUrl } from '../../../middleware/uploadMiddleware';
import { BorrowerService } from '../services/borrower.service';

const borrowerService = new BorrowerService();

export class BorrowerController {
  static async saveProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await borrowerService.saveProfile(req.user!.id, req.body);
      res.status(201).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await borrowerService.getProfile(req.user!.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const fileUrl = getFileUrl(req.file.filename);
      const doc = await borrowerService.uploadDocument(req.user!.id, req.file, fileUrl);
      res.status(201).json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  static async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await borrowerService.applyForLoan(
        req.user!.id,
        req.body.principal,
        req.body.tenureDays,
      );
      res.status(201).json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  }

  static async getLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await borrowerService.getLoan(req.user!.id);
      res.json({ success: true, data: loan });
    } catch (error) {
      next(error);
    }
  }
}
