#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies for both frontend and backend
echo "Installing dependencies..."
npm install
npm run install:all

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Make the backend directory the root for the app
echo "Setting up backend..."
cp -r backend/* .
mkdir -p .render

# Create a file that tells Render how to start the app
echo '#!/usr/bin/env bash
node index.js' > .render/start.sh

chmod +x .render/start.sh 