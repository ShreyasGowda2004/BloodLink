#!/bin/bash
# exit on error
set -o errexit

# Print node version for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Create a .env file if it doesn't exist (for Render)
if [ ! -f .env ]; then
  echo "Creating default .env file..."
  cat > .env <<EOL
PORT=5000
NODE_ENV=production
# Add your MongoDB URI when deploying
# MONGODB_URI=your_mongodb_connection_string
EOL
fi

echo "Backend is ready to start" 