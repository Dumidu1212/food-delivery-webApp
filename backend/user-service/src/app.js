// backend/user-service/src/app.js
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes  from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import logger, { errorHandler } from './utils/logger.js'

const { info, error } = logger


dotenv.config()

const app = express()
app.use(express.json())

// Health‑check
app.get('/health', (_req, res) => res.sendStatus(200))

// Public + auth routes
app.use('/api/users', userRoutes)

// Admin‑only routes
app.use('/api/users/admin', adminRoutes)

app.use(errorHandler);

// Connect to Mongo and start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info('🗄️  Connected to MongoDB')
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () =>
      info(`👤 User Service listening on port ${PORT}`)
    )
  })
  .catch(err => {
    error('❌ Mongo connection error:', err)
    process.exit(1)
  })
