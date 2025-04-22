// backend/user-service/src/routes/adminRoutes.js

import express from 'express'
import { protect, authorize } from '../services/authService.js'
import {
  listAllUsers,
  updateUserStatus,
  approveUser
} from '../controllers/adminController.js'

const router = express.Router()

// All routes here require an authenticated admin
router.use(protect, authorize('admin'))

// List + paginate users
router.get('/users', listAllUsers)

// Change arbitrary status
router.patch('/users/:id/status',  updateUserStatus)

// Shorthand approve endpoint
router.post('/users/:id/approve', approveUser)

export default router
