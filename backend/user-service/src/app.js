import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.get('/health', (_,_res) => _res.sendStatus(200));
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => app.listen(process.env.PORT, () => console.log(`🟢 User Service on ${process.env.PORT}`)))
  .catch(err => console.error(err));
