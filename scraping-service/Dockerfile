FROM ghcr.io/puppeteer/puppeteer:21.7.0

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"] 