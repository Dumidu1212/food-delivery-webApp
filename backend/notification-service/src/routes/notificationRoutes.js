import express from 'express';
import {
  createNotification,
  getUnreadCount,
  listNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/unreadCount', getUnreadCount);
router.get('/', listNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id',      deleteNotification);

export default router;
