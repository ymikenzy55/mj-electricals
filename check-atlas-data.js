const mongoose = require('mongoose');
require('dotenv').config();

async function checkAtlasData() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to Atlas!\n');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log('📊 DATABASE OVERVIEW');
    console.log('='.repeat(50));
    console.log(`Database: ${db.databaseName}`);
    console.log(`Total Collections: ${collections.length}\n`);
    
    // Count documents in each collection
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name.padEnd(20)} : ${count} documents`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n💡 To view in Atlas:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Sign in with your Atlas account');
    console.log('3. Click "Browse Collections"');
    console.log('4. Explore your data!\n');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAtlasData();
