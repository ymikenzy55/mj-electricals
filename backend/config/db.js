const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds - increased for Render
      socketTimeoutMS: 75000, // 75 seconds - increased for slow connections
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 30000, // 30 seconds - increased for initial connection
      retryWrites: true,
      retryReads: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit immediately - let Render retry
    console.error('MongoDB connection failed. Server will retry...');
    setTimeout(() => connectDB(), 5000); // Retry after 5 seconds
  }
};

module.exports = connectDB;
