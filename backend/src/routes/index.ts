import { Router } from 'express';
import adminRoutes from '../modules/admin/routes/admin.routes';
import authRoutes from '../modules/auth/routes/auth.routes';
import borrowerRoutes from '../modules/borrower/routes/borrower.routes';
import collectionRoutes from '../modules/collection/routes/collection.routes';
import disbursementRoutes from '../modules/disbursement/routes/disbursement.routes';
import salesRoutes from '../modules/sales/routes/sales.routes';
import sanctionRoutes from '../modules/sanction/routes/sanction.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/borrower', borrowerRoutes);
router.use('/sales', salesRoutes);
router.use('/sanction', sanctionRoutes);
router.use('/disbursement', disbursementRoutes);
router.use('/collection', collectionRoutes);
router.use('/admin', adminRoutes);

export default router;
