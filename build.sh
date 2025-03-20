#!/bin/bash
# exit on error
set -o errexit

# Print node version for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install global dependencies needed for build
echo "Installing global dependencies..."
npm install -g terser

# Install dependencies for both frontend and backend
echo "Installing dependencies..."
npm install
cd backend
npm install
cd ../frontend
# Make sure terser is installed in the frontend
npm install terser --save-dev
npm install
cd ..

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Copy frontend build to a location accessible by the backend
echo "Copying frontend build to backend..."
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

# Set production environment
export NODE_ENV=production

# Create a start script in the root directory
echo "console.log('Starting the application in ' + process.env.NODE_ENV + ' mode');" > start.js
echo "process.env.NODE_ENV = process.env.NODE_ENV || 'production';" >> start.js
echo "require('./backend/index.js');" >> start.js 