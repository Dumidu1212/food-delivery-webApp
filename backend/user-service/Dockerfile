# backend/user-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1) Bring in shared/common utilities
COPY backend/common ./common

# 2) Copy only package files for faster rebuilds
COPY backend/user-service/package*.json ./

# 3) Install production dependencies
RUN npm ci --only=production

# 4) Copy the rest of the user‑service code
COPY backend/user-service ./

# 5) Expose and run
EXPOSE ${PORT:-3001}
CMD ["node", "src/app.js"]
