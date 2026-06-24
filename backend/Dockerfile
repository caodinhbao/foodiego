FROM node:18-alpine

WORKDIR /app

# Copy package files trước để cache layer
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/server.js"]
