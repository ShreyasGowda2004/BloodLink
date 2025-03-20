// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const connectDB = require('./config/db');
const donorRoutes = require('./routes/donors');
const requestRoutes = require('./routes/requests');
const otpRoutes = require('./routes/otp');

// Load environment variables
console.log('Loading environment variables...');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://bloodlink-frontend.onrender.com', 'https://*.onrender.com'],
  credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  
  // Capture response data
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log('Error response:', data);
    }
    return originalSend.call(this, data);
  };
  
  next();
});

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/otp', otpRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    env: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
  });
});

// Route not found
app.use((req, res, next) => {
  console.error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:');
  console.error(err);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message || 'No error message available'
  });
});

// Function to try starting the server with a given port
const tryStartServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying next port...`);
        server.close();
        resolve(false);
      } else {
        reject(error);
      }
    });
    
    server.on('listening', () => {
      console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
      console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
      resolve(true);
    });
    
    server.listen(port);
  });
};

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connection successful');
    
    // Try starting the server with initial PORT
    let port = PORT;
    let started = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!started && attempts < maxAttempts) {
      started = await tryStartServer(port);
      if (!started) {
        port++; // Try next port
        attempts++;
      }
    }
    
    if (!started) {
      console.error(`Could not start server after ${maxAttempts} attempts`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to start server:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
};

startServer();
