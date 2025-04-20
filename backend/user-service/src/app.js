import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health‑check
app.get('/health', (_req, res) => res.sendStatus(200));

// Mount your user routes
app.use('/api/users', userRoutes);

// Connect to Mongo & start
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('🗄️  Connected to MongoDB');
    app.listen(PORT, () => console.log(`👤 User Service listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  });
