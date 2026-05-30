import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { Role } from '../../../types/enums';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.ADMIN));
router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.get('/loans', AdminController.getLoans);

export default router;
