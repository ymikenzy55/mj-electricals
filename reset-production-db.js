const mongoose = require('mongoose');
const User = require('./backend/models/User');

// PRODUCTION MongoDB Atlas connection string
const PRODUCTION_DB = 'mongodb+srv://ymikenzy55_db_user:%21%40Password12345@cluster0.tvugnos.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

const resetProductionDB = async () => {
  try {
    console.log('🔗 Connecting to PRODUCTION MongoDB Atlas...\n');
    await mongoose.connect(PRODUCTION_DB);
    console.log('✅ Connected to PRODUCTION database\n');

    // Delete ALL users
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} users from PRODUCTION\n`);

    // Create fresh super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@mje.com',
      password: 'SuperAdmin@123',
      role: 'superadmin'
    });

    console.log('✅ Created fresh Super Admin in PRODUCTION:');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: SuperAdmin@123`);
    console.log(`   Role: ${superAdmin.role}\n`);

    console.log('🎉 PRODUCTION database reset complete!');
    console.log('\n📝 You can now login on your live site:');
    console.log('   https://mj-electricals-nine.vercel.app/pages/login.html');
    console.log('\n   Email: superadmin@mje.com');
    console.log('   Password: SuperAdmin@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

console.log('⚠️  WARNING: This will DELETE ALL USERS from PRODUCTION and create a fresh super admin!');
console.log('Press Ctrl+C now to cancel, or wait 3 seconds to continue...\n');

setTimeout(resetProductionDB, 3000);
