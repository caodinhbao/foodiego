FROM node:18-alpine

WORKDIR /app

# Copy package files trước để cache layer
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY backend/src/ ./src/
COPY frontend/ /frontend/

EXPOSE 3000

CMD ["node", "src/server.js"]
