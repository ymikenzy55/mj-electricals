const mongoose = require('mongoose');
const Order = require('./backend/models/Order');

// PRODUCTION MongoDB Atlas connection string
const PRODUCTION_DB = 'mongodb+srv://ymikenzy55_db_user:%21%40Password12345@cluster0.tvugnos.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

const deleteAllOrders = async () => {
  try {
    console.log('🔗 Connecting to PRODUCTION MongoDB Atlas...\n');
    await mongoose.connect(PRODUCTION_DB);
    console.log('✅ Connected to PRODUCTION database\n');

    // Delete ALL orders
    const result = await Order.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} orders from PRODUCTION\n`);

    console.log('🎉 All orders deleted successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

console.log('⚠️  WARNING: This will DELETE ALL ORDERS from PRODUCTION!');
console.log('Press Ctrl+C now to cancel, or wait 3 seconds to continue...\n');

setTimeout(deleteAllOrders, 3000);
