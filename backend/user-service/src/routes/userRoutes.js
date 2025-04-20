import express from 'express';
import { register, login, getMe } from '../controllers/userController.js';
import { generateToken, protect, authorize } from '../services/authService.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/me', protect, getMe);

export default router;
