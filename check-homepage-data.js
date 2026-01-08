// Check if banners and categories exist in database
require('dotenv').config();
const mongoose = require('mongoose');

const Banner = require('./backend/models/Banner');
const Category = require('./backend/models/Category');
const Product = require('./backend/models/Product');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check banners
    const banners = await Banner.find();
    console.log(`📸 BANNERS: ${banners.length} total`);
    const activeBanners = banners.filter(b => b.isActive === 'active');
    console.log(`   Active: ${activeBanners.length}`);
    if (activeBanners.length > 0) {
      activeBanners.forEach(b => {
        console.log(`   - ${b.title} (${b.isActive})`);
      });
    } else {
      console.log('   ⚠️  NO ACTIVE BANNERS - Add banners in admin panel!');
    }

    console.log('');

    // Check categories
    const categories = await Category.find();
    console.log(`📁 CATEGORIES: ${categories.length} total`);
    const activeCategories = categories.filter(c => c.isActive);
    console.log(`   Active: ${activeCategories.length}`);
    if (activeCategories.length > 0) {
      activeCategories.forEach(c => {
        console.log(`   - ${c.name} (${c.isActive ? 'active' : 'inactive'})`);
      });
    } else {
      console.log('   ⚠️  NO ACTIVE CATEGORIES - Add categories in admin panel!');
    }

    console.log('');

    // Check featured products
    const featuredProducts = await Product.find({ featured: true, status: 'active' });
    console.log(`⭐ FEATURED PRODUCTS: ${featuredProducts.length}`);
    if (featuredProducts.length > 0) {
      featuredProducts.slice(0, 5).forEach(p => {
        console.log(`   - ${p.name} (${p.productId})`);
      });
      if (featuredProducts.length > 5) {
        console.log(`   ... and ${featuredProducts.length - 5} more`);
      }
    } else {
      console.log('   ⚠️  NO FEATURED PRODUCTS - Mark products as featured in admin panel!');
    }

    console.log('\n✅ Check complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();
