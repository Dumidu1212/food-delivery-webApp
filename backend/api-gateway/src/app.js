import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Health-check
app.get('/health', (_req, res) => res.sendStatus(200));

// Proxy /api/users/* → user-service
app.use(
  '/api/users',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL, // e.g. http://localhost:3001
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' }
  })
);

// (Later) add proxies for /api/restaurants, /api/orders, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 API Gateway listening on port ${PORT}`);
});
