import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { Role } from '../../../types/enums';
import { DisbursementController } from '../controllers/disbursement.controller';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.DISBURSEMENT, Role.ADMIN));
router.get('/loans', DisbursementController.getLoans);
router.patch('/:loanId/disburse', DisbursementController.disburse);

export default router;
