import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { roleMiddleware } from '../../../middleware/roleMiddleware';
import { validate } from '../../../middleware/validationMiddleware';
import { Role } from '../../../types/enums';
import { CollectionController } from '../controllers/collection.controller';
import { paymentSchema } from '../validators/collection.validator';

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.COLLECTION, Role.ADMIN));
router.get('/loans', CollectionController.getLoans);
router.post('/payment', validate(paymentSchema), CollectionController.recordPayment);

export default router;
