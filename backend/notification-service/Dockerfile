# notification-service/Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ARG PORT=3006
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node","src/app.js"]
