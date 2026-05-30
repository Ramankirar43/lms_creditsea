import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { Role } from '../../../types/enums';
import { SalesController } from '../controllers/sales.controller';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.SALES, Role.ADMIN));
router.get('/leads', SalesController.getLeads);

export default router;
