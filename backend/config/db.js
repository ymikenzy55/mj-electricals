const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add aggressive connection options for slow Atlas connections
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      // Force read from primary to avoid slow secondary reads
      readPreference: 'primary',
      // Compress network traffic
      compressors: 'zlib',
      // Reduce connection overhead
      maxIdleTimeMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set default query timeout
    mongoose.set('maxTimeMS', 25000); // 25 second max for any query
    
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
