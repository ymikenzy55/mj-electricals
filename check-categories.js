// Quick script to check categories in database
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./backend/models/Category');
const Product = require('./backend/models/Product');

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const categories = await Category.find();
    console.log(`📊 Total Categories: ${categories.length}\n`);

    if (categories.length === 0) {
      console.log('❌ No categories found in database!');
      console.log('💡 You need to create categories first via admin dashboard');
    } else {
      console.log('Categories:');
      for (const cat of categories) {
        const productCount = await Product.countDocuments({ 
          category: cat.name,
          status: 'active'
        });
        console.log(`  - ${cat.name}: ${productCount} products (Active: ${cat.isActive})`);
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCategories();
