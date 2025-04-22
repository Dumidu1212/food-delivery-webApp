FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ARG SERVICE_PORT
ENV PORT=${SERVICE_PORT:-3003}
EXPOSE ${PORT}
CMD ["npm", "run", "start"]
