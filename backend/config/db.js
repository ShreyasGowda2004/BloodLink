// server/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
console.log('Loading environment variables in db.js...');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
console.log('MongoDB URI from env:', process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not configured in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Print available collections to verify database structure
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = connectDB;