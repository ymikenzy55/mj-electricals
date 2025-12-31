const mongoose = require('mongoose');
require('dotenv').config();

// Models
const User = require('./backend/models/User');
const Product = require('./backend/models/Product');
const Category = require('./backend/models/Category');
const Order = require('./backend/models/Order');
const Feedback = require('./backend/models/Feedback');
const Review = require('./backend/models/Review');
const DeliveryCharge = require('./backend/models/DeliveryCharge');
const Banner = require('./backend/models/Banner');

const localURI = 'mongodb://localhost:27017/ecommerce';
const atlasURI = process.env.MONGODB_URI;

async function migrateData() {
    try {
        console.log('🔄 Starting data migration from local to Atlas...\n');

        // Connect to local MongoDB
        console.log('📡 Connecting to local MongoDB...');
        const localConn = await mongoose.createConnection(localURI).asPromise();
        console.log('✅ Connected to local MongoDB\n');

        // Get all data from local
        console.log('📥 Fetching data from local database...');
        const LocalUser = localConn.model('User', User.schema);
        const LocalProduct = localConn.model('Product', Product.schema);
        const LocalCategory = localConn.model('Category', Category.schema);
        const LocalOrder = localConn.model('Order', Order.schema);
        const LocalFeedback = localConn.model('Feedback', Feedback.schema);
        const LocalReview = localConn.model('Review', Review.schema);
        const LocalDeliveryCharge = localConn.model('DeliveryCharge', DeliveryCharge.schema);
        const LocalBanner = localConn.model('Banner', Banner.schema);

        const users = await LocalUser.find({});
        const products = await LocalProduct.find({});
        const categories = await LocalCategory.find({});
        const orders = await LocalOrder.find({});
        const feedbacks = await LocalFeedback.find({});
        const reviews = await LocalReview.find({});
        const deliveryCharges = await LocalDeliveryCharge.find({});
        const banners = await LocalBanner.find({});

        console.log(`   👥 Users: ${users.length}`);
        console.log(`   📦 Products: ${products.length}`);
        console.log(`   📁 Categories: ${categories.length}`);
        console.log(`   🛒 Orders: ${orders.length}`);
        console.log(`   💬 Feedbacks: ${feedbacks.length}`);
        console.log(`   ⭐ Reviews: ${reviews.length}`);
        console.log(`   🚚 Delivery Charges: ${deliveryCharges.length}`);
        console.log(`   🎨 Banners: ${banners.length}\n`);

        // Close local connection
        await localConn.close();
        console.log('✅ Local data fetched successfully\n');

        // Connect to Atlas
        console.log('📡 Connecting to MongoDB Atlas...');
        await mongoose.connect(atlasURI);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Insert data into Atlas
        console.log('📤 Uploading data to Atlas...');
        
        // Clear existing data first
        console.log('   🗑️  Clearing existing Atlas data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Feedback.deleteMany({});
        await Review.deleteMany({});
        await DeliveryCharge.deleteMany({});
        await Banner.deleteMany({});
        console.log('   ✅ Existing data cleared\n');
        
        if (users.length > 0) {
            // Insert users without validation to preserve hashed passwords
            await User.collection.insertMany(users.map(u => u.toObject()));
            console.log(`   ✅ Migrated ${users.length} users`);
        }
        
        if (categories.length > 0) {
            await Category.insertMany(categories);
            console.log(`   ✅ Migrated ${categories.length} categories`);
        }
        
        if (products.length > 0) {
            await Product.insertMany(products);
            console.log(`   ✅ Migrated ${products.length} products`);
        }
        
        if (orders.length > 0) {
            await Order.collection.insertMany(orders.map(o => o.toObject()));
            console.log(`   ✅ Migrated ${orders.length} orders`);
        }
        
        if (feedbacks.length > 0) {
            await Feedback.insertMany(feedbacks);
            console.log(`   ✅ Migrated ${feedbacks.length} feedbacks`);
        }
        
        if (reviews.length > 0) {
            await Review.insertMany(reviews);
            console.log(`   ✅ Migrated ${reviews.length} reviews`);
        }
        
        if (deliveryCharges.length > 0) {
            await DeliveryCharge.insertMany(deliveryCharges);
            console.log(`   ✅ Migrated ${deliveryCharges.length} delivery charges`);
        }
        
        if (banners.length > 0) {
            await Banner.insertMany(banners);
            console.log(`   ✅ Migrated ${banners.length} banners`);
        }

        console.log('\n🎉 Migration completed successfully!');
        console.log('✅ All data has been copied to MongoDB Atlas\n');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrateData();
