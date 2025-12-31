require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

const fixOldAccounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users without passwords (Google OAuth users)
    const usersWithoutPassword = await User.find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    });

    console.log(`\n📊 Found ${usersWithoutPassword.length} users without passwords\n`);

    if (usersWithoutPassword.length === 0) {
      console.log('✅ All users already have passwords!');
      process.exit(0);
    }

    // Update each user with a default password
    for (const user of usersWithoutPassword) {
      // Set default password based on role
      let defaultPassword;
      if (user.role === 'superadmin') {
        defaultPassword = 'SuperAdmin@123';
      } else if (user.role === 'admin') {
        defaultPassword = 'Admin@123';
      } else {
        defaultPassword = 'User@123456';
      }

      user.password = defaultPassword;
      await user.save();

      console.log(`✅ Updated ${user.role}: ${user.email}`);
      console.log(`   Default password: ${defaultPassword}\n`);
    }

    console.log('\n🎉 All accounts fixed successfully!');
    console.log('\n📝 Summary:');
    console.log('- Super Admin: SuperAdmin@123');
    console.log('- Admin: Admin@123');
    console.log('- Regular Users: User@123456');
    console.log('\n⚠️  Users should change their passwords after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixOldAccounts();
