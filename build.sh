#!/bin/bash
# exit on error
set -o errexit

# Print node version for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies for both frontend and backend
echo "Installing dependencies..."
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Create a start script in the root directory
echo "console.log('Starting the application...');" > start.js
echo "require('./backend/index.js');" >> start.js 