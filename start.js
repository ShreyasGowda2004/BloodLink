console.log('Starting the BloodLink application...');
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log('Loading backend from ./backend/index.js');

try {
  // Set environment variables for production
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  
  // Load the backend server
  require('./backend/index.js');
} catch (error) {
  console.error('Error starting the application:');
  console.error(error);
  process.exit(1);
} 