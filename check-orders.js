const mongoose = require('mongoose');
const Order = require('./backend/models/Order');

const PRODUCTION_DB = 'mongodb+srv://ymikenzy55_db_user:%21%40Password12345@cluster0.tvugnos.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

const checkOrders = async () => {
  try {
    await mongoose.connect(PRODUCTION_DB);
    console.log('✅ Connected to PRODUCTION database\n');

    const orders = await Order.find({}).populate('user', 'name email');
    
    console.log(`📦 Total orders in database: ${orders.length}\n`);

    if (orders.length === 0) {
      console.log('❌ No orders found!');
      console.log('This means either:');
      console.log('1. No orders have been placed yet');
      console.log('2. Order creation is failing\n');
    } else {
      console.log('Orders:\n');
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   User: ${order.user?.name || 'Unknown'} (${order.user?.email || 'N/A'})`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ₵${order.totalAmount}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkOrders();
