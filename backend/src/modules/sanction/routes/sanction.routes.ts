import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { validate } from '../../../middleware/validationMiddleware';
import { Role } from '../../../types/enums';
import { SanctionController } from '../controllers/sanction.controller';
import { approveLoanSchema, rejectLoanSchema } from '../validators/sanction.validator';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.SANCTION, Role.ADMIN));
router.get('/loans', SanctionController.getLoans);
router.patch(
  '/:loanId/approve',
  validate(approveLoanSchema),
  SanctionController.approve,
);
router.patch(
  '/:loanId/reject',
  validate(rejectLoanSchema),
  SanctionController.reject,
);

export default router;
