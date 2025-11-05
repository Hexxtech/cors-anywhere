FROM node:20-bullseye-slim

# Create app directory
WORKDIR /workspace

# Install app dependencies (will be re-run by devcontainer's postCreateCommand if package.json changes)
COPY package.json package.json
RUN npm ci --only=production || true

# Copy source
COPY . .

# Expose runtime port for Codespaces
EXPOSE 8080

# Default command is handled by devcontainer's postStartCommand ("npm start")
CMD ["node", "server.js"]