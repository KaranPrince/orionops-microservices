# Use a lightweight, specific Node version (Alpine is smallest)
FROM node:20-alpine
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
# Use npm ci for reproducible builds, and only install production dependencies
RUN npm ci --only=production
# Add the application code
COPY app.js .

EXPOSE 3000
# Best practice: Execute the process directly without 'npm start' to handle SIGTERM signals correctly
CMD ["node", "app.js"]