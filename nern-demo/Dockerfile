FROM node:22-alpine

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application code
COPY server/ ./server/

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]