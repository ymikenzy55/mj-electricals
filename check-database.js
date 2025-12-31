// Quick script to check MongoDB database
require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB\n');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Check Users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({}).select('name email role isActive');
    console.log(`👥 Users (${users.length}):`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });
    console.log('');

    // Check Products
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({}).select('productId name category price stock status');
    console.log(`📦 Products (${products.length}):`);
    products.forEach(product => {
      console.log(`   - [${product.productId}] ${product.name} - ${product.category} - $${product.price} - Stock: ${product.stock} - ${product.status}`);
    });
    console.log('');

    // Check Categories
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
    const categories = await Category.find({}).select('name description isActive');
    console.log(`📁 Categories (${categories.length}):`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} ${cat.description ? '- ' + cat.description : ''} - Active: ${cat.isActive}`);
    });
    console.log('');

    // Check Orders
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const orders = await Order.find({}).select('user totalAmount status createdAt').populate('user', 'name email');
    console.log(`🛒 Orders (${orders.length}):`);
    orders.forEach(order => {
      const userName = order.user ? order.user.name : 'Unknown';
      console.log(`   - ${userName} - $${order.totalAmount} - ${order.status} - ${new Date(order.createdAt).toLocaleDateString()}`);
    });
    console.log('');

    // Check Feedbacks
    const Feedback = mongoose.model('Feedback', new mongoose.Schema({}, { strict: false, strictPopulate: false }));
    const feedbacks = await Feedback.find({}).select('user message status createdAt').populate('user', 'name');
    console.log(`💬 Feedbacks (${feedbacks.length}):`);
    feedbacks.forEach(fb => {
      const userName = fb.user && fb.user.name ? fb.user.name : 'Unknown';
      const msg = fb.message ? fb.message.substring(0, 50) : 'No message';
      console.log(`   - ${userName} - ${fb.status} - ${msg}...`);
    });
    console.log('');

    console.log('✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkDatabase();
