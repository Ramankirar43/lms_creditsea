import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { uploadMiddleware } from '../../../middleware/uploadMiddleware';
import { validate } from '../../../middleware/validationMiddleware';
import { Role } from '../../../types/enums';
import { BorrowerController } from '../controllers/borrower.controller';
import { applyLoanSchema, profileSchema } from '../validators/borrower.validator';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.BORROWER, Role.ADMIN));

router.post('/profile', validate(profileSchema), BorrowerController.saveProfile);
router.get('/profile', BorrowerController.getProfile);
router.post(
  '/upload',
  uploadMiddleware.single('file'),
  BorrowerController.upload,
);
router.post('/apply', validate(applyLoanSchema), BorrowerController.apply);
router.get('/loan', BorrowerController.getLoan);

export default router;
