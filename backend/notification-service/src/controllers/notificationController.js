import { StatusCodes } from 'http-status-codes'
import Notification from '../models/Notification.js'
import logger from '../utils/logger.js'
import { sendEmail } from '../utils/emailClient.js'
import { sendSms }   from '../utils/smsClient.js'

const { OK, BAD_REQUEST } = StatusCodes
const { info, error }     = logger

/**
 * POST /api/notifications
 * Body: { recipient, type, payload, email?, phone? }
 */
export async function createNotification(req, res, next) {
  try {
    const { recipient, type, payload, email, phone } = req.body

    // 1) Basic validation
    if (!recipient || !type || !payload) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'recipient, type and payload are required' })
    }

    // 2) Persist in DB
    const notif = await Notification.create({ recipient, type, payload })
    info(`Stored in-app notification ${notif._id} for user ${recipient}`)

    // 3) Dispatch email or sms if requested
    if (type === 'email') {
      if (!email) error('Missing email address for email notification')
      else {
        await sendEmail(email, payload.title, payload.message)
        info(`Email sent to ${email}`)
      }
    }

    if (type === 'sms') {
      if (!phone) error('Missing phone number for sms notification')
      else {
        await sendSms(phone, payload.message)
        info(`SMS sent to ${phone}`)
      }
    }

    // 4) Respond with the stored document
    return res.status(OK).json(notif)

  } catch (err) {
    error('createNotification error:', err)
    return next(err)
  }
}

/**
 * GET /api/notifications/unreadCount
 */
export async function getUnreadCount(req, res, next) {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({ recipient: userId, isRead: false });
    res.json({ unreadCount: count });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/notifications
 */
export async function listNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const notifs = await Notification
      .find({ recipient: userId })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(notifs);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(req, res, next) {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/notifications/:id
 * Deletes a single notification belonging to the authenticated user.
 */
export async function deleteNotification(req, res, next) {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!deleted) {
      return res.sendStatus(NOT_FOUND);
    }

    info(`Deleted notification ${req.params.id} for user ${req.user.id}`);
    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    error('deleteNotification error:', err);
    return next(err);
  }
}
