import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import logger from '../utils/logger.js'
import { dispatchNotification } from '../services/notificationService.js'

const { info, error } = logger
const { OK, BAD_REQUEST, NOT_FOUND } = StatusCodes

/**
 * GET /api/users/admin/users
 * List all users (paginated), excluding password hashes.
 */
export async function listAllUsers(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10))
    const limit = Math.max(1, parseInt(req.query.limit ?? '20', 10))
    const skip  = (page - 1) * limit

    const [ total, users ] = await Promise.all([
      User.countDocuments(),
      User.find()
        .select('-password -__v')
        .skip(skip)
        .limit(limit)
        .lean()
    ])

    return res.status(OK).json({ page, limit, total, data: users })
  } catch (err) {
    error('listAllUsers error:', err)
    return next(err)
  }
}

/**
 * PATCH /api/users/admin/users/:id/status
 *   – Validates new status
 *   – Updates User.status
 *   – Triggers in‑app, email & sms notifications
 */
export async function updateUserStatus(req, res, next) {
  const { id } = req.params
  const { status } = req.body

  // 1) Validate
  const VALID = ['Pending','Active','Inactive']
  if (!VALID.includes(status)) {
    return res
      .status(BAD_REQUEST)
      .json({ message: `status must be one of ${VALID.join(', ')}` })
  }

  try {
    // 2) Fetch user (including name, email, phone)
    const user = await User.findById(id).select('+name +email +phone')
    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'User not found' })
    }

    // 3) Update status
    user.status = status
    await user.save()
    info(`Admin ${req.user.id} updated user ${id} → status=${status}`)

    // 4) Prepare notification payload
    const title   = 'Account Status Updated'
    const message = `Hello ${user.name}, your account is now ${status}.`
    const auth    = req.headers.authorization

    // 5) Fire‑and‑forget all three channels
    await Promise.all([
      dispatchNotification({ userId: user._id, type: 'in‑app', payload: { title, message }, authHeader: auth }),
      dispatchNotification({ userId: user._id, type: 'email',   payload: { title, message }, email: user.email,    authHeader: auth }),
      dispatchNotification({ userId: user._id, type: 'sms',     payload: { title, message }, phone: user.phone,    authHeader: auth }),
    ])

    // 6) Respond
    return res
      .status(OK)
      .json({ message: 'Status updated', user: { id: user._id, status: user.status } })

  } catch (err) {
    error('updateUserStatus error:', err)
    return next(err)
  }
}
/**
 * POST /api/users/admin/users/:id/approve
 * Shortcut endpoint to flip a user into Active.
 */
export async function approveUser(req, res, next) {
  req.body.status = 'Active'
  return updateUserStatus(req, res, next)
}
