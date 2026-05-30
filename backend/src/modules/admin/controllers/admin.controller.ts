import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
  static async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await adminService.getDashboard();
      res.json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await adminService.getUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getLoans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loans = await adminService.getLoans();
      res.json({ success: true, data: loans });
    } catch (error) {
      next(error);
    }
  }
}
