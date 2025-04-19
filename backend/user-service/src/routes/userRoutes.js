import express from 'express';
import { register, login, getMe } from '../controllers/userController.js';
import { protect } from '../../../common/utils/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/me', protect, getMe);

export default router;
