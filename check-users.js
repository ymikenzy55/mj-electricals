require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allUsers = await User.find({}).select('+password');
    
    console.log(`📊 Total users in database: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
      console.log('The super admin should be created automatically when the backend starts.');
      process.exit(0);
    }

    console.log('👥 Users:\n');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.role.toUpperCase()}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Has Password: ${user.password ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Active: ${user.isActive ? 'YES' : 'NO'}`);
      console.log('');
    });

    // Check specifically for super admin
    const superAdmin = allUsers.find(u => u.role === 'superadmin');
    if (superAdmin) {
      console.log('\n🔐 Super Admin Login:');
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Password: SuperAdmin@123 (if not changed)`);
    } else {
      console.log('\n❌ No super admin found!');
      console.log('Run the backend server to create the super admin automatically.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
