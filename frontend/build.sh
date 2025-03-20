#!/bin/bash
# exit on error
set -o errexit

# Print node version for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install
npm install terser --save-dev

# Build the frontend
echo "Building frontend..."
npm run build

# Create a server.js file for static file serving
echo "Creating server.js for static file serving..."
cat > server.js <<EOL
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip compression
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Send index.html for all routes (for SPA client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Frontend server running on port \${PORT}\`);
});
EOL

# Install express for serving static files
npm install express compression --save-prod 