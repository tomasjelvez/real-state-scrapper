FROM ghcr.io/puppeteer/puppeteer:22.8.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
WORKDIR /app

# Set up permissions as root
USER root
RUN mkdir -p /app/node_modules && \
    chown -R pptruser:pptruser /app

# Copy all files first
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Set ownership of all files while still root
RUN chown -R pptruser:pptruser /app

# Switch to pptruser for remaining operations
USER pptruser

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"] 