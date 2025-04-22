// backend/user-service/src/services/notificationService.js
import axios from 'axios'
import logger from '../utils/logger.js'

const { info, error } = logger
const NOTIF_BASE = process.env.NOTIFICATION_SERVICE_URL.replace(/\/$/, '') + '/api/notifications'

/**
 * Dispatches an in‑app, email or sms notification via the Notification Service.
 *
 * @param {Object} opts
 * @param {string} opts.userId     Mongo ObjectId of the recipient
 * @param {'in-app'|'email'|'sms'} opts.type
 * @param {{title:string,message:string,link?:string}} opts.payload
 * @param {string} opts.email      (optional) recipient email
 * @param {string} opts.phone      (optional) recipient phone number
 * @param {string} opts.authHeader raw "Bearer …" header
 */
export async function dispatchNotification({ userId, type, payload, email, phone, authHeader }) {
  try {
    await axios.post(
      NOTIF_BASE,
      { recipient: userId, type, payload, email, phone },
      { headers: { Authorization: authHeader } }
    )
    info(`Notification [${type}] dispatched to user ${userId}`)
  } catch (err) {
    error(`Notification dispatch failed for user ${userId} [${type}]:`, err.message)
  }
}
