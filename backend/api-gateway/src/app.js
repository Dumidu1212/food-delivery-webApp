// backend/api-gateway/src/app.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// Health‐check
app.get('/health', (_req, res) => {
  res.sendStatus(200);
});

// Helper to mount a proxy
function mountProxy(path, targetEnvVar) {
  const target = process.env[targetEnvVar];
  if (!target) {
    console.error(
      `❌  Missing environment variable ${targetEnvVar} for proxy at ${path}`
    );
    process.exit(1);
  }
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: '' },
      logLevel: 'debug',
    })
  );
  console.log(`🔀  Proxy mounted: ${path} → ${target}`);
}

// Mount our microservice proxies
mountProxy('/api/users', 'USER_SERVICE_URL');
mountProxy('/api/restaurants', 'RESTAURANT_SERVICE_URL');
mountProxy('/api/orders', 'ORDER_SERVICE_URL');
mountProxy('/api/delivery', 'DELIVERY_SERVICE_URL');
mountProxy('/api/payments', 'PAYMENT_SERVICE_URL');
mountProxy('/api/notifications', 'NOTIFICATION_SERVICE_URL');

app.listen(PORT, () =>
  console.log(`🚀 API Gateway listening on port ${PORT}`)
);
