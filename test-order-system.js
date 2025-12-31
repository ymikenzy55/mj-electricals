const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./backend/models/User');
const Order = require('./backend/models/Order');
const Product = require('./backend/models/Product');

async function testOrderSystem() {
  try {
    console.log('🔍 Testing Order System...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database\n');

    // Check users
    const users = await User.find({}).select('name email role createdAt');
    console.log(`👥 Users in database: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt.toLocaleDateString()}`);
    });
    console.log('');

    // Check products
    const products = await Product.find({}).select('name productId price stock');
    console.log(`📦 Products in database: ${products.length}`);
    console.log(`   - In stock: ${products.filter(p => p.stock > 0).length}`);
    console.log(`   - Out of stock: ${products.filter(p => p.stock === 0).length}`);
    console.log('');

    // Check orders
    const orders = await Order.find({})
      .populate('user', 'name email')
      .select('user status totalAmount createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`🛒 Recent Orders: ${orders.length}`);
    if (orders.length > 0) {
      orders.forEach(order => {
        const userName = order.user ? order.user.name : 'Unknown User';
        const userEmail = order.user ? order.user.email : 'No email';
        console.log(`   - Order ${order._id.toString().slice(-8)} - ${userName} (${userEmail})`);
        console.log(`     Status: ${order.status} | Amount: GH₵${order.totalAmount} | Date: ${order.createdAt.toLocaleString()}`);
      });
    } else {
      console.log('   No orders found');
    }
    console.log('');

    // Check for orphaned orders (orders with deleted users)
    const allOrders = await Order.find({});
    const orphanedOrders = [];
    
    for (const order of allOrders) {
      const userExists = await User.findById(order.user);
      if (!userExists) {
        orphanedOrders.push(order);
      }
    }

    if (orphanedOrders.length > 0) {
      console.log(`⚠️  Found ${orphanedOrders.length} orphaned orders (user deleted):`);
      orphanedOrders.forEach(order => {
        console.log(`   - Order ${order._id.toString().slice(-8)} - User ID: ${order.user}`);
      });
      console.log('   💡 These orders should be cleaned up or reassigned\n');
    } else {
      console.log('✅ No orphaned orders found\n');
    }

    // System health check
    console.log('📊 System Health:');
    console.log(`   ✅ Database connection: OK`);
    console.log(`   ${users.length > 0 ? '✅' : '⚠️ '} Users: ${users.length > 0 ? 'OK' : 'No users - register accounts'}`);
    console.log(`   ${products.length > 0 ? '✅' : '⚠️ '} Products: ${products.length > 0 ? 'OK' : 'No products'}`);
    console.log(`   ${orders.length > 0 ? '✅' : '⚠️ '} Orders: ${orders.length > 0 ? 'OK' : 'No orders yet'}`);
    console.log(`   ${orphanedOrders.length === 0 ? '✅' : '⚠️ '} Data integrity: ${orphanedOrders.length === 0 ? 'OK' : 'Issues found'}`);
    console.log('');

    // Recommendations
    console.log('💡 Recommendations:');
    if (users.length === 0) {
      console.log('   1. Register new user accounts through the website');
    }
    if (orders.length === 0 && users.length > 0) {
      console.log('   1. Test order creation by placing an order');
    }
    if (orphanedOrders.length > 0) {
      console.log('   1. Clean up orphaned orders or reassign them');
    }
    if (users.length > 0 && products.length > 0 && orders.length === 0) {
      console.log('   1. System ready for testing - place a test order!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Test complete');
  }
}

testOrderSystem();
