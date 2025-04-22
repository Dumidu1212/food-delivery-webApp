// server.js
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { info, error } from './utils/logger.js';

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const server = http.createServer(app);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    info(`✅ Connected to MongoDB`);
    server.listen(PORT, () => info(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => {
    error(`❌ MongoDB connection error:`, err);
    process.exit(1);
  });

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  error('🔥 Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

// Graceful shutdown
const gracefulShutdown = () => {
  info('🛑 Shutdown signal received, closing server...');
  server.close(() => {
    info('💤 HTTP server closed');
    mongoose.connection.close(false, () => {
      info('💾 MongoDB connection closed');
      process.exit(0);
    });
  });

  // force kill if not closed within 10s
  setTimeout(() => {
    error('⚠️  Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
