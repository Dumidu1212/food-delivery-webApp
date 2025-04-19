import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🟢 Order Service listening on port ${PORT}`);
});
