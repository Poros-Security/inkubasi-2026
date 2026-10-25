FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies dengan legacy-peer-deps untuk React 19
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port internal container (Next.js default)
EXPOSE 3000

# Health check ke port internal 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
