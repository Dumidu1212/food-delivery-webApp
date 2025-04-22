// routes/userRoutes.js

import express       from 'express'
import { body }      from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import validateRequest from '../middlewares/validateRequest.js'
import asyncHandler    from '../middlewares/asyncHandler.js'
import { protect }     from '../services/authService.js'

const router = express.Router()

router.post(
  '/register',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin','restaurant','delivery','customer']),
  // require phone for roles that will get an SMS
  body('phone').if(body('role').isIn(['customer','restaurant','delivery'])).isMobilePhone(),
  validateRequest,
  asyncHandler(register)
)

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  validateRequest,
  asyncHandler(login)
)

router.get('/me', protect, asyncHandler(getMe))

export default router
