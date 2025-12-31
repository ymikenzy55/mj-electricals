require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

const resetAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete ALL users
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} users\n`);

    // Create fresh super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@mje.com',
      password: 'SuperAdmin@123',
      role: 'superadmin'
    });

    console.log('✅ Created fresh Super Admin:');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: SuperAdmin@123`);
    console.log(`   Role: ${superAdmin.role}\n`);

    console.log('🎉 Database reset complete!');
    console.log('\n📝 You can now:');
    console.log('1. Login as super admin with the credentials above');
    console.log('2. Create new admin accounts from super admin dashboard');
    console.log('3. Users can register new accounts normally\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

console.log('⚠️  WARNING: This will DELETE ALL USERS and create a fresh super admin!');
console.log('Press Ctrl+C now to cancel, or wait 3 seconds to continue...\n');

setTimeout(resetAllUsers, 3000);
