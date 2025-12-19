const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bepizza';
    // Set connection timeout to 5 seconds
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error('Error connecting to MongoDB:', error.message);
    console.error('⚠️  MongoDB is not running. Some features will not work.');
    console.error('💡 To start MongoDB, run: mongod (or start MongoDB service)');
    // Don't exit in development - allow server to start even if DB is not available
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Export connection status
module.exports = connectDB;
module.exports.isConnected = () => isConnected;

