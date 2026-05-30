import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { validate } from '../../../middleware/validationMiddleware';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
