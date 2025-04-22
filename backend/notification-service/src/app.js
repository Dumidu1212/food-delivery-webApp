// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import notificationRoutes from './routes/notificationRoutes.js';
import { protect }           from './services/authService.js';
import logger, { errorHandler } from './utils/logger.js'

const { info, error } = logger

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.sendStatus(200));

app.use('/api/notifications', protect, notificationRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️  Connected to MongoDB');
    const PORT = process.env.PORT || 3006;
    app.listen(PORT, () =>
      info(`🔔 Notification Service running on port ${PORT}`)
    );
  })
  .catch(err => {
    error('❌ Mongo connection error:', err)
    process.exit(1)
  })
