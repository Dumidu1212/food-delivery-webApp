import express from 'express';
import {
  createNotification,
  getUnreadCount,
  listNotifications,
  markAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/unreadCount', getUnreadCount);
router.get('/', listNotifications);
router.patch('/:id/read', markAsRead);

export default router;
