import { StatusCodes } from 'http-status-codes';
import User              from '../models/User.js';
import Admin             from '../models/Admin.js';
import Restaurant        from '../models/Restaurant.js';
import DeliveryPerson    from '../models/DeliveryPerson.js';
import Customer          from '../models/Customer.js';
import logger            from '../utils/logger.js';
import { dispatchNotification } from '../services/notificationService.js';

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
  const { id } = req.params;
  const { status } = req.body;

  // 1) Validate
  const VALID = ['Pending','Active','Inactive'];
  if (!VALID.includes(status)) {
    return res
      .status(BAD_REQUEST)
      .json({ message: `status must be one of ${VALID.join(', ')}` });
  }

  try {
    // 2) Fetch user (including name, email, phone, role)
    const user = await User.findById(id)
      .select('+name +email +phone +role');
    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    // 3) Update base user status
    user.status = status;
    await user.save();
    info(`Admin ${req.user.id} updated user ${id} → status=${status}`);

    // 4) Cascade to role‑specific profile
    switch (user.role) {
      case 'admin':
        await Admin.updateOne({ userId: user._id }, { status });
        break;
      case 'restaurant':
        await Restaurant.updateOne({ userId: user._id }, { status });
        break;
      case 'delivery':
        await DeliveryPerson.updateOne({ userId: user._id }, { status });
        break;
      case 'customer':
        await Customer.updateOne({ userId: user._id }, { status });
        break;
    }
    info(`Also updated ${user.role} profile status to ${status}`);

    // 5) Prepare notification
    const title   = 'Account Status Updated';
    const message = `Hello ${user.name}, your account is now ${status}.`;
    const auth    = req.headers.authorization;

    // 6) Fire‑and‑forget notifications
    await Promise.all([
      dispatchNotification({ userId: user._id, type: 'in‑app', payload: { title, message }, authHeader: auth }),
      dispatchNotification({ userId: user._id, type: 'email',   payload: { title, message }, email: user.email, authHeader: auth }),
      dispatchNotification({ userId: user._id, type: 'sms',     payload: { title, message }, phone: user.phone, authHeader: auth }),
    ]);

    // 7) Respond
    return res
      .status(OK)
      .json({ message: 'Status updated', user: { id: user._id, status } });

  } catch (err) {
    error('updateUserStatus error:', err);
    return next(err);
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
