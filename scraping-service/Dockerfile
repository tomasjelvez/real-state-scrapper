FROM ghcr.io/puppeteer/puppeteer:21.7.0

WORKDIR /app

# Set up permissions
USER root
RUN mkdir -p /app/node_modules && \
    chown -R pptruser:pptruser /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Set ownership of copied files
RUN chown -R pptruser:pptruser /app

# Switch to pptruser for npm operations
USER pptruser

# Install dependencies
RUN npm install

# Copy source code and set ownership
COPY src ./src
RUN chown -R pptruser:pptruser /app/src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"] 