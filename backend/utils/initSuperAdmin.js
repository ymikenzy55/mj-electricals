const User = require('../models/User');

const initSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superAdminExists) {
      const superAdmin = await User.create({
        name: 'Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@mje.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
        role: 'superadmin'
      });
      
      console.log('✅ Default Super Admin created successfully');
      console.log(`Email: ${superAdmin.email}`);
    } else {
      console.log('✅ Super Admin already exists');
    }
  } catch (error) {
    console.error('Error creating Super Admin:', error.message);
  }
};

module.exports = initSuperAdmin;
